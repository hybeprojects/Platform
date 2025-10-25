require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const redis = require('redis');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const db = require('./db');

const { Server } = require("socket.io");
const http = require('http');

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const port = process.env.PORT || 3000;

// Redis client setup
const redisClient = redis.createClient({
  url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
});

redisClient.on('error', (err) => {
  console.error('Redis error:', err);
});

redisClient.connect();

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
  service: 'gmail', // Or your preferred email service
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

app.use(bodyParser.json());

// In-memory store for referral codes for now
const validReferralCodes = ['HYBE123', 'BTSARMY', 'BORAHAE'];

app.post('/signup', async (req, res) => {
  const { fullName, email, password, referralCode } = req.body;

  if (!fullName || !email || !password || !referralCode) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  if (!validReferralCodes.includes(referralCode)) {
    return res.status(400).json({ error: 'Invalid referral code.' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await db.query(
      'INSERT INTO users (full_name, email, password, referral_code) VALUES ($1, $2, $3, $4) RETURNING *',
      [fullName, email, hashedPassword, referralCode]
    );

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = await bcrypt.hash(otp, 10);

    // Store OTP in Redis with a 10-minute expiry
    await redisClient.set(email, hashedOtp, { EX: 600 });

    // Send OTP email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'HYBE Celebrity Connect - Email Verification',
      text: `Your OTP for email verification is: ${otp}`,
    };

    await transporter.sendMail(mailOptions);
    res.status(201).json({ message: 'User signed up successfully. An OTP has been sent to your email.' });
  } catch (error) {
    console.error('Error during signup:', error);
    res.status(500).json({ error: 'An error occurred during signup.' });
  }
});

app.post('/conversations', async (req, res) => {
  const { userId, artistId } = req.body;

  if (!userId || !artistId) {
    return res.status(400).json({ error: 'userId and artistId are required.' });
  }

  try {
    // Check if a conversation already exists
    let conversation = await db.query(
      'SELECT * FROM conversations WHERE user_id = $1 AND artist_id = $2',
      [userId, artistId]
    );

    if (conversation.rows.length === 0) {
      // If not, create a new one
      conversation = await db.query(
        'INSERT INTO conversations (user_id, artist_id) VALUES ($1, $2) RETURNING *',
        [userId, artistId]
      );
    }

    res.status(201).json(conversation.rows[0]);
  } catch (error) {
    console.error('Error creating or getting conversation:', error);
    res.status(500).json({ error: 'An error occurred while managing the conversation.' });
  }
});

app.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ error: 'Email and OTP are required.' });
  }

  try {
    const storedOtp = await redisClient.get(email);

    if (!storedOtp) {
      return res.status(400).json({ error: 'OTP has expired or is invalid.' });
    }

    const isOtpValid = await bcrypt.compare(otp, storedOtp);

    if (!isOtpValid) {
      return res.status(400).json({ error: 'Invalid OTP.' });
    }

    await db.query('UPDATE users SET is_verified = TRUE WHERE email = $1', [email]);

    await redisClient.del(email);

    res.status(200).json({ message: 'Email verified successfully.' });
  } catch (error) {
    console.error('Error during OTP verification:', error);
    res.status(500).json({ error: 'An error occurred during OTP verification.' });
  }
});

app.post('/messages', async (req, res) => {
  const { conversationId, senderId, content } = req.body;

  if (!conversationId || !senderId || !content) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }

  try {
    const newMessage = await db.query(
      'INSERT INTO messages (conversation_id, sender_id, content) VALUES ($1, $2, $3) RETURNING *',
      [conversationId, senderId, content]
    );

    io.to(conversationId).emit('chat message', newMessage.rows[0]);

    res.status(201).json({ message: 'Message sent successfully.' });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'An error occurred while sending the message.' });
  }
});

app.get('/messages/:conversationId', async (req, res) => {
  const { conversationId } = req.params;

  try {
    const messages = await db.query(
      'SELECT * FROM messages WHERE conversation_id = $1 ORDER BY created_at ASC',
      [conversationId]
    );

    res.status(200).json(messages.rows);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'An error occurred while fetching messages.' });
  }
});

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('join conversation', (conversationId) => {
    socket.join(conversationId);
  });

  socket.on('chat message', (msg) => {
    io.to(msg.conversationId).emit('chat message', msg);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  // TODO: Implement login logic

  res.status(200).json({ message: 'Login successful.' });
});

module.exports = server;

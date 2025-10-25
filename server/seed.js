const bcrypt = require('bcryptjs');
const db = require('./db');
require('dotenv').config();

const btsMembers = [
  { fullName: 'RM', email: 'rm@hybe.com', password: 'password123', isVerified: true, referralCode: 'HYBE_INTERNAL' },
  { fullName: 'Jin', email: 'jin@hybe.com', password: 'password123', isVerified: true, referralCode: 'HYBE_INTERNAL' },
  { fullName: 'Suga', email: 'suga@hybe.com', password: 'password123', isVerified: true, referralCode: 'HYBE_INTERNAL' },
  { fullName: 'J-Hope', email: 'jhope@hybe.com', password: 'password123', isVerified: true, referralCode: 'HYBE_INTERNAL' },
  { fullName: 'Jimin', email: 'jimin@hybe.com', password: 'password123', isVerified: true, referralCode: 'HYBE_INTERNAL' },
  { fullName: 'V', email: 'v@hybe.com', password: 'password123', isVerified: true, referralCode: 'HYBE_INTERNAL' },
  { fullName: 'Jungkook', email: 'jungkook@hybe.com', password: 'password123', isVerified: true, referralCode: 'HYBE_INTERNAL' },
];

async function seed() {
  for (const member of btsMembers) {
    const hashedPassword = await bcrypt.hash(member.password, 10);
    await db.query(
      'INSERT INTO users (full_name, email, password, is_verified, referral_code) VALUES ($1, $2, $3, $4, $5)',
      [member.fullName, member.email, hashedPassword, member.isVerified, member.referralCode]
    );
  }
  console.log('Database seeded with BTS members.');
}

seed().catch(console.error);

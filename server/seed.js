const bcrypt = require('bcryptjs');
const db = require('./db');
require('dotenv').config();

const btsMembers = [
  { fullName: 'RM', email: 'rm@hybe.com', password: 'password123', isVerified: true },
  { fullName: 'Jin', email: 'jin@hybe.com', password: 'password123', isVerified: true },
  { fullName: 'Suga', email: 'suga@hybe.com', password: 'password123', isVerified: true },
  { fullName: 'J-Hope', email: 'jhope@hybe.com', password: 'password123', isVerified: true },
  { fullName: 'Jimin', email: 'jimin@hybe.com', password: 'password123', isVerified: true },
  { fullName: 'V', email: 'v@hybe.com', password: 'password123', isVerified: true },
  { fullName: 'Jungkook', email: 'jungkook@hybe.com', password: 'password123', isVerified: true },
];

async function seed() {
  const referralCodeResult = await db.query(
    "INSERT INTO referral_codes (code) VALUES ('HYBE_INTERNAL') RETURNING id"
  );
  const referralCodeId = referralCodeResult.rows[0].id;

  for (const member of btsMembers) {
    const hashedPassword = await bcrypt.hash(member.password, 10);
    await db.query(
      'INSERT INTO users (full_name, email, password, is_verified, referral_code_id) VALUES ($1, $2, $3, $4, $5)',
      [member.fullName, member.email, hashedPassword, member.isVerified, referralCodeId]
    );
  }
  console.log('Database seeded with BTS members.');
}

seed().catch(console.error);

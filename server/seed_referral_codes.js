const db = require('./db');
require('dotenv').config();

const referralCodes = [
  { code: 'HYBE123' },
  { code: 'BTSARMY' },
  { code: 'BORAHAE' },
];

async function seedReferralCodes() {
  for (const code of referralCodes) {
    await db.query(
      'INSERT INTO referral_codes (code) VALUES ($1)',
      [code.code]
    );
  }
  console.log('Database seeded with referral codes.');
}

seedReferralCodes().catch(console.error);

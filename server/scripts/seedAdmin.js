const dotenv = require('dotenv');
const path = require('path');
const mongoose = require('mongoose');
const Admin = require('../models/Admin');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const seedAdmin = async () => {
  const { MONGO_URI, ADMIN_SEED_EMAIL, ADMIN_SEED_PASSWORD } = process.env;

  if (!MONGO_URI || !ADMIN_SEED_EMAIL || !ADMIN_SEED_PASSWORD) {
    console.error('Missing seed environment variables');
    process.exit(1);
  }

  await mongoose.connect(MONGO_URI);

  const existing = await Admin.findOne({ email: ADMIN_SEED_EMAIL.toLowerCase() });
  if (existing) {
    console.log('Admin already exists');
    await mongoose.disconnect();
    return;
  }

  await Admin.create({
    email: ADMIN_SEED_EMAIL.toLowerCase(),
    password: ADMIN_SEED_PASSWORD,
    role: 'admin'
  });

  console.log('Admin user created');
  await mongoose.disconnect();
};

seedAdmin().catch((error) => {
  console.error(error);
  process.exit(1);
});

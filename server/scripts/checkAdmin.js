const dotenv = require('dotenv');
const path = require('path');
const mongoose = require('mongoose');
const Admin = require('../models/Admin');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const checkAdmin = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  
  const admin = await Admin.findOne({ email: 'admin@prayogam.org' });
  
  if (!admin) {
    console.log('❌ Admin user not found!');
  } else {
    console.log('✅ Admin user found:');
    console.log('Email:', admin.email);
    console.log('Role:', admin.role);
    console.log('Has password:', !!admin.password);
    
    // Test password
    const testPassword = process.env.ADMIN_SEED_PASSWORD || 'Admin@123456';
    const isMatch = await admin.comparePassword(testPassword);
    console.log(`\nPassword "${testPassword}" matches:`, isMatch);
  }
  
  await mongoose.disconnect();
};

checkAdmin().catch(console.error);

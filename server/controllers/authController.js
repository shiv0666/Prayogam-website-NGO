const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const generateToken = (admin) => {
  return jwt.sign(
    { id: admin._id, email: admin.email, role: admin.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

const buildUserPayload = (account) => ({
  id: account._id,
  email: account.email,
  role: account.role,
  name: account.name || ''
});

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email: email.toLowerCase() });
    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(admin);
    return res.json({
      token,
      user: buildUserPayload(admin)
    });
  } catch (error) {
    return next(error);
  }
};

const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const normalizedEmail = email.toLowerCase();

    const existing = await Admin.findOne({ email: normalizedEmail });
    if (existing) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const account = await Admin.create({
      name,
      email: normalizedEmail,
      password,
      role: 'user'
    });

    const token = generateToken(account);
    return res.status(201).json({
      token,
      user: buildUserPayload(account)
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = { login, register };

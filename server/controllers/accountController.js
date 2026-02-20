const Admin = require('../models/Admin');

const listAccounts = async (req, res, next) => {
  try {
    const accounts = await Admin.find().select('-password').sort({ createdAt: -1 });
    return res.json(accounts);
  } catch (error) {
    return next(error);
  }
};

const createAccount = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    const normalizedEmail = email.toLowerCase();

    const existing = await Admin.findOne({ email: normalizedEmail });
    if (existing) {
      return res.status(409).json({ message: 'Email already exists' });
    }

    const account = await Admin.create({
      name,
      email: normalizedEmail,
      password,
      role
    });

    const safeAccount = account.toObject();
    delete safeAccount.password;

    return res.status(201).json(safeAccount);
  } catch (error) {
    return next(error);
  }
};

const updateAccount = async (req, res, next) => {
  try {
    const { name, role } = req.body;
    const account = await Admin.findByIdAndUpdate(
      req.params.id,
      { name, role },
      { new: true, runValidators: true }
    ).select('-password');

    if (!account) {
      return res.status(404).json({ message: 'Account not found' });
    }

    return res.json(account);
  } catch (error) {
    return next(error);
  }
};

const deleteAccount = async (req, res, next) => {
  try {
    if (req.user.id === req.params.id) {
      return res.status(400).json({ message: 'You cannot delete your own account' });
    }

    const account = await Admin.findByIdAndDelete(req.params.id);
    if (!account) {
      return res.status(404).json({ message: 'Account not found' });
    }

    return res.json({ message: 'Account deleted' });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  listAccounts,
  createAccount,
  updateAccount,
  deleteAccount
};

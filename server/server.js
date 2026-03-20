const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const Admin = require('./models/Admin');

dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();

const allowedOrigins = (process.env.CORS_ORIGIN || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const isAllowedDevOrigin = (origin) => {
  return /^http:\/\/(localhost|127\.0\.0\.1):517[3-5]$/.test(origin);
};

app.use(
  helmet({
    // Allow images/files from backend origin (e.g. :5050) to be consumed by frontend origin (e.g. :5173).
    crossOriginResourcePolicy: { policy: 'cross-origin' }
  })
);
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow non-browser tools and same-origin requests.
      if (!origin) {
        callback(null, true);
        return;
      }

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      if (process.env.NODE_ENV !== 'production' && isAllowedDevOrigin(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error('CORS not allowed'));
    },
    credentials: true
  })
);
app.use(express.json({ limit: '10mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/accounts', require('./routes/accountRoutes'));
app.use('/api/programs', require('./routes/programRoutes'));
app.use('/api/announcements', require('./routes/announcementRoutes'));
app.use('/api/events', require('./routes/eventRoutes'));
app.use('/api/contact', require('./routes/contactRoutes'));
app.use('/api/content', require('./routes/contentRoutes'));
app.use('/api/settings', require('./routes/settingsRoutes'));
app.use('/api/impact-stats', require('./routes/impactStatRoutes'));
app.use('/api/donations', require('./routes/donationRoutes'));
app.use('/api/stories', require('./routes/storyRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes'));
app.use('/api/fund-ledger', require('./routes/fundLedgerRoutes'));
app.use('/api/volunteers', require('./routes/volunteerRoutes'));

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const ensureAdminSeed = async () => {
  const seedEmail = process.env.ADMIN_SEED_EMAIL;
  const seedPassword = process.env.ADMIN_SEED_PASSWORD;

  if (!seedEmail || !seedPassword) {
    return;
  }

  const normalizedEmail = seedEmail.toLowerCase();
  const existing = await Admin.findOne({ email: normalizedEmail });

  if (existing) {
    return;
  }

  await Admin.create({
    email: normalizedEmail,
    password: seedPassword,
    role: 'admin'
  });

  console.log(`Seeded default admin account: ${normalizedEmail}`);
};

connectDB()
  .then(() => {
    return ensureAdminSeed();
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Database connection failed:', error.message);
    process.exit(1);
  });

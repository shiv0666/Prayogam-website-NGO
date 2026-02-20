const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

dotenv.config();

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
  })
);
app.use(express.json({ limit: '1mb' }));

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

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Database connection failed:', error.message);
    process.exit(1);
  });

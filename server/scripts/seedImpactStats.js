const dotenv = require('dotenv');
const path = require('path');
const mongoose = require('mongoose');
const ImpactStat = require('../models/ImpactStat');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const impactStatsData = [
  {
    title: 'Children Reached',
    value: '1.5M+',
    description: 'children and their families reached every year',
    icon: '👨‍👩‍👧‍👦',
    status: 'active',
    order: 1
  },
  {
    title: 'Welfare Projects',
    value: '400+',
    description: 'welfare projects in villages and slums',
    icon: '🏘️',
    status: 'active',
    order: 2
  },
  {
    title: 'Quality Education',
    value: '100,000+',
    description: 'children receive quality education',
    icon: '📚',
    status: 'active',
    order: 3
  },
  {
    title: 'Healthcare Services',
    value: '1,000,000+',
    description: 'people receive healthcare services',
    icon: '🏥',
    status: 'active',
    order: 4
  },
  {
    title: 'Skill Training',
    value: '75,000+',
    description: 'youth receive skill training and employment support',
    icon: '💼',
    status: 'active',
    order: 5
  }
];

const seedImpactStats = async () => {
  const { MONGO_URI } = process.env;

  if (!MONGO_URI) {
    console.error('MONGO_URI is not defined in .env');
    process.exit(1);
  }

  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to database');

    // Clear existing impact stats
    await ImpactStat.deleteMany({});
    console.log('Cleared existing impact stats');

    // Insert new impact stats
    await ImpactStat.insertMany(impactStatsData);
    console.log(`✅ Seeded ${impactStatsData.length} impact statistics`);

    await mongoose.disconnect();
    console.log('Impact stats seed completed');
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedImpactStats();

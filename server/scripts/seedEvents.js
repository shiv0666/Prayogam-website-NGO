const dotenv = require('dotenv');
const path = require('path');
const mongoose = require('mongoose');
const Event = require('../models/Event');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const seedEvents = async () => {
  const { MONGO_URI } = process.env;

  if (!MONGO_URI) {
    console.error('Missing MONGO_URI');
    process.exit(1);
  }

  await mongoose.connect(MONGO_URI);

  const existingCount = await Event.countDocuments();
  if (existingCount > 0) {
    console.log('Events already seeded');
    await mongoose.disconnect();
    return;
  }

  const today = new Date();
  const toDate = (daysAhead) => new Date(today.getTime() + daysAhead * 24 * 60 * 60 * 1000);

  await Event.insertMany([
    {
      title: 'Learning Camp Orientation',
      description: 'Orientation for volunteers and mentors supporting weekend learning camps.',
      date: toDate(7),
      location: 'Nagpur Community Center',
      requirements: {
        volunteersNeeded: 12,
        fundsNeeded: 15000,
        itemsNeeded: 'Notebooks, pens, whiteboard markers'
      },
      status: 'active'
    },
    {
      title: 'Education Awareness Drive',
      description: 'Neighborhood outreach focusing on school attendance and learning continuity.',
      date: toDate(14),
      location: 'Narsala Ward',
      requirements: {
        volunteersNeeded: 8,
        fundsNeeded: 8000,
        itemsNeeded: 'Flyers, banner stand'
      },
      status: 'active'
    },
    {
      title: 'Mentorship Check-in',
      description: 'Monthly check-in for student mentorship program updates.',
      date: toDate(30),
      location: 'Prayogam Office',
      requirements: {
        volunteersNeeded: 4,
        fundsNeeded: 0,
        itemsNeeded: ''
      },
      status: 'active'
    }
  ]);

  console.log('Events seed completed');
  await mongoose.disconnect();
};

seedEvents().catch((error) => {
  console.error(error);
  process.exit(1);
});

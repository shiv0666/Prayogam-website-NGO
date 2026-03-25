const Initiative = require('../models/Initiative');
const Program = require('../models/Program');
const Event = require('../models/Event');

const initiativesData = require('./initiatives.json');
const programsData = require('./programs.json');
const eventsData = require('./events.json');

const parseSeedEnabled = (value) => {
  if (typeof value === 'undefined') {
    return true;
  }

  return ['1', 'true', 'yes', 'on'].includes(String(value).toLowerCase());
};

async function seedDatabase() {
  if (!parseSeedEnabled(process.env.SEED_DB)) {
    console.log('Auto-seed skipped: SEED_DB is disabled');
    return;
  }

  try {
    const initiativeCount = await Initiative.countDocuments();
    const programCount = await Program.countDocuments();
    const eventCount = await Event.countDocuments();

    if (initiativeCount === 0) {
      await Initiative.insertMany(initiativesData);
      console.log('Active Initiatives seeded');
    }

    if (programCount === 0) {
      await Program.insertMany(programsData);
      console.log('Programs seeded');
    }

    if (eventCount === 0) {
      await Event.insertMany(eventsData);
      console.log('Events seeded');
    }
  } catch (error) {
    console.error('Seeding error:', error);
  }
}

module.exports = seedDatabase;

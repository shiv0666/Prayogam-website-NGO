const dotenv = require('dotenv');
const path = require('path');
const mongoose = require('mongoose');
const Content = require('../models/Content');
const Settings = require('../models/Settings');
const Program = require('../models/Program');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const seedContent = async () => {
  const { MONGO_URI } = process.env;

  if (!MONGO_URI) {
    console.error('Missing MONGO_URI');
    process.exit(1);
  }

  await mongoose.connect(MONGO_URI);

  const existingSettings = await Settings.findOne();
  if (!existingSettings) {
    await Settings.create({
      name: 'Prayogam Foundation',
      founder: 'Nilesh G. Sontakke',
      address: 'Shri Satyasai Vidyamandir, Ambika Nagar, Narsala, Nagpur – 440034',
      contact: '8421952167',
      location: 'Nagpur, Maharashtra, India',
      domain: 'Education & social development'
    });
  }

  const contentSeeds = [
    {
      key: 'home',
      title: 'Prayogam Foundation',
      body:
        'Prayogam Foundation is an NGO based in Nagpur, Maharashtra, focused on educational support services. We work with students, schools, and learning communities to strengthen access, awareness, and engagement in education. Our initiatives include educational programs, community awareness, and training that encourage learning continuity and social development.'
    },
    {
      key: 'about',
      title: 'About Prayogam Foundation',
      body:
        'Founded by Nilesh G. Sontakke, Prayogam Foundation supports education and social development in local communities. Our work focuses on practical educational support services that help students and families navigate learning challenges, build awareness, and connect with resources that improve outcomes.'
    },
    {
      key: 'mission',
      title: 'Mission & Vision',
      body:
        'Our mission is to provide educational support services that empower students and strengthen learning communities. We aim to deliver programs, awareness initiatives, and training that help schools and families create inclusive, continuous learning environments. Our vision is a society where every learner has access to meaningful education and community support.'
    }
  ];

  for (const seed of contentSeeds) {
    const existing = await Content.findOne({ key: seed.key });
    if (!existing) {
      await Content.create(seed);
    }
  }

  const programCount = await Program.countDocuments();
  if (programCount === 0) {
    await Program.insertMany([
      {
        title: 'Community Learning Support',
        description:
          'Learning support sessions and resource guidance for students and families to strengthen foundational learning and study habits.',
        status: 'active'
      },
      {
        title: 'Education Awareness & Training',
        description:
          'Awareness programs and training sessions for parents, educators, and community members to encourage educational continuity.',
        status: 'active'
      },
      {
        title: 'Student Mentorship & Guidance',
        description:
          'Mentorship and guidance for students to navigate academic goals, career awareness, and skill-building pathways.',
        status: 'active'
      }
    ]);
  }

  console.log('Content seed completed');
  await mongoose.disconnect();
};

seedContent().catch((error) => {
  console.error(error);
  process.exit(1);
});

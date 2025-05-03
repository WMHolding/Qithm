// api/seedChallenges.js
require('dotenv').config();
const mongoose = require('mongoose');
const Challenge = require('../models/Challenge');

async function seed() {
  console.log('→ Using MONGODB_URI:', process.env.MONGODB_URI);

  const conn = await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log('✅ Connected to DB:', conn.connection.db.databaseName);

  // List existing collections:
  const existing = await conn.connection.db.listCollections().toArray();
  console.log('Collections before seeding:', existing.map(c => c.name));

  // Clear and insert:
  await Challenge.deleteMany({});
  const samples = [
    {
      id:               '1',
      title:            '30-Day Running Streak',
      description:      'Run at least 3km every day for 30 days to build endurance.',
      shortDescription: 'Daily 3km run for 30 days',
      category:         'cardio',
      difficulty:       'medium',
      image:            'https://…/running.jpg',
      participants:     [],
      requirements:     ['Run ≥3km/day', 'Log distance'],
      isFeatured:       true,
      startDate:        new Date(),
      endDate:          new Date(Date.now() + 30*24*60*60*1000),
    },
    {
      id:               '2',
      title:            '100 Push-Ups a Day',
      description:      'Do 100 push-ups every day for 14 days straight.',
      shortDescription: '100 push-ups/day for 14 days',
      category:         'strength',
      difficulty:       'hard',
      image:            'https://…/pushups.jpg',
      participants:     [],
      requirements:     ['Complete 100 push-ups', 'Log sets and reps'],
      isFeatured:       false,
      startDate:        new Date(),
      endDate:          new Date(Date.now() + 14*24*60*60*1000),
    },
    {
      id:               '3',
      title:            'Plank Master',
      description:      'Hold a plank for at least 2 minutes, every other day for 10 sessions.',
      shortDescription: '2-min plank ×10 sessions',
      category:         'strength',
      difficulty:       'easy',
      image:            'https://…/plank.jpg',
      participants:     [],
      requirements:     ['Hold plank ≥120s', 'Rest days allowed'],
      isFeatured:       false,
      startDate:        new Date(),
      endDate:          new Date(Date.now() + 20*24*60*60*1000),
    },
  ];
  
  const created = await Challenge.insertMany(samples);
  console.log(`✨ Inserted ${created.length} documents:`, created.map(d => d._id));

  // List collections again:
  const after = await conn.connection.db.listCollections().toArray();
  console.log('Collections after seeding:', after.map(c => c.name));

  await mongoose.disconnect();
}

if (require.main === module) {
  seed()
    .then(() => {
      console.log('Seeder finished.');
      process.exit(0);
    })
    .catch(err => {
      console.error('Seeder error:', err);
      process.exit(1);
    });
}

module.exports = seed;








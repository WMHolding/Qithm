require('dotenv').config();

const mongoose = require('mongoose');
const Championship = require('../models/Championship');

const championshipSeeds = [
  {
    id: 'spring-endurance-2024',
    name: 'Spring Endurance Challenge',
    description: 'Push your limits in this 30-day endurance championship. Complete running, cycling, and swimming challenges to earn points and compete for the top spot.',
    shortDescription: '30-day endurance championship with multiple cardio challenges',
    image: '/images/spring-endurance.webp',
    isFeatured: true,
    prizes: [
      { rank: 1, description: '$500 + Gold Medal' },
      { rank: 2, description: '$250 + Silver Medal' },
      { rank: 3, description: '$100 + Bronze Medal' }
    ],
    startDate: new Date('2024-03-01'),
    endDate: new Date('2024-03-31'),
    status: 'active',
    participants: []
  },
  {
    id: 'summer-strength-2024',
    name: 'Summer Strength Showdown',
    description: 'Test your strength in this comprehensive championship. Features weightlifting, bodyweight exercises, and power training challenges.',
    shortDescription: 'Ultimate strength and power championship',
    image: '/images/strength-showdown.jpeg',
    isFeatured: true,
    prizes: [
      { rank: 1, description: 'Pro Gym Equipment Set + Trophy' },
      { rank: 2, description: 'Premium Supplements Package' },
      { rank: 3, description: 'Training Accessories Bundle' }
    ],
    startDate: new Date('2024-06-01'),
    endDate: new Date('2024-06-30'),
    status: 'upcoming',
    participants: []
  },
  {
    id: 'fall-fitness-2024',
    name: 'Fall Fitness Championship',
    description: 'A balanced fitness championship combining strength, cardio, and flexibility challenges. Perfect for all-round fitness enthusiasts.',
    shortDescription: 'Complete fitness championship for all levels',
    image: '/images/summer-fitness.webp',
    isFeatured: false,
    prizes: [
      { rank: 1, description: 'Annual Gym Membership + Medal' },
      { rank: 2, description: '6-Month Gym Membership' },
      { rank: 3, description: '3-Month Gym Membership' }
    ],
    startDate: new Date('2024-09-01'),
    endDate: new Date('2024-09-30'),
    status: 'upcoming',
    participants: []
  },
  {
    id: 'winter-cardio-2023',
    name: 'Winter Cardio Clash',
    description: 'Beat the winter blues with this intensive cardio championship. Indoor and outdoor challenges to keep you moving through the cold months.',
    shortDescription: 'Winter cardio challenges for all weather conditions',
    image: '/images/cardio-clash.jpg',
    isFeatured: false,
    prizes: [
      { rank: 1, description: 'High-End Treadmill' },
      { rank: 2, description: 'Premium Fitness Watch' },
      { rank: 3, description: 'Professional Running Kit' }
    ],
    startDate: new Date('2023-12-01'),
    endDate: new Date('2023-12-31'),
    status: 'completed',
    participants: []
  }
];

async function seedChampionships() {
  try {
    // Clear existing championships
    await Championship.deleteMany({});
    console.log('Cleared existing championships');

    // Insert new championships
    const seededChampionships = await Championship.insertMany(championshipSeeds);
    console.log(`Seeded ${seededChampionships.length} championships`);

    return seededChampionships;
  } catch (error) {
    console.error('Error seeding championships:', error);
    throw error;
  }
}

// Export for use in main seed file or direct execution
module.exports = seedChampionships;

// If running this file directly
if (require.main === module) {
  // Load environment variables
  
  // Connect to MongoDB
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
      console.log('Connected to MongoDB');
      return seedChampionships();
    })
    .then(() => {
      console.log('Seeding completed');
      mongoose.connection.close();
    })
    .catch(error => {
      console.error('Seeding error:', error);
      mongoose.connection.close();
    });
}
const Championship = require('../models/Championship');

const sampleChampionship = {
  name: "Summer Fitness Championship 2024",
  description: "3-month fitness competition with weekly challenges",
  startDate: new Date(),
  endDate: new Date(Date.now() + 90*24*60*60*1000),
  participants: []
};

async function seedChampionship() {
  try {
    await Championship.deleteMany({});
    const championship = await Championship.create(sampleChampionship);
    console.log('Championship created:', championship);
  } catch (error) {
    console.error('Seeding error:', error);
  }
} 
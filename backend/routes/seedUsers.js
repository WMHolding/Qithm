require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcrypt');  // Add this to your dependencies if not already there

async function seed() {
  console.log('→ Using MONGODB_URI:', process.env.MONGODB_URI);

  const conn = await mongoose.connect(process.env.MONGODB_URI);
  console.log('✅ Connected to DB:', conn.connection.db.databaseName);

  // Clear existing users
  await User.deleteMany({});

  // Create hashed password for all users
  const hashedPassword = await bcrypt.hash('password123', 10);

  const users = [
    // Coaches
    {
      username: 'coach_sarah',
      email: 'sarah@fitcomp.com',
      password: hashedPassword,
      role: 'coach',
      profilePicture: 'https://example.com/sarah.jpg',
      birthday: new Date('1990-01-15'),
      weight: '58kg',
      height: '170cm',
      phone: '+1234567890',
      points: 1000
    },
    {
      username: 'coach_mike',
      email: 'mike@fitcomp.com',
      password: hashedPassword,
      role: 'coach',
      profilePicture: 'https://example.com/mike.jpg',
      birthday: new Date('1988-03-20'),
      weight: '75kg',
      height: '180cm',
      phone: '+1234567891',
      points: 1200
    },
    
    // Regular Members
    {
      username: 'john_fitness',
      email: 'john@example.com',
      password: hashedPassword,
      role: 'user',
      profilePicture: 'https://example.com/john.jpg',
      birthday: new Date('1995-05-10'),
      weight: '70kg',
      height: '175cm',
      phone: '+1234567892',
      points: 500
    },
    {
      username: 'emma_health',
      email: 'emma@example.com',
      password: hashedPassword,
      role: 'user',
      profilePicture: 'https://example.com/emma.jpg',
      birthday: new Date('1993-07-22'),
      weight: '62kg',
      height: '165cm',
      phone: '+1234567893',
      points: 750
    },
    {
      username: 'alex_workout',
      email: 'alex@example.com',
      password: hashedPassword,
      role: 'user',
      profilePicture: 'https://example.com/alex.jpg',
      birthday: new Date('1992-11-30'),
      weight: '80kg',
      height: '182cm',
      phone: '+1234567894',
      points: 300
    },
    
    // Admin
    {
      username: 'admin_jane',
      email: 'admin@fitcomp.com',
      password: hashedPassword,
      role: 'admin',
      profilePicture: 'https://example.com/jane.jpg',
      birthday: new Date('1985-12-25'),
      weight: '65kg',
      height: '168cm',
      phone: '+1234567895',
      points: 1500
    }
  ];

  const created = await User.insertMany(users);
  console.log('✨ Created users:', created.map(user => ({
    _id: user._id,
    username: user.username,
    role: user.role
  })));

  await mongoose.disconnect();
}

if (require.main === module) {
  seed()
    .then(() => {
      console.log('User seeder finished.');
      process.exit(0);
    })
    .catch(err => {
      console.error('User seeder error:', err);
      process.exit(1);
    });
}

module.exports = seed; 
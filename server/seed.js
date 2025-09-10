const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Event = require('./models/Event');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/curated-events');
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

const sampleUsers = [
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    location: { city: 'San Francisco', state: 'CA' },
    interests: ['technology', 'networking'],
    isAdmin: true
  },
  {
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'password123',
    location: { city: 'San Francisco', state: 'CA' },
    interests: ['art', 'music'],
    points: 150,
    badges: [
      { type: 'first_event', description: 'Attended your first event!' },
      { type: 'social_butterfly', description: 'Attended 10+ events' }
    ],
    streaks: { current: 3, longest: 7 }
  },
  {
    name: 'Mike Johnson',
    email: 'mike@example.com',
    password: 'password123',
    location: { city: 'San Francisco', state: 'CA' },
    interests: ['sports', 'fitness'],
    points: 75,
    badges: [
      { type: 'first_event', description: 'Attended your first event!' }
    ],
    streaks: { current: 1, longest: 2 }
  }
];

const sampleEvents = [
  {
    title: 'Tech Meetup: AI & Machine Learning',
    description: 'Join us for an exciting discussion about the latest trends in AI and machine learning. We\'ll have industry experts sharing their insights and networking opportunities.',
    location: {
      name: 'Tech Hub SF',
      address: '123 Market St',
      city: 'San Francisco',
      state: 'CA'
    },
    dateTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    endDateTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000), // 2 hours later
    category: 'technology',
    maxAttendees: 50,
    price: 0,
    tags: ['AI', 'Machine Learning', 'Networking'],
    status: 'approved'
  },
  {
    title: 'Art Gallery Opening: Modern Expressions',
    description: 'Experience contemporary art from local artists. Wine and light refreshments will be served. Meet the artists and explore their creative process.',
    location: {
      name: 'Modern Art Gallery',
      address: '456 Mission St',
      city: 'San Francisco',
      state: 'CA'
    },
    dateTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
    endDateTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000), // 3 hours later
    category: 'art',
    maxAttendees: 30,
    price: 15,
    tags: ['Art', 'Gallery', 'Wine'],
    status: 'approved'
  },
  {
    title: 'Morning Yoga in the Park',
    description: 'Start your day with a peaceful yoga session in Golden Gate Park. All levels welcome. Bring your own mat and water bottle.',
    location: {
      name: 'Golden Gate Park',
      address: 'Golden Gate Park',
      city: 'San Francisco',
      state: 'CA'
    },
    dateTime: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day from now
    endDateTime: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000), // 1 hour later
    category: 'fitness',
    maxAttendees: 25,
    price: 0,
    tags: ['Yoga', 'Morning', 'Outdoor'],
    status: 'approved'
  },
  {
    title: 'Startup Networking Event',
    description: 'Connect with fellow entrepreneurs, investors, and startup enthusiasts. Pitch your ideas and find potential collaborators.',
    location: {
      name: 'Startup Space',
      address: '789 Sutter St',
      city: 'San Francisco',
      state: 'CA'
    },
    dateTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
    endDateTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000), // 2 hours later
    category: 'networking',
    maxAttendees: 40,
    price: 10,
    tags: ['Startup', 'Networking', 'Pitch'],
    status: 'pending'
  },
  {
    title: 'Live Music: Jazz Night',
    description: 'Enjoy an evening of live jazz music featuring local musicians. Food and drinks available for purchase.',
    location: {
      name: 'Blue Note SF',
      address: '321 Fillmore St',
      city: 'San Francisco',
      state: 'CA'
    },
    dateTime: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
    endDateTime: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000), // 3 hours later
    category: 'music',
    maxAttendees: 60,
    price: 25,
    tags: ['Jazz', 'Live Music', 'Food'],
    status: 'approved'
  }
];

const seedDatabase = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Event.deleteMany({});
    console.log('Cleared existing data');

    // Create users
    const createdUsers = [];
    for (const userData of sampleUsers) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const user = new User({
        ...userData,
        password: hashedPassword
      });
      await user.save();
      createdUsers.push(user);
      console.log(`Created user: ${user.name}`);
    }

    // Create events
    for (let i = 0; i < sampleEvents.length; i++) {
      const eventData = sampleEvents[i];
      const host = createdUsers[i % createdUsers.length]; // Assign hosts cyclically
      
      const event = new Event({
        ...eventData,
        host: host._id
      });
      
      await event.save();
      
      // Add event to host's hosted events
      host.hostedEvents.push(event._id);
      await host.save();
      
      console.log(`Created event: ${event.title}`);
    }

    // Add some RSVPs
    const events = await Event.find({ status: 'approved' });
    const attendees = createdUsers.filter(user => !user.isAdmin);
    
    for (const event of events) {
      // Add random RSVPs
      const numRSVPs = Math.floor(Math.random() * 5) + 1;
      for (let i = 0; i < numRSVPs && i < attendees.length; i++) {
        await event.addRSVP(attendees[i]._id, 'attending');
        
        // Add to user's attended events
        if (!attendees[i].attendedEvents.includes(event._id)) {
          attendees[i].attendedEvents.push(event._id);
          await attendees[i].save();
        }
      }
    }

    console.log('Database seeded successfully!');
    console.log('\nSample accounts created:');
    console.log('Admin: john@example.com / password123');
    console.log('User: jane@example.com / password123');
    console.log('User: mike@example.com / password123');
    
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    mongoose.connection.close();
  }
};

const runSeed = async () => {
  await connectDB();
  await seedDatabase();
};

if (require.main === module) {
  runSeed();
}

module.exports = { runSeed };

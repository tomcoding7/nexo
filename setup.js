#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Setting up Curated Events...\n');

// Check if Node.js version is compatible
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);

if (majorVersion < 16) {
  console.error('❌ Node.js version 16 or higher is required. Current version:', nodeVersion);
  process.exit(1);
}

console.log('✅ Node.js version check passed:', nodeVersion);

// Create .env file if it doesn't exist
const envPath = path.join(__dirname, 'server', '.env');
const envExamplePath = path.join(__dirname, 'server', '.env.example');

if (!fs.existsSync(envPath)) {
  if (fs.existsSync(envExamplePath)) {
    fs.copyFileSync(envExamplePath, envPath);
    console.log('✅ Created .env file from .env.example');
  } else {
    // Create basic .env file
    const envContent = `PORT=5000
MONGODB_URI=mongodb://localhost:27017/curated-events
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
`;
    fs.writeFileSync(envPath, envContent);
    console.log('✅ Created basic .env file');
  }
} else {
  console.log('✅ .env file already exists');
}

// Install dependencies
console.log('\n📦 Installing dependencies...');

try {
  console.log('Installing root dependencies...');
  execSync('npm install', { stdio: 'inherit' });
  
  console.log('Installing server dependencies...');
  execSync('npm install', { stdio: 'inherit', cwd: path.join(__dirname, 'server') });
  
  console.log('Installing client dependencies...');
  execSync('npm install', { stdio: 'inherit', cwd: path.join(__dirname, 'client') });
  
  console.log('✅ All dependencies installed successfully');
} catch (error) {
  console.error('❌ Error installing dependencies:', error.message);
  process.exit(1);
}

// Check if MongoDB is running
console.log('\n🗄️  Checking MongoDB connection...');

try {
  const { MongoClient } = require('mongodb');
  const client = new MongoClient('mongodb://localhost:27017');
  
  client.connect().then(() => {
    console.log('✅ MongoDB is running and accessible');
    client.close();
    
    // Run database seed
    console.log('\n🌱 Seeding database with sample data...');
    try {
      execSync('npm run seed', { stdio: 'inherit', cwd: path.join(__dirname, 'server') });
      console.log('✅ Database seeded successfully');
    } catch (error) {
      console.log('⚠️  Database seeding failed, but you can run it manually later with: npm run seed');
    }
    
    console.log('\n🎉 Setup completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Start the development server: npm run dev');
    console.log('2. Open http://localhost:3000 in your browser');
    console.log('3. Login with: john@example.com / password123 (admin)');
    console.log('4. Or create a new account');
    console.log('\n🔧 Available commands:');
    console.log('- npm run dev: Start both frontend and backend');
    console.log('- npm run server: Start backend only');
    console.log('- npm run client: Start frontend only');
    console.log('- npm run seed: Seed database with sample data');
    
  }).catch((error) => {
    console.log('⚠️  MongoDB is not running or not accessible');
    console.log('Please start MongoDB and run: npm run seed');
    console.log('\n🎉 Setup completed! (MongoDB check skipped)');
    console.log('\n📋 Next steps:');
    console.log('1. Start MongoDB');
    console.log('2. Run: npm run seed (to add sample data)');
    console.log('3. Start the development server: npm run dev');
    console.log('4. Open http://localhost:3000 in your browser');
  });
  
} catch (error) {
  console.log('⚠️  Could not check MongoDB connection');
  console.log('Make sure MongoDB is installed and running');
  console.log('\n🎉 Setup completed! (MongoDB check skipped)');
}

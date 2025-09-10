# Nexo - Discover Amazing Events

A modern, Airbnb-inspired events platform that allows users to discover, attend, and host amazing local events and experiences. Connect with like-minded people and create unforgettable memories.

## 🚀 Features

### Core Functionality
- **Event Discovery**: Browse and filter events by category, location, date, and popularity
- **Event Management**: Create, edit, and manage events with detailed information
- **RSVP System**: Easy event attendance tracking with real-time updates
- **User Authentication**: Secure login/registration with JWT tokens

### Gamification System
- **Points & Badges**: Earn points and unlock badges for various achievements
- **Streaks**: Track consecutive event attendance for bonus rewards
- **Leaderboards**: Compete with other users across multiple categories
- **Achievement System**: Unlock badges for first events, hosting, streaks, and more

### Admin Features
- **Event Moderation**: Approve or reject events to maintain quality
- **User Management**: Admin dashboard for platform oversight
- **Analytics**: Track platform usage and engagement metrics

### Modern UI/UX
- **Responsive Design**: Mobile-first approach with desktop optimization
- **Modern Interface**: Clean, intuitive design with smooth animations
- **Real-time Updates**: Live RSVP counts and event status updates
- **Accessibility**: WCAG compliant with keyboard navigation support

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks and functional components
- **Styled Components** - CSS-in-JS for component styling
- **React Router** - Client-side routing
- **Framer Motion** - Smooth animations and transitions
- **Axios** - HTTP client for API communication
- **React Hook Form** - Form handling and validation
- **Date-fns** - Date manipulation and formatting

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database with Mongoose ODM
- **JWT** - JSON Web Tokens for authentication
- **Bcrypt** - Password hashing
- **Express Validator** - Input validation middleware

### Development Tools
- **Concurrently** - Run multiple npm scripts simultaneously
- **Nodemon** - Auto-restart server during development
- **ESLint** - Code linting and formatting

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** (v8 or higher)
- **MongoDB** (v5 or higher)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd curated-events
```

### 2. Install Dependencies

Install all dependencies for both frontend and backend:

```bash
npm run install-all
```

Or install manually:

```bash
# Install root dependencies
npm install

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 3. Environment Setup

Create a `.env` file in the `server` directory:

```bash
cd server
cp .env.example .env
```

Edit the `.env` file with your configuration:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/nexo-events
JWT_SECRET=your-super-secret-jwt-key-here
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
NODE_ENV=development
```

### 4. Start MongoDB

Make sure MongoDB is running on your system:

```bash
# On macOS with Homebrew
brew services start mongodb-community

# On Ubuntu/Debian
sudo systemctl start mongod

# On Windows
net start MongoDB
```

### 5. Run the Application

Start both frontend and backend simultaneously:

```bash
npm run dev
```

This will start:
- Backend server on `http://localhost:5000`
- Frontend development server on `http://localhost:3000`

Or run them separately:

```bash
# Terminal 1 - Backend
npm run server

# Terminal 2 - Frontend
npm run client
```

## 🗄️ Database Setup

The application uses MongoDB with the following collections:

### Users Collection
- User profiles with authentication data
- Gamification data (points, badges, streaks)
- Event participation history

### Events Collection
- Event details and metadata
- RSVP tracking
- Host information and ratings

### Automatic Setup
The database and collections are created automatically when you first run the application. No manual setup is required.

## 🎮 Gamification System

### Badges
Users can earn badges for various achievements:

- **First Event** - Attend your first event
- **Social Butterfly** - Attend 10+ events
- **Event Host** - Host your first event
- **Streak Master** - Maintain a 7-day event streak
- **Community Leader** - Host 5+ successful events
- **Early Bird** - Attend 5+ morning events
- **Night Owl** - Attend 5+ evening events
- **Explorer** - Attend events in 3+ different categories

### Points System
- **Event Attendance**: 10 points per event
- **Event Hosting**: 25 points per event
- **Badge Rewards**: 10-200 points depending on badge type
- **Streak Bonuses**: Additional points for maintaining streaks

### Leaderboards
- **Top Attendees** - Most events attended
- **Top Hosts** - Most successful event hosts
- **Streak Masters** - Longest attendance streaks
- **Badge Collectors** - Most badges earned

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile

### Events
- `GET /api/events` - Get events with filtering
- `GET /api/events/:id` - Get single event
- `POST /api/events` - Create new event
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event
- `POST /api/events/:id/rsvp` - RSVP to event
- `DELETE /api/events/:id/rsvp` - Remove RSVP

### Leaderboard
- `GET /api/leaderboard/attendees` - Top attendees
- `GET /api/leaderboard/hosts` - Top hosts
- `GET /api/leaderboard/streaks` - Streak leaders
- `GET /api/leaderboard/badges` - Badge collectors

### Admin
- `GET /api/events/admin/pending` - Pending events
- `PUT /api/events/:id/approve` - Approve event
- `PUT /api/events/:id/reject` - Reject event

## 🧪 Testing the Application

### 1. Create a Test User
1. Navigate to `http://localhost:3000/register`
2. Create a new account with test data
3. Verify email and profile setup

### 2. Create a Test Event
1. Login and navigate to "Create Event"
2. Fill out the event form with test data
3. Submit the event (it will be pending approval)

### 3. Test Admin Functions
1. Create an admin user by manually updating the database:
   ```javascript
   // In MongoDB shell or MongoDB Compass
   db.users.updateOne(
     { email: "admin@example.com" },
     { $set: { isAdmin: true } }
   )
   ```
2. Login as admin and navigate to `/admin`
3. Approve the test event

### 4. Test Gamification
1. RSVP to events to earn points and badges
2. Check the leaderboard to see rankings
3. View your profile to see earned badges and stats

## 🚀 Deployment

### Environment Variables for Production

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/curated-events
JWT_SECRET=your-production-jwt-secret
```

### Build for Production

```bash
# Build the frontend
cd client
npm run build

# The built files will be in client/build/
```

### Deploy to Heroku

1. Create a Heroku app
2. Set environment variables in Heroku dashboard
3. Deploy the backend:
   ```bash
   git subtree push --prefix server heroku main
   ```

### Deploy to Vercel (Frontend)

1. Install Vercel CLI
2. Deploy the frontend:
   ```bash
   cd client
   vercel --prod
   ```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Troubleshooting

### Common Issues

**MongoDB Connection Error**
- Ensure MongoDB is running
- Check the connection string in `.env`
- Verify MongoDB is accessible on the specified port

**Port Already in Use**
- Change the PORT in `.env` file
- Kill existing processes using the port
- Use `lsof -ti:5000 | xargs kill -9` (macOS/Linux)

**Build Errors**
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Check Node.js version compatibility
- Ensure all dependencies are properly installed

**Authentication Issues**
- Verify JWT_SECRET is set in `.env`
- Check token expiration settings
- Clear browser localStorage if needed

### Getting Help

If you encounter issues:

1. Check the console for error messages
2. Verify all environment variables are set
3. Ensure MongoDB is running and accessible
4. Check that all dependencies are installed correctly

## 🎯 Future Enhancements

- **Social Features**: Friend system, event sharing, comments
- **Advanced Filtering**: Map view, distance-based search
- **Mobile App**: React Native or Flutter mobile application
- **Payment Integration**: Stripe integration for paid events
- **Real-time Chat**: Event discussion and Q&A
- **Advanced Analytics**: Detailed event and user analytics
- **Email Notifications**: Event reminders and updates
- **Calendar Integration**: Google Calendar, Outlook sync

---

**Built with ❤️ by the Nexo team**
#   n e x o 
 
 
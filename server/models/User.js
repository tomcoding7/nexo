const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: function() {
      return !this.googleId;
    }
  },
  googleId: {
    type: String,
    sparse: true
  },
  avatar: {
    type: String,
    default: ''
  },
  location: {
    city: String,
    state: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  // Gamification fields
  points: {
    type: Number,
    default: 0
  },
  badges: [{
    type: {
      type: String,
      enum: ['first_event', 'social_butterfly', 'event_host', 'streak_master', 'community_leader', 'early_bird', 'night_owl', 'explorer']
    },
    earnedAt: {
      type: Date,
      default: Date.now
    },
    description: String
  }],
  streaks: {
    current: {
      type: Number,
      default: 0
    },
    longest: {
      type: Number,
      default: 0
    },
    lastEventDate: Date
  },
  // Event participation
  attendedEvents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event'
  }],
  hostedEvents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event'
  }],
  // User preferences
  interests: [{
    type: String,
    enum: ['technology', 'music', 'sports', 'food', 'art', 'education', 'networking', 'fitness', 'gaming', 'outdoor']
  }],
  // Account status
  isAdmin: {
    type: Boolean,
    default: false
  },
  isVerified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Add badge method
userSchema.methods.addBadge = function(badgeType, description) {
  const existingBadge = this.badges.find(badge => badge.type === badgeType);
  if (!existingBadge) {
    this.badges.push({
      type: badgeType,
      description: description || this.getBadgeDescription(badgeType)
    });
    this.points += this.getBadgePoints(badgeType);
  }
};

// Get badge description
userSchema.methods.getBadgeDescription = function(badgeType) {
  const descriptions = {
    first_event: 'Attended your first event!',
    social_butterfly: 'Attended 10+ events',
    event_host: 'Hosted your first event',
    streak_master: 'Maintained a 7-day event streak',
    community_leader: 'Hosted 5+ successful events',
    early_bird: 'Attended 5+ morning events',
    night_owl: 'Attended 5+ evening events',
    explorer: 'Attended events in 3+ different categories'
  };
  return descriptions[badgeType] || 'Earned a new badge!';
};

// Get badge points
userSchema.methods.getBadgePoints = function(badgeType) {
  const points = {
    first_event: 10,
    social_butterfly: 50,
    event_host: 25,
    streak_master: 100,
    community_leader: 200,
    early_bird: 30,
    night_owl: 30,
    explorer: 75
  };
  return points[badgeType] || 10;
};

// Update streak
userSchema.methods.updateStreak = function(eventDate) {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  if (!this.streaks.lastEventDate) {
    this.streaks.current = 1;
  } else {
    const lastEvent = new Date(this.streaks.lastEventDate);
    const daysDiff = Math.floor((eventDate - lastEvent) / (1000 * 60 * 60 * 24));
    
    if (daysDiff === 1) {
      this.streaks.current += 1;
    } else if (daysDiff > 1) {
      this.streaks.current = 1;
    }
  }
  
  this.streaks.lastEventDate = eventDate;
  this.streaks.longest = Math.max(this.streaks.longest, this.streaks.current);
  
  // Award streak badge
  if (this.streaks.current >= 7) {
    this.addBadge('streak_master');
  }
};

module.exports = mongoose.model('User', userSchema);

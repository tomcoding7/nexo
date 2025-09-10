const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  host: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  location: {
    name: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    },
    coordinates: {
      lat: Number,
      lng: Number
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    }
  },
  dateTime: {
    type: Date,
    required: true
  },
  endDateTime: {
    type: Date,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['technology', 'music', 'sports', 'food', 'art', 'education', 'networking', 'fitness', 'gaming', 'outdoor']
  },
  image: {
    type: String,
    default: ''
  },
  maxAttendees: {
    type: Number,
    default: null
  },
  price: {
    type: Number,
    default: 0
  },
  // RSVP tracking
  rsvps: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    status: {
      type: String,
      enum: ['attending', 'maybe', 'not_attending'],
      default: 'attending'
    },
    rsvpDate: {
      type: Date,
      default: Date.now
    }
  }],
  // Event status
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'cancelled', 'completed'],
    default: 'pending'
  },
  // Event metrics
  views: {
    type: Number,
    default: 0
  },
  rating: {
    average: {
      type: Number,
      default: 0
    },
    count: {
      type: Number,
      default: 0
    }
  },
  // Event settings
  isPublic: {
    type: Boolean,
    default: true
  },
  requiresApproval: {
    type: Boolean,
    default: true
  },
  // Tags for better discoverability
  tags: [String],
  // Event requirements
  requirements: {
    ageRestriction: {
      min: Number,
      max: Number
    },
    skills: [String],
    equipment: [String]
  }
}, {
  timestamps: true
});

// Virtual for RSVP count
eventSchema.virtual('rsvpCount').get(function() {
  return this.rsvps.filter(rsvp => rsvp.status === 'attending').length;
});

// Virtual for available spots
eventSchema.virtual('availableSpots').get(function() {
  if (!this.maxAttendees) return null;
  return Math.max(0, this.maxAttendees - this.rsvpCount);
});

// Virtual for event status
eventSchema.virtual('isUpcoming').get(function() {
  return new Date() < this.dateTime;
});

// Virtual for event is today
eventSchema.virtual('isToday').get(function() {
  const today = new Date();
  const eventDate = new Date(this.dateTime);
  return today.toDateString() === eventDate.toDateString();
});

// Index for better query performance
eventSchema.index({ dateTime: 1, status: 1 });
eventSchema.index({ location: 1 });
eventSchema.index({ category: 1 });
eventSchema.index({ host: 1 });

// Method to add RSVP
eventSchema.methods.addRSVP = function(userId, status = 'attending') {
  // Remove existing RSVP if any
  this.rsvps = this.rsvps.filter(rsvp => !rsvp.user.equals(userId));
  
  // Add new RSVP
  this.rsvps.push({
    user: userId,
    status: status
  });
  
  return this.save();
};

// Method to remove RSVP
eventSchema.methods.removeRSVP = function(userId) {
  this.rsvps = this.rsvps.filter(rsvp => !rsvp.user.equals(userId));
  return this.save();
};

// Method to check if user has RSVP'd
eventSchema.methods.hasRSVP = function(userId) {
  return this.rsvps.some(rsvp => rsvp.user.equals(userId));
};

// Method to get user's RSVP status
eventSchema.methods.getUserRSVPStatus = function(userId) {
  const rsvp = this.rsvps.find(rsvp => rsvp.user.equals(userId));
  return rsvp ? rsvp.status : null;
};

// Static method to get trending events
eventSchema.statics.getTrending = function(limit = 10) {
  return this.find({ 
    status: 'approved',
    dateTime: { $gte: new Date() }
  })
  .sort({ 
    'rating.average': -1, 
    rsvpCount: -1,
    views: -1 
  })
  .limit(limit)
  .populate('host', 'name avatar points badges')
  .exec();
};

// Static method to get events by location
eventSchema.statics.getByLocation = function(city, state, limit = 20) {
  return this.find({
    status: 'approved',
    'location.city': new RegExp(city, 'i'),
    'location.state': new RegExp(state, 'i'),
    dateTime: { $gte: new Date() }
  })
  .sort({ dateTime: 1 })
  .limit(limit)
  .populate('host', 'name avatar points badges')
  .exec();
};

module.exports = mongoose.model('Event', eventSchema);

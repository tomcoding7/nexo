const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Event = require('../models/Event');
const User = require('../models/User');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/events
// @desc    Get all events with filtering
// @access  Public
router.get('/', [
  query('category').optional().isIn(['technology', 'music', 'sports', 'food', 'art', 'education', 'networking', 'fitness', 'gaming', 'outdoor']),
  query('city').optional().trim(),
  query('state').optional().trim(),
  query('date').optional().isISO8601(),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('sort').optional().isIn(['date', 'popularity', 'rating'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { 
      category, 
      city, 
      state, 
      date, 
      limit = 20, 
      sort = 'date',
      trending = false 
    } = req.query;

    let query = { status: 'approved' };

    // Add filters
    if (category) query.category = category;
    if (city) query['location.city'] = new RegExp(city, 'i');
    if (state) query['location.state'] = new RegExp(state, 'i');
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 1);
      query.dateTime = { $gte: startDate, $lt: endDate };
    } else {
      query.dateTime = { $gte: new Date() };
    }

    // Build sort object
    let sortObj = {};
    switch (sort) {
      case 'popularity':
        sortObj = { 'rating.average': -1, rsvpCount: -1 };
        break;
      case 'rating':
        sortObj = { 'rating.average': -1, 'rating.count': -1 };
        break;
      default:
        sortObj = { dateTime: 1 };
    }

    // Get trending events
    if (trending === 'true') {
      const events = await Event.getTrending(parseInt(limit));
      return res.json(events);
    }

    const events = await Event.find(query)
      .sort(sortObj)
      .limit(parseInt(limit))
      .populate('host', 'name avatar points badges')
      .exec();

    res.json(events);
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/events/:id
// @desc    Get single event
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('host', 'name avatar points badges')
      .populate('rsvps.user', 'name avatar');

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Increment view count
    event.views += 1;
    await event.save();

    res.json(event);
  } catch (error) {
    console.error('Get event error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/events
// @desc    Create new event
// @access  Private
router.post('/', auth, [
  body('title').trim().isLength({ min: 3, max: 100 }).withMessage('Title must be 3-100 characters'),
  body('description').trim().isLength({ min: 10, max: 1000 }).withMessage('Description must be 10-1000 characters'),
  body('location.name').trim().notEmpty().withMessage('Location name is required'),
  body('location.address').trim().notEmpty().withMessage('Address is required'),
  body('location.city').trim().notEmpty().withMessage('City is required'),
  body('location.state').trim().notEmpty().withMessage('State is required'),
  body('dateTime').isISO8601().withMessage('Valid date/time is required'),
  body('endDateTime').isISO8601().withMessage('Valid end date/time is required'),
  body('category').isIn(['technology', 'music', 'sports', 'food', 'art', 'education', 'networking', 'fitness', 'gaming', 'outdoor']).withMessage('Valid category is required'),
  body('maxAttendees').optional().isInt({ min: 1 }),
  body('price').optional().isFloat({ min: 0 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const eventData = {
      ...req.body,
      host: req.user._id
    };

    // Validate date/time
    const dateTime = new Date(eventData.dateTime);
    const endDateTime = new Date(eventData.endDateTime);
    
    if (dateTime <= new Date()) {
      return res.status(400).json({ message: 'Event must be scheduled for the future' });
    }
    
    if (endDateTime <= dateTime) {
      return res.status(400).json({ message: 'End time must be after start time' });
    }

    const event = new Event(eventData);
    await event.save();

    // Add event to user's hosted events
    await User.findByIdAndUpdate(req.user._id, {
      $push: { hostedEvents: event._id }
    });

    // Award host badge
    const user = await User.findById(req.user._id);
    user.addBadge('event_host', 'Hosted your first event!');
    await user.save();

    await event.populate('host', 'name avatar points badges');

    res.status(201).json(event);
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/events/:id
// @desc    Update event
// @access  Private (Host or Admin)
router.put('/:id', auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if user is host or admin
    if (!event.host.equals(req.user._id) && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized to update this event' });
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('host', 'name avatar points badges');

    res.json(updatedEvent);
  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/events/:id
// @desc    Delete event
// @access  Private (Host or Admin)
router.delete('/:id', auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if user is host or admin
    if (!event.host.equals(req.user._id) && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized to delete this event' });
    }

    await Event.findByIdAndDelete(req.params.id);

    // Remove from user's hosted events
    await User.findByIdAndUpdate(event.host, {
      $pull: { hostedEvents: event._id }
    });

    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/events/:id/rsvp
// @desc    RSVP to event
// @access  Private
router.post('/:id/rsvp', auth, [
  body('status').isIn(['attending', 'maybe', 'not_attending']).withMessage('Valid RSVP status required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { status } = req.body;
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.status !== 'approved') {
      return res.status(400).json({ message: 'Cannot RSVP to unapproved event' });
    }

    // Check if event is full
    if (event.maxAttendees && event.rsvpCount >= event.maxAttendees && status === 'attending') {
      return res.status(400).json({ message: 'Event is full' });
    }

    await event.addRSVP(req.user._id, status);

    // If attending, add to user's attended events and update streaks
    if (status === 'attending') {
      const user = await User.findById(req.user._id);
      
      // Add to attended events if not already there
      if (!user.attendedEvents.includes(event._id)) {
        user.attendedEvents.push(event._id);
        
        // Update streak
        user.updateStreak(event.dateTime);
        
        // Award badges based on attendance
        if (user.attendedEvents.length === 1) {
          user.addBadge('first_event');
        } else if (user.attendedEvents.length >= 10) {
          user.addBadge('social_butterfly');
        }
        
        // Check for category explorer badge
        const categories = [...new Set(user.attendedEvents.map(e => e.category))];
        if (categories.length >= 3) {
          user.addBadge('explorer');
        }
        
        await user.save();
      }
    }

    const updatedEvent = await Event.findById(req.params.id)
      .populate('host', 'name avatar points badges')
      .populate('rsvps.user', 'name avatar');

    res.json(updatedEvent);
  } catch (error) {
    console.error('RSVP error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/events/:id/rsvp
// @desc    Remove RSVP
// @access  Private
router.delete('/:id/rsvp', auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    await event.removeRSVP(req.user._id);

    const updatedEvent = await Event.findById(req.params.id)
      .populate('host', 'name avatar points badges')
      .populate('rsvps.user', 'name avatar');

    res.json(updatedEvent);
  } catch (error) {
    console.error('Remove RSVP error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/events/admin/pending
// @desc    Get pending events for admin approval
// @access  Private (Admin)
router.get('/admin/pending', adminAuth, async (req, res) => {
  try {
    const events = await Event.find({ status: 'pending' })
      .sort({ createdAt: -1 })
      .populate('host', 'name email avatar')
      .exec();

    res.json(events);
  } catch (error) {
    console.error('Get pending events error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/events/:id/approve
// @desc    Approve event
// @access  Private (Admin)
router.put('/:id/approve', adminAuth, async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      { status: 'approved' },
      { new: true }
    ).populate('host', 'name avatar points badges');

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json(event);
  } catch (error) {
    console.error('Approve event error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/events/:id/reject
// @desc    Reject event
// @access  Private (Admin)
router.put('/:id/reject', adminAuth, async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      { status: 'rejected' },
      { new: true }
    ).populate('host', 'name avatar points badges');

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json(event);
  } catch (error) {
    console.error('Reject event error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

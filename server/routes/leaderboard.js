const express = require('express');
const User = require('../models/User');
const Event = require('../models/Event');
const { auth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/leaderboard/attendees
// @desc    Get top attendees leaderboard
// @access  Public
router.get('/attendees', async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const attendees = await User.aggregate([
      {
        $match: {
          attendedEvents: { $exists: true, $ne: [] }
        }
      },
      {
        $addFields: {
          attendedCount: { $size: '$attendedEvents' }
        }
      },
      {
        $sort: {
          points: -1,
          attendedCount: -1,
          'streaks.longest': -1
        }
      },
      {
        $limit: parseInt(limit)
      },
      {
        $project: {
          name: 1,
          avatar: 1,
          points: 1,
          badges: 1,
          streaks: 1,
          attendedCount: 1,
          location: 1
        }
      }
    ]);

    res.json(attendees);
  } catch (error) {
    console.error('Get attendees leaderboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/leaderboard/hosts
// @desc    Get top hosts leaderboard
// @access  Public
router.get('/hosts', async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const hosts = await User.aggregate([
      {
        $match: {
          hostedEvents: { $exists: true, $ne: [] }
        }
      },
      {
        $addFields: {
          hostedCount: { $size: '$hostedEvents' }
        }
      },
      {
        $lookup: {
          from: 'events',
          localField: 'hostedEvents',
          foreignField: '_id',
          as: 'hostedEventsData'
        }
      },
      {
        $addFields: {
          totalRSVPs: {
            $sum: {
              $map: {
                input: '$hostedEventsData',
                as: 'event',
                in: { $size: '$$event.rsvps' }
              }
            }
          },
          avgRating: {
            $avg: '$hostedEventsData.rating.average'
          }
        }
      },
      {
        $sort: {
          points: -1,
          totalRSVPs: -1,
          avgRating: -1
        }
      },
      {
        $limit: parseInt(limit)
      },
      {
        $project: {
          name: 1,
          avatar: 1,
          points: 1,
          badges: 1,
          hostedCount: 1,
          totalRSVPs: 1,
          avgRating: 1,
          location: 1
        }
      }
    ]);

    res.json(hosts);
  } catch (error) {
    console.error('Get hosts leaderboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/leaderboard/streaks
// @desc    Get top streak leaderboard
// @access  Public
router.get('/streaks', async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const streakLeaders = await User.find({
      'streaks.longest': { $gt: 0 }
    })
    .sort({
      'streaks.longest': -1,
      'streaks.current': -1,
      points: -1
    })
    .limit(parseInt(limit))
    .select('name avatar points badges streaks location')
    .exec();

    res.json(streakLeaders);
  } catch (error) {
    console.error('Get streaks leaderboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/leaderboard/badges
// @desc    Get users with most badges
// @access  Public
router.get('/badges', async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const badgeLeaders = await User.aggregate([
      {
        $addFields: {
          badgeCount: { $size: '$badges' }
        }
      },
      {
        $match: {
          badgeCount: { $gt: 0 }
        }
      },
      {
        $sort: {
          badgeCount: -1,
          points: -1
        }
      },
      {
        $limit: parseInt(limit)
      },
      {
        $project: {
          name: 1,
          avatar: 1,
          points: 1,
          badges: 1,
          badgeCount: 1,
          location: 1
        }
      }
    ]);

    res.json(badgeLeaders);
  } catch (error) {
    console.error('Get badges leaderboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/leaderboard/user/:id
// @desc    Get user's ranking
// @access  Public
router.get('/user/:id', async (req, res) => {
  try {
    const userId = req.params.id;

    // Get user's current stats
    const user = await User.findById(userId)
      .select('name avatar points badges streaks attendedEvents hostedEvents location');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Calculate rankings
    const [pointsRank, attendedRank, hostedRank, streakRank, badgeRank] = await Promise.all([
      User.countDocuments({ points: { $gt: user.points } }) + 1,
      User.countDocuments({ attendedEvents: { $size: { $gt: user.attendedEvents.length } } }) + 1,
      User.countDocuments({ hostedEvents: { $size: { $gt: user.hostedEvents.length } } }) + 1,
      User.countDocuments({ 'streaks.longest': { $gt: user.streaks.longest } }) + 1,
      User.countDocuments({ badges: { $size: { $gt: user.badges.length } } }) + 1
    ]);

    res.json({
      user: {
        id: user._id,
        name: user.name,
        avatar: user.avatar,
        points: user.points,
        badges: user.badges,
        streaks: user.streaks,
        attendedCount: user.attendedEvents.length,
        hostedCount: user.hostedEvents.length,
        location: user.location
      },
      rankings: {
        points: pointsRank,
        attended: attendedRank,
        hosted: hostedRank,
        streak: streakRank,
        badges: badgeRank
      }
    });
  } catch (error) {
    console.error('Get user ranking error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

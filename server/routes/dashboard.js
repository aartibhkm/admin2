import express from 'express';
import Booking from '../models/Booking.js';
import Contact from '../models/Contact.js';
import Admin from '../models/Admin.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

// @route   GET api/dashboard/stats
// @desc    Get dashboard statistics
// @access  Private
router.get('/stats', authMiddleware, async (req, res) => {
  try {
    // Get counts
    const totalBookings = await Booking.countDocuments();
    const totalContacts = await Contact.countDocuments();
    const totalAdmins = await Admin.countDocuments();
    
    // Get booking stats
    const pendingBookings = await Booking.countDocuments({ status: 'pending' });
    const confirmedBookings = await Booking.countDocuments({ status: 'confirmed' });
    const cancelledBookings = await Booking.countDocuments({ status: 'cancelled' });
    
    // Get contact stats
    const unresolvedContacts = await Contact.countDocuments({ isResolved: false });
    
    // Get recent data
    const recentBookings = await Booking.find()
      .sort({ createdAt: -1 })
      .limit(5);
      
    const recentContacts = await Contact.find()
      .sort({ createdAt: -1 })
      .limit(5);
    
    res.json({
      counts: {
        totalBookings,
        totalContacts,
        totalAdmins,
        pendingBookings,
        confirmedBookings,
        cancelledBookings,
        unresolvedContacts
      },
      recent: {
        bookings: recentBookings,
        contacts: recentContacts
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/dashboard/bookings/daily
// @desc    Get daily booking statistics for last 30 days
// @access  Private
router.get('/bookings/daily', authMiddleware, async (req, res) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const bookings = await Booking.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);
    
    res.json(bookings);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/dashboard/locations
// @desc    Get booking counts by location
// @access  Private
router.get('/locations', authMiddleware, async (req, res) => {
  try {
    const locationStats = await Booking.aggregate([
      {
        $group: {
          _id: '$location',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);
    
    res.json(locationStats);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

export default router;
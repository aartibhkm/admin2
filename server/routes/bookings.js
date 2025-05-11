import express from 'express';
import Booking from '../models/Booking.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

// @route   GET api/bookings
// @desc    Get all bookings with optional filters
// @access  Private
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { status, location, date, email } = req.query;
    let query = {};
    
    // Apply filters if provided
    if (status) query.status = status;
    if (location) query.location = location;
    if (date) query.date = new Date(date);
    if (email) query.email = email;
    
    const bookings = await Booking.find(query).sort({ date: -1 });
    res.json(bookings);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/bookings/:id
// @desc    Get booking by ID
// @access  Private
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    res.json(booking);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/bookings
// @desc    Create new booking
// @access  Private
router.post('/', authMiddleware, async (req, res) => {
  try {
    const newBooking = new Booking(req.body);
    const booking = await newBooking.save();
    res.json(booking);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/bookings/:id
// @desc    Update booking
// @access  Private
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    res.json(booking);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/bookings/:id/status
// @desc    Update booking status
// @access  Private
router.put('/:id/status', authMiddleware, async (req, res) => {
  const { status } = req.body;
  
  try {
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    booking.status = status;
    await booking.save();
    
    res.json(booking);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/bookings/stats/counts
// @desc    Get booking statistics
// @access  Private
router.get('/stats/counts', authMiddleware, async (req, res) => {
  try {
    const total = await Booking.countDocuments();
    const pending = await Booking.countDocuments({ status: 'pending' });
    const confirmed = await Booking.countDocuments({ status: 'confirmed' });
    const cancelled = await Booking.countDocuments({ status: 'cancelled' });
    const completed = await Booking.countDocuments({ status: 'completed' });
    
    res.json({
      total,
      pending,
      confirmed,
      cancelled,
      completed
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

export default router;
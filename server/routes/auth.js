import express from 'express';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';
import authMiddleware from '../middleware/auth.js';
import dotenv from 'dotenv';

dotenv.config();
const router = express.Router();

// @route   POST api/auth/login
// @desc    Login admin user
// @access  Public
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if admin exists
    const admin = await Admin.findOne({ username });
    
    if (!admin) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check if password matches
    const isMatch = await admin.comparePassword(password);
    
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Update last login
    admin.lastLogin = Date.now();
    await admin.save();

    // Return JWT token
    const payload = {
      admin: {
        id: admin.id,
        username: admin.username,
        role: admin.role
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1d' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/auth/admin
// @desc    Get current admin
// @access  Private
router.get('/admin', authMiddleware, async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.admin.id).select('-password');
    res.json(admin);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

export default router;
import express from 'express';
import Admin from '../models/Admin.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

// @route   GET api/admins
// @desc    Get all admins
// @access  Private
router.get('/', authMiddleware, async (req, res) => {
  try {
    const admins = await Admin.find().select('-password').sort({ username: 1 });
    res.json(admins);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/admins
// @desc    Create new admin
// @access  Private
router.post('/', authMiddleware, async (req, res) => {
  const { username, password, email, role } = req.body;

  try {
    // Check if admin with username or email exists
    let admin = await Admin.findOne({ $or: [{ username }, { email }] });
    
    if (admin) {
      return res.status(400).json({ message: 'Admin already exists' });
    }

    // Create new admin
    admin = new Admin({
      username,
      password,
      email,
      role: role || 'admin'
    });

    await admin.save();
    
    // Return admin without password
    const adminResponse = await Admin.findById(admin.id).select('-password');
    res.json(adminResponse);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/admins/:id
// @desc    Update admin
// @access  Private
router.put('/:id', authMiddleware, async (req, res) => {
  const { username, email, role, isActive } = req.body;

  try {
    let admin = await Admin.findById(req.params.id);
    
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    // Update fields
    if (username) admin.username = username;
    if (email) admin.email = email;
    if (role) admin.role = role;
    if (isActive !== undefined) admin.isActive = isActive;

    await admin.save();
    
    // Return admin without password
    const adminResponse = await Admin.findById(admin.id).select('-password');
    res.json(adminResponse);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/admins/:id/password
// @desc    Update admin password
// @access  Private
router.put('/:id/password', authMiddleware, async (req, res) => {
  const { password } = req.body;

  try {
    let admin = await Admin.findById(req.params.id);
    
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    // Update password
    admin.password = password;
    await admin.save();
    
    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   DELETE api/admins/:id
// @desc    Delete admin
// @access  Private
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);
    
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    await admin.deleteOne();
    
    res.json({ message: 'Admin removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

export default router;
import express from 'express';
import Contact from '../models/Contact.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

// @route   GET api/contacts
// @desc    Get all contacts with optional filters
// @access  Private
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { isResolved, assignedTo } = req.query;
    let query = {};
    
    // Apply filters if provided
    if (isResolved !== undefined) query.isResolved = isResolved === 'true';
    if (assignedTo) {
      if (assignedTo === 'unassigned') {
        query.assignedTo = null;
      } else {
        query.assignedTo = assignedTo;
      }
    }
    
    const contacts = await Contact.find(query)
      .sort({ createdAt: -1 })
      .populate('assignedTo', 'username');
      
    res.json(contacts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/contacts/:id
// @desc    Get contact by ID
// @access  Private
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id)
      .populate('assignedTo', 'username');
    
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    
    res.json(contact);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/contacts
// @desc    Create new contact message
// @access  Private
router.post('/', authMiddleware, async (req, res) => {
  try {
    const newContact = new Contact(req.body);
    const contact = await newContact.save();
    res.json(contact);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/contacts/:id
// @desc    Update contact
// @access  Private
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    ).populate('assignedTo', 'username');
    
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    
    res.json(contact);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/contacts/:id/resolve
// @desc    Mark contact as resolved
// @access  Private
router.put('/:id/resolve', authMiddleware, async (req, res) => {
  const { isResolved, response } = req.body;
  
  try {
    const contact = await Contact.findById(req.params.id);
    
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    
    contact.isResolved = isResolved !== undefined ? isResolved : true;
    if (response) contact.response = response;
    
    await contact.save();
    
    res.json(contact);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/contacts/:id/assign
// @desc    Assign contact to admin
// @access  Private
router.put('/:id/assign', authMiddleware, async (req, res) => {
  const { adminId } = req.body;
  
  try {
    const contact = await Contact.findById(req.params.id);
    
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    
    contact.assignedTo = adminId || null;
    await contact.save();
    
    const updatedContact = await Contact.findById(req.params.id)
      .populate('assignedTo', 'username');
    
    res.json(updatedContact);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/contacts/stats/counts
// @desc    Get contact message statistics
// @access  Private
router.get('/stats/counts', authMiddleware, async (req, res) => {
  try {
    const total = await Contact.countDocuments();
    const resolved = await Contact.countDocuments({ isResolved: true });
    const unresolved = await Contact.countDocuments({ isResolved: false });
    const unassigned = await Contact.countDocuments({ assignedTo: null });
    
    res.json({
      total,
      resolved,
      unresolved,
      unassigned
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

export default router;
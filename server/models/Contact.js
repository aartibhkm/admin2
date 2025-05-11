import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true
  },
  subject: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    required: true,
    trim: true
  },
  isResolved: {
    type: Boolean,
    default: false
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    default: null
  },
  response: {
    type: String,
    trim: true,
    default: null
  }
}, { timestamps: true });

// Indexes for faster queries
contactSchema.index({ isResolved: 1 });
contactSchema.index({ createdAt: 1 });

const Contact = mongoose.model('Contact', contactSchema);

export default Contact;
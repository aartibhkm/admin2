import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  location: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: Date,
    required: true
  },
  startTime: {
    type: String,
    required: true
  },
  endTime: {
    type: String,
    required: true
  },
  vehicleType: {
    type: String,
    required: true,
    enum: ['compact', 'sedan', 'suv', 'truck', 'motorcycle', 'other']
  },
  slots: {
    type: Number,
    required: true,
    default: 1,
    min: 1
  },
  customerName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded', 'failed'],
    default: 'pending'
  },
  notes: {
    type: String,
    trim: true
  }
}, { timestamps: true });

// Indexes for faster queries
bookingSchema.index({ date: 1, location: 1 });
bookingSchema.index({ email: 1 });
bookingSchema.index({ status: 1 });

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;
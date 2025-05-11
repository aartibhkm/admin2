import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Admin from '../models/Admin.js';
import Booking from '../models/Booking.js';
import Contact from '../models/Contact.js';

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB for seeding'))
  .catch(err => console.error('MongoDB connection error:', err));

// Seed admin users
const seedAdmins = async () => {
  try {
    // Clear existing data
    await Admin.deleteMany({});

    // Create default admin
    const defaultAdmin = new Admin({
      username: 'admin',
      password: 'admin123', // Will be hashed by the model
      email: 'admin@instapark.com',
      role: 'super-admin'
    });

    await defaultAdmin.save();
    console.log('Admin user created successfully');
  } catch (error) {
    console.error('Error seeding admin data:', error);
  }
};

// Seed bookings
const seedBookings = async () => {
  try {
    // Clear existing data
    await Booking.deleteMany({});

    // Create sample bookings
    const locations = ['Downtown Parking', 'Airport Parking', 'Mall Parking', 'Stadium Parking'];
    const statuses = ['pending', 'confirmed', 'cancelled', 'completed'];
    const vehicleTypes = ['compact', 'sedan', 'suv', 'truck', 'motorcycle'];

    const sampleBookings = [];

    // Create 20 sample bookings
    for (let i = 0; i < 20; i++) {
      const startHour = Math.floor(Math.random() * 12) + 8; // 8 AM to 8 PM
      const endHour = startHour + Math.floor(Math.random() * 5) + 1; // 1-5 hours later
      
      const booking = {
        location: locations[Math.floor(Math.random() * locations.length)],
        date: new Date(Date.now() + Math.floor(Math.random() * 30) * 86400000), // Random date within next 30 days
        startTime: `${startHour.toString().padStart(2, '0')}:00`,
        endTime: `${endHour.toString().padStart(2, '0')}:00`,
        vehicleType: vehicleTypes[Math.floor(Math.random() * vehicleTypes.length)],
        slots: Math.floor(Math.random() * 2) + 1,
        customerName: `Customer ${i + 1}`,
        email: `customer${i + 1}@example.com`,
        phone: `555-${Math.floor(1000 + Math.random() * 9000)}`,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        paymentStatus: Math.random() > 0.3 ? 'paid' : 'pending'
      };
      
      sampleBookings.push(booking);
    }

    await Booking.insertMany(sampleBookings);
    console.log('Sample bookings created successfully');
  } catch (error) {
    console.error('Error seeding booking data:', error);
  }
};

// Seed contacts
const seedContacts = async () => {
  try {
    // Clear existing data
    await Contact.deleteMany({});

    // Create sample contacts
    const subjects = [
      'Inquiry about parking availability',
      'Problem with booking',
      'Refund request',
      'Feedback on service',
      'Question about payment'
    ];

    const sampleContacts = [];

    // Create 10 sample contacts
    for (let i = 0; i < 10; i++) {
      const contact = {
        name: `Person ${i + 1}`,
        email: `person${i + 1}@example.com`,
        subject: subjects[Math.floor(Math.random() * subjects.length)],
        message: `This is a sample message ${i + 1}. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris.`,
        isResolved: Math.random() > 0.5
      };
      
      sampleContacts.push(contact);
    }

    await Contact.insertMany(sampleContacts);
    console.log('Sample contacts created successfully');
  } catch (error) {
    console.error('Error seeding contact data:', error);
  }
};

// Run all seed functions
const seedAll = async () => {
  await seedAdmins();
  await seedBookings();
  await seedContacts();
  
  // Close connection after seeding
  mongoose.connection.close();
  console.log('Database seeding completed. Connection closed.');
};

seedAll();
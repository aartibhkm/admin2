// API URLs
export const API_URL = 'http://localhost:3001/api';

// Navigation
export const NAVIGATION_ITEMS = [
  { name: 'Dashboard', path: '/dashboard', icon: 'LayoutDashboard' },
  { name: 'Bookings', path: '/bookings', icon: 'CalendarClock' },
  { name: 'Contact Messages', path: '/contacts', icon: 'MessageSquare' },
  { name: 'Admin Users', path: '/admins', icon: 'Users' },
  { name: 'Settings', path: '/settings', icon: 'Settings' }
];

// Table page sizes
export const PAGE_SIZES = [10, 25, 50, 100];

// Status options
export const BOOKING_STATUS_OPTIONS = [
  { label: 'All', value: '' },
  { label: 'Pending', value: 'pending' },
  { label: 'Confirmed', value: 'confirmed' },
  { label: 'Cancelled', value: 'cancelled' },
  { label: 'Completed', value: 'completed' }
];

// Vehicle types
export const VEHICLE_TYPES = [
  { label: 'Compact', value: 'compact' },
  { label: 'Sedan', value: 'sedan' },
  { label: 'SUV', value: 'suv' },
  { label: 'Truck', value: 'truck' },
  { label: 'Motorcycle', value: 'motorcycle' },
  { label: 'Other', value: 'other' }
];

// Payment status options
export const PAYMENT_STATUS_OPTIONS = [
  { label: 'Pending', value: 'pending' },
  { label: 'Paid', value: 'paid' },
  { label: 'Refunded', value: 'refunded' },
  { label: 'Failed', value: 'failed' }
];

// Admin roles
export const ADMIN_ROLES = [
  { label: 'Admin', value: 'admin' },
  { label: 'Super Admin', value: 'super-admin' }
];

// Format date with time
export const formatDateTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Format date only
export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Format time only
export const formatTime = (timeString: string) => {
  // Convert 24h format to 12h format
  const [hour, minute] = timeString.split(':');
  const hourNum = parseInt(hour, 10);
  const ampm = hourNum >= 12 ? 'PM' : 'AM';
  const hour12 = hourNum % 12 || 12;
  return `${hour12}:${minute} ${ampm}`;
};
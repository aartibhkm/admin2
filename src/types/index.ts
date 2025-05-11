export interface AdminUser {
  _id: string;
  username: string;
  email: string;
  role: 'admin' | 'super-admin';
  lastLogin: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Booking {
  _id: string;
  location: string;
  date: string;
  startTime: string;
  endTime: string;
  vehicleType: 'compact' | 'sedan' | 'suv' | 'truck' | 'motorcycle' | 'other';
  slots: number;
  customerName: string;
  email: string;
  phone: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  paymentStatus: 'pending' | 'paid' | 'refunded' | 'failed';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Contact {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  isResolved: boolean;
  assignedTo: {
    _id: string;
    username: string;
  } | null;
  response: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
}

export interface AuthContextType {
  user: AdminUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
}

export interface DashboardStats {
  counts: {
    totalBookings: number;
    totalContacts: number;
    totalAdmins: number;
    pendingBookings: number;
    confirmedBookings: number;
    cancelledBookings: number;
    unresolvedContacts: number;
  };
  recent: {
    bookings: Booking[];
    contacts: Contact[];
  };
}

export interface DailyBookingStats {
  _id: string; // Date in format YYYY-MM-DD
  count: number;
}

export interface LocationStats {
  _id: string; // Location name
  count: number;
}

export interface BookingFilter {
  status?: string;
  location?: string;
  date?: string;
  email?: string;
}

export interface ContactFilter {
  isResolved?: boolean;
  assignedTo?: string;
}
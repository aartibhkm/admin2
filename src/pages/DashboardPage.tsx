import React, { useEffect, useState } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { CalendarClock, MessageSquare, Users, TrendingUp, MapPin } from 'lucide-react';
import { format, parseISO, subDays } from 'date-fns';

import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import StatsCard from '../components/StatsCard';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell
} from '../components/ui/Table';
import BookingStatusBadge from '../components/BookingStatusBadge';
import Button from '../components/ui/Button';

import { dashboardApi } from '../utils/api';
import { DashboardStats, DailyBookingStats, LocationStats } from '../types';
import { formatDateTime } from '../config';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const DashboardPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [dailyBookings, setDailyBookings] = useState<DailyBookingStats[]>([]);
  const [locationStats, setLocationStats] = useState<LocationStats[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        const [statsData, dailyData, locationsData] = await Promise.all([
          dashboardApi.getStats(),
          dashboardApi.getBookingsByDay(),
          dashboardApi.getLocationStats()
        ]);
        
        setStats(statsData);
        setDailyBookings(dailyData);
        setLocationStats(locationsData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Process data for daily bookings chart (last 7 days)
  const processChartData = () => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = subDays(new Date(), i);
      return format(date, 'yyyy-MM-dd');
    }).reverse();

    const bookingCounts = last7Days.map(date => {
      const found = dailyBookings.find(booking => booking._id === date);
      return found ? found.count : 0;
    });

    return {
      labels: last7Days.map(date => format(parseISO(date), 'MMM dd')),
      datasets: [
        {
          label: 'Bookings',
          data: bookingCounts,
          fill: false,
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.2)',
          tension: 0.3
        }
      ]
    };
  };

  // Process data for locations chart
  const processLocationData = () => {
    // Sort and take top 5 locations
    const topLocations = [...locationStats]
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      labels: topLocations.map(loc => loc._id),
      datasets: [
        {
          label: 'Bookings',
          data: topLocations.map(loc => loc.count),
          backgroundColor: [
            'rgba(59, 130, 246, 0.7)',
            'rgba(20, 184, 166, 0.7)',
            'rgba(139, 92, 246, 0.7)',
            'rgba(245, 158, 11, 0.7)',
            'rgba(239, 68, 68, 0.7)'
          ],
          borderColor: [
            'rgb(59, 130, 246)',
            'rgb(20, 184, 166)',
            'rgb(139, 92, 246)',
            'rgb(245, 158, 11)',
            'rgb(239, 68, 68)'
          ],
          borderWidth: 1
        }
      ]
    };
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Bookings"
          value={stats?.counts.totalBookings || 0}
          icon={<CalendarClock size={24} />}
          description="All-time booking count"
          iconClassName="bg-blue-50 text-blue-600"
        />
        
        <StatsCard
          title="Pending Bookings"
          value={stats?.counts.pendingBookings || 0}
          icon={<TrendingUp size={24} />}
          iconClassName="bg-yellow-50 text-yellow-600"
        />
        
        <StatsCard
          title="Unresolved Contacts"
          value={stats?.counts.unresolvedContacts || 0}
          icon={<MessageSquare size={24} />}
          iconClassName="bg-teal-50 text-teal-600"
        />
        
        <StatsCard
          title="Admin Users"
          value={stats?.counts.totalAdmins || 0}
          icon={<Users size={24} />}
          iconClassName="bg-purple-50 text-purple-600"
        />
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Bookings (Last 7 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            {dailyBookings.length > 0 ? (
              <Line 
                data={processChartData()} 
                options={{
                  responsive: true,
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        precision: 0
                      }
                    }
                  }
                }} 
                height={300}
              />
            ) : (
              <div className="h-[300px] flex items-center justify-center text-gray-500">
                No booking data available
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Top Parking Locations</CardTitle>
          </CardHeader>
          <CardContent>
            {locationStats.length > 0 ? (
              <Bar 
                data={processLocationData()} 
                options={{
                  responsive: true,
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        precision: 0
                      }
                    }
                  }
                }}
                height={300}
              />
            ) : (
              <div className="h-[300px] flex items-center justify-center text-gray-500">
                No location data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Recent activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Bookings</CardTitle>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => window.location.href = '/bookings'}
            >
              View All
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Location</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stats?.recent.bookings.length ? (
                  stats.recent.bookings.map((booking) => (
                    <TableRow key={booking._id}>
                      <TableCell className="font-medium">{booking.location}</TableCell>
                      <TableCell>{booking.customerName}</TableCell>
                      <TableCell>{formatDateTime(booking.date)}</TableCell>
                      <TableCell>
                        <BookingStatusBadge status={booking.status} />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-gray-500 py-4">
                      No recent bookings
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Contact Messages</CardTitle>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => window.location.href = '/contacts'}
            >
              View All
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stats?.recent.contacts.length ? (
                  stats.recent.contacts.map((contact) => (
                    <TableRow key={contact._id}>
                      <TableCell className="font-medium">{contact.name}</TableCell>
                      <TableCell>{contact.subject}</TableCell>
                      <TableCell>{formatDateTime(contact.createdAt)}</TableCell>
                      <TableCell>
                        <Badge variant={contact.isResolved ? 'green' : 'yellow'}>
                          {contact.isResolved ? 'Resolved' : 'Unresolved'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                <TableCell colSpan={4} className="text-center text-gray-500 py-4">
                 No recent contact messages
                 </TableCell>
                </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Import Badge component to fix error
const Badge: React.FC<{ variant: string; children: React.ReactNode }> = ({ variant, children }) => {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
      variant === 'green' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
    }`}>
      {children}
    </span>
  );
};

export default DashboardPage;
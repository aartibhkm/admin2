import React, { useEffect, useState } from 'react';
import { Search, Filter, Plus, FileDown } from 'lucide-react';
import { useForm } from 'react-hook-form';

import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Pagination
} from '../components/ui/Table';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import BookingStatusBadge from '../components/BookingStatusBadge';
import PaymentStatusBadge from '../components/PaymentStatusBadge';
import Modal from '../components/ui/Modal';

import { bookingsApi } from '../utils/api';
import { Booking, BookingFilter } from '../types';
import { formatDate, formatTime, BOOKING_STATUS_OPTIONS, VEHICLE_TYPES, PAYMENT_STATUS_OPTIONS } from '../config';

const BookingsPage: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [showFilters, setShowFilters] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [searching, setSearching] = useState('');
  
  const { register, handleSubmit, reset, watch } = useForm<BookingFilter>();
  const { register: registerUpdate, handleSubmit: handleSubmitUpdate } = useForm();
  
  // Get current filters
  const statusFilter = watch('status');
  const locationFilter = watch('location');
  const dateFilter = watch('date');
  const emailFilter = watch('email');

  // Fetch bookings data
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setIsLoading(true);
        const data = await bookingsApi.getAll();
        setBookings(data);
        setFilteredBookings(data);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, []);

  // Apply filters
  const onFilterSubmit = (filters: BookingFilter) => {
    let filtered = [...bookings];
    
    if (filters.status) {
      filtered = filtered.filter(booking => booking.status === filters.status);
    }
    
    if (filters.location) {
      filtered = filtered.filter(booking => 
        booking.location.toLowerCase().includes(filters.location!.toLowerCase())
      );
    }
    
    if (filters.date) {
      filtered = filtered.filter(booking => 
        booking.date.substring(0, 10) === filters.date
      );
    }
    
    if (filters.email) {
      filtered = filtered.filter(booking => 
        booking.email.toLowerCase().includes(filters.email!.toLowerCase())
      );
    }
    
    setFilteredBookings(filtered);
    setCurrentPage(1);
    setShowFilters(false);
  };

  // Reset filters
  const resetFilters = () => {
    reset();
    setFilteredBookings(bookings);
    setCurrentPage(1);
    setShowFilters(false);
  };

  // Update booking status
  const updateBookingStatus = async (data: any) => {
    if (!selectedBooking) return;
    
    try {
      const updatedBooking = await bookingsApi.updateStatus(selectedBooking._id, data.status);
      
      setBookings(prevBookings => 
        prevBookings.map(booking => 
          booking._id === updatedBooking._id ? updatedBooking : booking
        )
      );
      
      setFilteredBookings(prevBookings => 
        prevBookings.map(booking => 
          booking._id === updatedBooking._id ? updatedBooking : booking
        )
      );
      
      setShowUpdateModal(false);
    } catch (error) {
      console.error('Error updating booking status:', error);
    }
  };

  // Handle search
  useEffect(() => {
    if (searching) {
      const searchLower = searching.toLowerCase();
      const searched = bookings.filter(booking => 
        booking.customerName.toLowerCase().includes(searchLower) ||
        booking.email.toLowerCase().includes(searchLower) ||
        booking.phone.includes(searching) ||
        booking.location.toLowerCase().includes(searchLower)
      );
      setFilteredBookings(searched);
      setCurrentPage(1);
    } else if (!statusFilter && !locationFilter && !dateFilter && !emailFilter) {
      setFilteredBookings(bookings);
    }
  }, [searching, bookings]);

  // Get current page data
  const indexOfLastBooking = currentPage * pageSize;
  const indexOfFirstBooking = indexOfLastBooking - pageSize;
  const currentBookings = filteredBookings.slice(indexOfFirstBooking, indexOfLastBooking);

  // Export to CSV
  const exportToCSV = () => {
    // Create CSV content
    const headers = [
      'Customer Name',
      'Email',
      'Phone',
      'Location',
      'Date',
      'Start Time',
      'End Time',
      'Vehicle Type',
      'Slots',
      'Status',
      'Payment Status'
    ].join(',');
    
    const rows = filteredBookings.map(booking => [
      `"${booking.customerName}"`,
      `"${booking.email}"`,
      `"${booking.phone}"`,
      `"${booking.location}"`,
      formatDate(booking.date),
      booking.startTime,
      booking.endTime,
      booking.vehicleType,
      booking.slots,
      booking.status,
      booking.paymentStatus
    ].join(','));
    
    const csvContent = [headers, ...rows].join('\n');
    
    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `bookings-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h2 className="text-2xl font-bold mb-4 md:mb-0">Booking Management</h2>
        
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative">
            <Input
              placeholder="Search bookings..."
              value={searching}
              onChange={(e) => setSearching(e.target.value)}
              className="pl-10 w-full"
            />
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
          
          <Button
            variant="outline"
            leftIcon={<Filter size={16} />}
            onClick={() => setShowFilters(!showFilters)}
          >
            Filter
          </Button>
          
          <Button
            variant="outline"
            leftIcon={<FileDown size={16} />}
            onClick={exportToCSV}
          >
            Export
          </Button>
          
          <Button
            leftIcon={<Plus size={16} />}
          >
            New Booking
          </Button>
        </div>
      </div>
      
      {/* Filters card */}
      {showFilters && (
        <Card className="mb-6 animate-slideDown">
          <CardHeader>
            <CardTitle>Filter Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onFilterSubmit)} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Select
                label="Status"
                options={BOOKING_STATUS_OPTIONS}
                placeholder="Select status"
                {...register('status')}
              />
              
              <Input
                label="Location"
                placeholder="Enter location"
                {...register('location')}
              />
              
              <Input
                label="Date"
                type="date"
                {...register('date')}
              />
              
              <Input
                label="Email"
                placeholder="Enter email"
                {...register('email')}
              />
              
              <div className="flex gap-2 md:col-span-2 lg:col-span-4 justify-end">
                <Button type="button" variant="outline" onClick={resetFilters}>
                  Reset
                </Button>
                <Button type="submit">
                  Apply Filters
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
      
      {/* Bookings table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Vehicle Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentBookings.length > 0 ? (
                    currentBookings.map((booking) => (
                      <TableRow key={booking._id}>
                        <TableCell className="font-medium">
                          <div>{booking.customerName}</div>
                          <div className="text-xs text-gray-500">{booking.email}</div>
                        </TableCell>
                        <TableCell>{booking.location}</TableCell>
                        <TableCell>{formatDate(booking.date)}</TableCell>
                        <TableCell>
                          {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                        </TableCell>
                        <TableCell>
                          {booking.vehicleType.charAt(0).toUpperCase() + booking.vehicleType.slice(1)}
                        </TableCell>
                        <TableCell>
                          <BookingStatusBadge status={booking.status} />
                        </TableCell>
                        <TableCell>
                          <PaymentStatusBadge status={booking.paymentStatus} />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedBooking(booking);
                                setShowUpdateModal(true);
                              }}
                            >
                              Update
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-6 text-gray-500">
                        No bookings found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              
              <div className="p-4 border-t border-gray-100">
                <Pagination
                  totalCount={filteredBookings.length}
                  pageSize={pageSize}
                  currentPage={currentPage}
                  onPageChange={setCurrentPage}
                  onPageSizeChange={setPageSize}
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>
      
      {/* Update status modal */}
      {selectedBooking && (
        <Modal
          isOpen={showUpdateModal}
          onClose={() => setShowUpdateModal(false)}
          title="Update Booking Status"
          footer={
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowUpdateModal(false)}>
                Cancel
              </Button>
              <Button type="submit" form="update-form">
                Update Status
              </Button>
            </div>
          }
        >
          <form id="update-form" onSubmit={handleSubmitUpdate(updateBookingStatus)}>
            <div className="space-y-4">
              <div>
                <p><span className="font-medium">Customer:</span> {selectedBooking.customerName}</p>
                <p><span className="font-medium">Email:</span> {selectedBooking.email}</p>
                <p><span className="font-medium">Location:</span> {selectedBooking.location}</p>
                <p>
                  <span className="font-medium">Date & Time:</span> 
                  {formatDate(selectedBooking.date)}, {formatTime(selectedBooking.startTime)} - {formatTime(selectedBooking.endTime)}
                </p>
              </div>
              
              <Select
                label="Status"
                options={BOOKING_STATUS_OPTIONS.filter(option => option.value !== '')}
                placeholder="Select status"
                defaultValue={selectedBooking.status}
                {...registerUpdate('status', { required: true })}
              />
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default BookingsPage;
import React from 'react';
import Badge from './ui/Badge';

interface BookingStatusBadgeProps {
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  className?: string;
}

const BookingStatusBadge: React.FC<BookingStatusBadgeProps> = ({ status, className }) => {
  const variants: Record<string, string> = {
    pending: 'yellow',
    confirmed: 'blue',
    cancelled: 'red',
    completed: 'green'
  };

  return (
    <Badge variant={variants[status]} className={className}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
};

export default BookingStatusBadge;
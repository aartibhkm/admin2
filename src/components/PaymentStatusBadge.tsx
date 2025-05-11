import React from 'react';
import Badge from './ui/Badge';

interface PaymentStatusBadgeProps {
  status: 'pending' | 'paid' | 'refunded' | 'failed';
  className?: string;
}

const PaymentStatusBadge: React.FC<PaymentStatusBadgeProps> = ({ status, className }) => {
  const variants: Record<string, string> = {
    pending: 'yellow',
    paid: 'green',
    refunded: 'blue',
    failed: 'red'
  };

  return (
    <Badge variant={variants[status]} className={className}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
};

export default PaymentStatusBadge;
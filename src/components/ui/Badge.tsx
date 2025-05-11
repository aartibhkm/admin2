import React from 'react';
import { twMerge } from 'tailwind-merge';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'blue' | 'green' | 'red' | 'yellow' | 'gray';
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  className,
}) => {
  const variantClasses = {
    default: 'bg-blue-100 text-blue-800',
    blue: 'badge-blue',
    green: 'badge-green',
    red: 'badge-red',
    yellow: 'badge-yellow',
    gray: 'badge-gray',
  };

  return (
    <span
      className={twMerge(
        'badge',
        variantClasses[variant],
        className
      )}
    >
      {children}
    </span>
  );
};

export default Badge;
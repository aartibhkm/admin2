import React from 'react';
import { twMerge } from 'tailwind-merge';
import { AlertCircle, CheckCircle, Info, XCircle } from 'lucide-react';

interface AlertProps {
  title?: string;
  children: React.ReactNode;
  variant?: 'info' | 'success' | 'warning' | 'error';
  className?: string;
}

const Alert: React.FC<AlertProps> = ({
  title,
  children,
  variant = 'info',
  className,
}) => {
  const variantClasses = {
    info: 'bg-blue-50 text-blue-800 border-blue-200',
    success: 'bg-green-50 text-green-800 border-green-200',
    warning: 'bg-yellow-50 text-yellow-800 border-yellow-200',
    error: 'bg-red-50 text-red-800 border-red-200',
  };

  const icons = {
    info: <Info size={18} className="text-blue-500" />,
    success: <CheckCircle size={18} className="text-green-500" />,
    warning: <AlertCircle size={18} className="text-yellow-500" />,
    error: <XCircle size={18} className="text-red-500" />,
  };

  return (
    <div
      className={twMerge(
        'p-4 rounded-md border',
        variantClasses[variant],
        className
      )}
    >
      <div className="flex">
        <div className="flex-shrink-0 mr-3">{icons[variant]}</div>
        <div>
          {title && <h4 className="text-sm font-medium mb-1">{title}</h4>}
          <div className="text-sm">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Alert;
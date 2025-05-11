import React from 'react';
import { Card, CardContent } from './ui/Card';
import { twMerge } from 'tailwind-merge';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
  iconClassName?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  description,
  trend,
  className,
  iconClassName,
}) => {
  return (
    <Card className={twMerge('h-full', className)}>
      <CardContent className="p-0">
        <div className="flex items-start p-4">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <div className="mt-1 flex items-baseline">
              <p className="text-2xl font-semibold">{value}</p>
              
              {trend && (
                <span 
                  className={twMerge(
                    "ml-2 text-xs font-medium",
                    trend.isPositive ? "text-green-600" : "text-red-600"
                  )}
                >
                  {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
                </span>
              )}
            </div>
            {description && (
              <p className="mt-1 text-xs text-gray-500">{description}</p>
            )}
          </div>
          
          <div className={twMerge(
            "p-2 rounded-md",
            iconClassName || "bg-blue-50 text-blue-700"
          )}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
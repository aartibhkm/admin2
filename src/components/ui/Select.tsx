import React, { forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';

interface SelectOption {
  label: string;
  value: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: SelectOption[];
  label?: string;
  error?: string;
  fullWidth?: boolean;
  placeholder?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, options, label, error, fullWidth = false, placeholder, ...props }, ref) => {
    return (
      <div className={`form-group ${fullWidth ? 'w-full' : ''}`}>
        {label && (
          <label htmlFor={props.id} className="label">
            {label}
          </label>
        )}
        <select
          className={twMerge(
            'select',
            error ? 'border-red-500 focus-visible:ring-red-500' : '',
            className
          )}
          ref={ref}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;
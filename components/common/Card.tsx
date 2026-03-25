import { HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padding?: 'sm' | 'md' | 'lg' | 'none';
}

const PADDING_CLASS = {
  none: '',
  sm: 'p-4',
  md: 'p-5',
  lg: 'p-6',
};

export default function Card({ padding = 'md', className = '', children, ...props }: CardProps) {
  return (
    <div
      className={`rounded-xl border border-gray-200 bg-white shadow-sm ${PADDING_CLASS[padding]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

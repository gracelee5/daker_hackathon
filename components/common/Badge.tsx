import { HackathonStatus } from '@/types';

interface BadgeProps {
  children?: React.ReactNode;
  variant?: 'default' | 'status' | 'tag';
  status?: HackathonStatus;
  className?: string;
}

const STATUS_MAP: Record<HackathonStatus, { label: string; className: string }> = {
  ongoing: { label: '진행중', className: 'bg-emerald-100 text-emerald-700' },
  upcoming: { label: '예정', className: 'bg-blue-100 text-blue-700' },
  ended: { label: '종료', className: 'bg-gray-100 text-gray-500' },
};

export default function Badge({ children, variant = 'default', status, className = '' }: BadgeProps) {
  if (variant === 'status' && status) {
    const { label, className: statusClass } = STATUS_MAP[status];
    return (
      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusClass} ${className}`}>
        {label}
      </span>
    );
  }

  if (variant === 'tag') {
    return (
      <span className={`inline-flex items-center rounded-full bg-violet-100 px-2.5 py-0.5 text-xs font-medium text-violet-700 ${className}`}>
        {children}
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700 ${className}`}>
      {children}
    </span>
  );
}

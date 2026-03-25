import { Loader2, AlertCircle, InboxIcon } from 'lucide-react';

export function LoadingSpinner({ message = '불러오는 중...' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-gray-500">
      <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
      <p className="text-sm">{message}</p>
    </div>
  );
}

export function EmptyState({
  title = '데이터가 없습니다',
  description,
  action,
}: {
  title?: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-gray-500">
      <InboxIcon className="h-10 w-10 text-gray-300" />
      <p className="font-medium text-gray-700">{title}</p>
      {description && <p className="text-sm text-center max-w-xs">{description}</p>}
      {action}
    </div>
  );
}

export function ErrorState({
  message = '데이터를 불러오는 중 오류가 발생했습니다.',
  onRetry,
}: {
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-gray-500">
      <AlertCircle className="h-10 w-10 text-red-400" />
      <p className="font-medium text-gray-700">오류가 발생했습니다</p>
      <p className="text-sm text-center max-w-xs">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors"
        >
          다시 시도
        </button>
      )}
    </div>
  );
}

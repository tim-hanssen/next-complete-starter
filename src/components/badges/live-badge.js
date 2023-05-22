import LiveIcon from '@/components/icons/live-icon';

export default function LiveBadge({ size = 'sm' }) {
  const textSize = size === 'lg' ? 'text-sm' : 'text-xs';
  const bgColor = size === 'lg' ? 'bg-red-400' : 'bg-red-50';
  const textColor = size === 'lg' ? 'text-white' : 'text-red-600';
  const pulseClass = size === 'lg' ? 'w-4 h-4' : 'w-3 h-3';

  return (
    <span
      className={`${textSize} ${bgColor} ${textColor} font-medium inline-flex items-center px-2.5 py-0.5 rounded dark:bg-red-200 dark:red-violet-800`}
    >
      <LiveIcon className={pulseClass} />
      Live
    </span>
  );
}

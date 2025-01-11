interface BudgetProgressBarProps {
  progress: number;
}

export default function BudgetProgressBar({ progress }: BudgetProgressBarProps) {
  // Convert progress to number if it's a string
  const progressValue = Number(progress);
  
  // Determine color based on progress
  const getProgressColor = () => {
    if (progressValue > 100) return 'bg-red-500';
    if (progressValue > 80) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  // Calculate width (cap visual width at 100% but keep actual percentage)
  const visualWidth = Math.min(progressValue, 100);

  return (
    <div className="relative w-full h-2 bg-gray-200 rounded">
      <div
        className={`absolute h-full rounded transition-all duration-300 ${getProgressColor()}`}
        style={{ width: `${visualWidth}%` }}
      />
      <div className="absolute right-0 -top-6 text-sm">
        <span className={progressValue > 100 ? 'text-red-500' : 'text-gray-600'}>
          {progressValue.toFixed(1)}%
        </span>
      </div>
    </div>
  );
} 
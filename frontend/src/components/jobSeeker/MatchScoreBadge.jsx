const MatchScoreBadge = ({ 
  score = 0, 
  size = 'md', 
  variant = 'badge', 
  showLabel = false, 
  className = '' 
}) => {
  // Determine color and label based on score
  let config = {
    color: 'text-error bg-error-container/10 border-error/20',
    label: 'Low Match',
    icon: 'sentiment_very_dissatisfied'
  };

  if (score >= 85) {
    config = {
      color: 'text-green-600 bg-green-50 border-green-200',
      label: 'Strong Match',
      icon: 'verified'
    };
  } else if (score >= 70) {
    config = {
      color: 'text-secondary bg-secondary-container/10 border-secondary/20',
      label: 'Good Match',
      icon: 'thumb_up'
    };
  } else if (score >= 50) {
    config = {
      color: 'text-amber-600 bg-amber-50 border-amber-200',
      label: 'Fair Match',
      icon: 'trending_up'
    };
  }

  const sizeClasses = {
    sm: 'text-[10px] px-1.5 py-0.5 gap-1',
    md: 'text-label-sm px-2 py-1 gap-1.5',
    lg: 'text-label-md px-3 py-1.5 gap-2'
  };

  const ringSize = {
    sm: 'w-8 h-8 text-[10px]',
    md: 'w-10 h-10 text-label-sm',
    lg: 'w-12 h-12 text-label-md'
  };

  if (variant === 'ring') {
    const radius = size === 'sm' ? 12 : size === 'lg' ? 20 : 16;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;
    
    return (
      <div className={`relative flex items-center justify-center ${ringSize[size]} ${className}`} title="AI Match Score">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="50%" cy="50%" r={radius}
            className="stroke-surface-container-highest fill-none"
            strokeWidth={size === 'sm' ? '2' : '3'}
          />
          <circle
            cx="50%" cy="50%" r={radius}
            className={`fill-none transition-all duration-1000 ease-out ${config.color.split(' ')[0].replace('text-', 'stroke-')}`}
            strokeWidth={size === 'sm' ? '2' : '3'}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
          />
        </svg>
        <span className="absolute font-bold">{score}%</span>
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <div className={`flex items-center ${sizeClasses[size]} ${config.color.split(' ')[0]} ${className}`}>
        <span className="font-bold">{score}%</span>
        {showLabel && <span className="font-medium">{config.label}</span>}
      </div>
    );
  }

  return (
    <div 
      className={`inline-flex items-center font-bold rounded-full border ${config.color} ${sizeClasses[size]} ${className}`}
      title="AI match score is based on your skills and the job requirements."
    >
      <span className="material-symbols-outlined text-[1.2em]" style={{ fontVariationSettings: '"FILL" 1' }}>
        {config.icon}
      </span>
      <span>{score}%</span>
      {showLabel && <span className="font-medium opacity-90">{config.label}</span>}
    </div>
  );
};

export default MatchScoreBadge;

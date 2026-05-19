export default function ApplicantMatchScore({ score, size = 'md' }) {
  const numericScore = Number(score) || 0;
  const color = numericScore >= 85 ? 'text-[#15803D]' : numericScore >= 70 ? 'text-[#B45309]' : 'text-error';
  const dimensions = size === 'lg' ? 'w-28 h-28 text-[32px]' : 'w-14 h-14 text-ai-score';

  return (
    <div className={`${dimensions} rounded-full bg-surface-container-low border-4 border-secondary/20 flex items-center justify-center font-ai-score ${color}`}>
      {numericScore}%
    </div>
  );
}

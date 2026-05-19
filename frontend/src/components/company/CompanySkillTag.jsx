export default function CompanySkillTag({ children, tone = 'default' }) {
  const toneClass =
    tone === 'missing'
      ? 'bg-error-container text-error'
      : tone === 'matched'
        ? 'bg-[#22C55E]/10 text-[#15803D]'
        : 'bg-primary-fixed text-on-primary-fixed-variant';

  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 font-label-sm text-label-sm ${toneClass}`}>
      {children}
    </span>
  );
}

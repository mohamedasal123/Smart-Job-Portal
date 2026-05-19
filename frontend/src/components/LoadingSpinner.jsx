export default function LoadingSpinner({ size = 48, className = "" }) {
  return (
    <div className={`flex justify-center items-center ${className}`}>
      <span 
        className="material-symbols-outlined animate-spin text-secondary" 
        style={{ fontSize: `${size}px` }}
      >
        progress_activity
      </span>
    </div>
  );
}

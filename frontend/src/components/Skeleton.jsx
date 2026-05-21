/**
 * Skeleton primitive — a shimmering placeholder block.
 *
 * `className` controls size/shape (use Tailwind `h-`/`w-`/`rounded-` classes).
 * The shimmer keyframe is defined in tailwind.config.js.
 */
export default function Skeleton({ className = '' }) {
  return (
    <div
      role="presentation"
      aria-hidden="true"
      className={[
        'animate-shimmer rounded-md',
        'bg-[length:200%_100%]',
        'bg-gradient-to-r from-surface-container-low via-surface-container-high to-surface-container-low',
        className,
      ].join(' ')}
    />
  );
}

/**
 * SkeletonText — multi-line shimmer block, narrows the last line so it
 * reads like real running text. Useful for paragraph placeholders.
 */
export function SkeletonText({ lines = 3, className = '' }) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={`h-3 ${i === lines - 1 ? 'w-2/3' : 'w-full'}`}
        />
      ))}
    </div>
  );
}

/**
 * SkeletonCard — pre-composed card placeholder matching SeekerJobCard's shape
 * so list pages can swap it in 1:1 while data is loading.
 */
export function SkeletonCard({ className = '' }) {
  return (
    <div
      className={`bg-surface-container-lowest border border-outline-variant rounded-xl p-6 flex flex-col gap-4 ${className}`}
      aria-busy="true"
      aria-live="polite"
    >
      <div className="flex items-start gap-4">
        <Skeleton className="w-12 h-12 rounded-lg shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-6 w-24 rounded-full" />
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
      <SkeletonText lines={2} />
      <div className="flex items-center justify-between pt-4 border-t border-outline-variant">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-8 w-28 rounded-lg" />
      </div>
    </div>
  );
}

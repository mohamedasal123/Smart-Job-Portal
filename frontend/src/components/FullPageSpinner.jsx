export function FullPageSpinner() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <span className="material-symbols-outlined animate-spin text-4xl text-secondary">
        progress_activity
      </span>
    </div>
  );
}

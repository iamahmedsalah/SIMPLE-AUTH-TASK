export function PageLoader() {
  return (
    <div className="grid min-h-screen place-items-center" role="status">
      <div className="size-8 animate-spin rounded-full border-2 border-muted border-t-primary" />
      <span className="sr-only">Loading</span>
    </div>
  );
}

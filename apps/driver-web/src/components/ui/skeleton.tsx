import { cn } from "@/lib/utils";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-orange-100/50", className)}
      {...props}
    />
  );
}

// Enhanced skeleton variants for different content types
function SkeletonCard({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("rounded-xl border border-orange-100 bg-card shadow-sm p-6 space-y-4", className)}
      {...props}
    >
      <div className="skeleton-title" />
      <div className="skeleton-text" />
      <div className="skeleton-text w-2/3" />
    </div>
  );
}

function SkeletonButton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("h-10 rounded-lg bg-orange-100/50 animate-pulse", className)}
      {...props}
    />
  );
}

function SkeletonAvatar({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("h-10 w-10 rounded-full bg-orange-100/50 animate-pulse", className)}
      {...props}
    />
  );
}

function SkeletonText({
  className,
  lines = 3,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { lines?: number }) {
  return (
    <div className={cn("space-y-2", className)} {...props}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "h-4 bg-orange-100/50 rounded animate-pulse",
            i === lines - 1 ? "w-3/4" : "w-full"
          )}
        />
      ))}
    </div>
  );
}

export { Skeleton, SkeletonCard, SkeletonButton, SkeletonAvatar, SkeletonText };
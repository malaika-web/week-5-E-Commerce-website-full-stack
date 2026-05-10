const Skeleton = ({ className = '' }) => <div className={`animate-pulse rounded-2xl bg-slate-200/80 ${className}`} />;

export const ProductGridSkeleton = () => (
  <div className="grid-responsive">
    {Array.from({ length: 6 }).map((_, index) => (
      <div key={index} className="card-surface p-4">
        <Skeleton className="aspect-[4/3] w-full" />
        <Skeleton className="mt-5 h-5 w-2/3" />
        <Skeleton className="mt-3 h-4 w-full" />
        <Skeleton className="mt-6 h-10 w-full rounded-full" />
      </div>
    ))}
  </div>
);

export default Skeleton;

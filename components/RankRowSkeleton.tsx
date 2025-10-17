export default function RankRowSkeleton() {
  return (
    <li className="glass-row mb-3 px-3 py-3">
      <div className="grid items-center gap-3 md:grid-cols-[1.6fr_1fr_1fr_1fr_auto]">
        <div className="min-w-0">
          <div className="h-4 w-40 animate-pulse rounded bg-white/10" />
          <div className="mt-2 h-3 w-24 animate-pulse rounded bg-white/10" />
        </div>
        <SkeletonBar />
        <SkeletonBar />
        <SkeletonBar />
        <div className="flex justify-end gap-2">
          <div className="h-8 w-20 animate-pulse rounded bg-white/10" />
          <div className="h-8 w-24 animate-pulse rounded bg-white/10" />
        </div>
      </div>
    </li>
  );
}

function SkeletonBar() {
  return (
    <div>
      <div className="mb-1 h-3 w-20 animate-pulse rounded bg-white/10" />
      <div className="h-1.5 w-full rounded-full bg-white/10">
        <div className="h-1.5 w-2/5 animate-pulse rounded-full bg-white/20" />
      </div>
    </div>
  );
}

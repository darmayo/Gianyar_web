interface SkeletonProps {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={['animate-pulse rounded-md bg-gray-200', className].filter(Boolean).join(' ')}
    />
  )
}

/** Skeleton untuk card artikel/berita */
export function SkeletonCard() {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
      <Skeleton className="h-4 w-20 mb-3" />
      <Skeleton className="h-5 w-full mb-2" />
      <Skeleton className="h-4 w-3/4 mb-4" />
      <Skeleton className="h-3 w-1/2" />
    </div>
  )
}

/** Skeleton untuk tabel baris */
export function SkeletonRow() {
  return (
    <div className="flex items-center gap-4 py-3 border-b border-gray-100">
      <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-3.5 w-40" />
        <Skeleton className="h-3 w-24" />
      </div>
      <Skeleton className="h-6 w-16 rounded-full" />
    </div>
  )
}

/** Skeleton untuk hero/banner */
export function SkeletonBanner() {
  return (
    <div className="rounded-2xl bg-gray-200 animate-pulse h-48 w-full" aria-hidden />
  )
}

/** Skeleton untuk stats KPI */
export function SkeletonKPI({ count = 4 }: { count?: number }) {
  const gridClass: Record<number, string> = {
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-2 sm:grid-cols-4',
    5: 'grid-cols-2 sm:grid-cols-5',
    6: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-6',
  }
  return (
    <div className={`grid ${gridClass[count] ?? 'grid-cols-2 sm:grid-cols-4'} gap-3`}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white border border-gray-100 rounded-2xl p-4 text-center shadow-sm">
          <Skeleton className="h-7 w-16 mx-auto mb-2" />
          <Skeleton className="h-3 w-24 mx-auto mb-1" />
          <Skeleton className="h-2.5 w-16 mx-auto" />
        </div>
      ))}
    </div>
  )
}

// Professional skeleton loading components matching Noupe design

// Skeleton animation
const skeletonPulse = 'animate-pulse';

export function BotCardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-soft">
      <div className="flex items-start gap-3 mb-3">
        {/* Icon skeleton */}
        <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
        {/* Title skeleton */}
        <div className="flex-1 space-y-2">
          <div className="h-5 bg-gray-200 rounded w-2/3 animate-pulse"></div>
          <div className="h-4 bg-gray-100 rounded w-1/2 animate-pulse"></div>
        </div>
      </div>

      {/* Description skeleton */}
      <div className="space-y-2 mb-3">
        <div className="h-3 bg-gray-100 rounded w-full animate-pulse"></div>
        <div className="h-3 bg-gray-100 rounded w-4/5 animate-pulse"></div>
      </div>

      {/* Meta info skeleton */}
      <div className="flex items-center gap-2 mb-4">
        <div className="h-6 bg-gray-100 rounded-lg w-24 animate-pulse"></div>
        <div className="h-6 bg-gray-100 rounded-lg w-16 animate-pulse"></div>
      </div>

      {/* Buttons skeleton */}
      <div className="flex items-center gap-2 pt-4 border-t border-gray-200">
        <div className="h-9 bg-gray-100 rounded-lg flex-1 animate-pulse"></div>
        <div className="h-9 bg-gray-100 rounded-lg flex-1 animate-pulse"></div>
        <div className="h-9 bg-gray-100 rounded-lg flex-1 animate-pulse"></div>
      </div>
    </div>
  );
}

export function AnalyticsCardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-soft">
      <div className="flex items-center justify-between mb-4">
        <div className="h-5 bg-gray-200 rounded w-1/2 animate-pulse"></div>
        <div className="w-10 h-10 bg-gray-100 rounded-lg animate-pulse"></div>
      </div>
      <div className="h-10 bg-gray-200 rounded w-1/3 animate-pulse"></div>
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-soft p-6 border border-gray-200 animate-pulse">
      <div className="h-5 bg-gray-200 rounded w-1/3 mb-4"></div>
      <div className="h-10 bg-gray-200 rounded w-1/2 mb-6"></div>
      <div className="space-y-3">
        <div className="h-4 bg-gray-100 rounded"></div>
        <div className="h-4 bg-gray-100 rounded w-5/6"></div>
      </div>
    </div>
  );
}

export function FormSkeleton() {
  return (
    <div className="space-y-6 max-w-2xl">
      {[1, 2, 3].map((i) => (
        <div key={i} className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
          <div className="h-12 bg-gray-100 rounded-xl animate-pulse"></div>
        </div>
      ))}
      <div className="h-12 bg-gray-200 rounded-xl w-48 animate-pulse"></div>
    </div>
  );
}

export function TableRowSkeleton() {
  return (
    <div className="border-b border-gray-200 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
          <div className="space-y-2 flex-1">
            <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse"></div>
            <div className="h-3 bg-gray-100 rounded w-1/4 animate-pulse"></div>
          </div>
        </div>
        <div className="h-8 bg-gray-100 rounded w-20 animate-pulse"></div>
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-soft">
      <div className="h-6 bg-gray-200 rounded w-48 mb-6 animate-pulse"></div>
      <div className="space-y-0">
        {Array.from({ length: rows }).map((_, i) => (
          <TableRowSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: 'linear-gradient(288deg, #feefe5 29.08%, #fffcf9 93.86%)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Skeleton */}
        <div className="flex justify-between items-start mb-10 animate-fade-in">
          <div>
            <div className="h-10 bg-gray-200 rounded w-48 mb-2 animate-pulse"></div>
            <div className="h-5 bg-gray-100 rounded w-64 animate-pulse"></div>
          </div>
          <div className="h-11 bg-gray-200 rounded-xl w-40 animate-pulse"></div>
        </div>

        {/* Analytics Cards Skeleton */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {[1, 2, 3].map((i) => (
            <AnalyticsCardSkeleton key={i} />
          ))}
        </div>

        {/* Bots List Skeleton */}
        <div className="bg-white rounded-2xl border-2 border-gray-200 p-8 sm:p-10 shadow-lg">
          <div className="flex justify-between items-center mb-8">
            <div>
              <div className="h-7 bg-gray-200 rounded w-40 mb-2 animate-pulse"></div>
              <div className="h-4 bg-gray-100 rounded w-56 animate-pulse"></div>
            </div>
            <div className="h-8 bg-gray-100 rounded-lg w-20 animate-pulse"></div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {[1, 2].map((i) => (
              <BotCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function BuilderSkeleton() {
  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: 'linear-gradient(288deg, #feefe5 29.08%, #fffcf9 93.86%)' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 text-center animate-fade-in">
          <div className="h-12 bg-gray-200 rounded w-96 mx-auto mb-4 animate-pulse"></div>
          <div className="h-6 bg-gray-100 rounded w-64 mx-auto animate-pulse"></div>
        </div>

        {/* Progress Steps */}
        <div className="mb-10 bg-white/80 rounded-2xl p-6 shadow-soft">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex flex-col items-center flex-1">
                <div className="w-14 h-14 bg-gray-200 rounded-full mb-3 animate-pulse"></div>
                <div className="h-3 bg-gray-100 rounded w-20 animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-2xl shadow-soft p-8">
          <FormSkeleton />
        </div>
      </div>
    </div>
  );
}

export function NavbarSkeleton() {
  return (
    <nav className="bg-white shadow-md sticky top-0 z-50 border-b-2 border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gray-200 rounded-xl animate-pulse"></div>
            <div>
              <div className="h-5 bg-gray-200 rounded w-32 mb-1 animate-pulse"></div>
              <div className="h-3 bg-gray-100 rounded w-24 animate-pulse"></div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-10 bg-gray-200 rounded-lg w-24 animate-pulse"></div>
            <div className="h-10 bg-gray-200 rounded-lg w-32 animate-pulse"></div>
          </div>
        </div>
      </div>
    </nav>
  );
}

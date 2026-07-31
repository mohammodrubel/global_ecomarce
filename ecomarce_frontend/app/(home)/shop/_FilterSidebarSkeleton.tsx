export default function FilterSidebarSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <div className="h-6 w-24 bg-gray-200 rounded mb-4 animate-pulse"></div>
        <div className="space-y-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center space-x-2">
              <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="h-6 w-24 bg-gray-200 rounded mb-4 animate-pulse"></div>
        <div className="space-y-4">
          <div className="h-2 bg-gray-200 rounded-full animate-pulse"></div>
          <div className="flex justify-between">
            <div className="h-4 w-12 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-12 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </div>

      <div>
        <div className="h-6 w-24 bg-gray-200 rounded mb-4 animate-pulse"></div>
        <div className="space-y-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center space-x-2">
              <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

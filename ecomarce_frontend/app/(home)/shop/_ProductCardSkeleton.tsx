export default function ProductCardSkeleton() {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-sm border border-gray-100 animate-pulse">
      <div className="relative">
        <div className="aspect-square bg-gray-200 rounded-xl mb-4"></div>
        <div className="h-4 w-16 bg-gray-200 rounded-full absolute top-2 left-2"></div>
      </div>
      <div className="space-y-2">
        <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
        <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
        <div className="flex items-center gap-1">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-3 w-3 bg-gray-200 rounded-sm mx-0.5"
              ></div>
            ))}
          </div>
          <div className="h-3 w-8 bg-gray-200 rounded ml-1"></div>
        </div>
        <div className="flex justify-between items-center pt-2">
          <div className="h-5 w-16 bg-gray-200 rounded"></div>
          <div className="h-5 w-5 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  );
}

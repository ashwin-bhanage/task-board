export default function LoadingSkeleton() {
  return (
    <div className="flex gap-6 p-6">
      {[1, 2, 3].map(col => (
        <div key={col} className="w-80 space-y-3">
          <div className="h-8 bg-gray-200 rounded animate-pulse" />
          {[1, 2, 3].map(card => (
            <div key={card} className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="h-4 bg-gray-200 rounded animate-pulse mb-3" />
              <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3" />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

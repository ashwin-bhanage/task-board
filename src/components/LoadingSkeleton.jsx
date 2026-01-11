import { useTheme } from "../context/ThemeContext";

export default function LoadingSkeleton() {
  const { isDarkMode } = useTheme();

  return (
    <div className="flex gap-6 p-6 h-full overflow-hidden">
      {[1, 2, 3].map((col) => (
        <div key={col} className="w-80 space-y-3 shrink-0">
          {/* Column Header Skeleton */}
          <div className="flex items-center justify-between mb-4">
            <div
              className={`h-6 w-32 ${
                isDarkMode ? "bg-neutral-800" : "bg-gray-200"
              } rounded animate-pulse`}
            />
            <div
              className={`h-6 w-8 ${
                isDarkMode ? "bg-neutral-800" : "bg-gray-200"
              } rounded-full animate-pulse`}
            />
          </div>

          {/* Task Card Skeletons */}
          {[1, 2, 3].map((card) => (
            <div
              key={card}
              className={`${
                isDarkMode
                  ? "bg-neutral-900 border-neutral-800"
                  : "bg-white border-gray-200"
              } p-4 rounded-lg border`}
            >
              {/* Task Title Skeleton */}
              <div
                className={`h-5 ${
                  isDarkMode ? "bg-neutral-800" : "bg-gray-200"
                } rounded animate-pulse mb-3`}
              />

              {/* Task Meta Skeleton */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {/* Avatar Skeleton */}
                  <div
                    className={`w-6 h-6 ${
                      isDarkMode ? "bg-neutral-800" : "bg-gray-200"
                    } rounded-full animate-pulse`}
                  />
                  {/* Name Skeleton */}
                  <div
                    className={`h-3 w-16 ${
                      isDarkMode ? "bg-neutral-800" : "bg-gray-200"
                    } rounded animate-pulse`}
                  />
                </div>
                <div className="flex items-center gap-2">
                  {/* Date Skeleton */}
                  <div
                    className={`h-3 w-12 ${
                      isDarkMode ? "bg-neutral-800" : "bg-gray-200"
                    } rounded animate-pulse`}
                  />
                  {/* Priority Badge Skeleton */}
                  <div
                    className={`h-6 w-14 ${
                      isDarkMode ? "bg-neutral-800" : "bg-gray-200"
                    } rounded animate-pulse`}
                  />
                </div>
              </div>
            </div>
          ))}

          {/* Add Button Skeleton */}
          <div
            className={`w-full h-12 ${
              isDarkMode ? "bg-neutral-900 border-neutral-800" : "bg-white border-gray-200"
            } rounded-lg border-2 border-dashed animate-pulse`}
          />
        </div>
      ))}
    </div>
  );
}

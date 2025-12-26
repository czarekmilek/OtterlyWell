// import { LoadingSpinner } from "../../../UI/LoadingSpinner";

export function TransactionListSkeleton() {
  return (
    <div className="relative overflow-hidden">
      <div className="space-y-4">
        {
          // [1, 2, 3, 4].map((i) => (
          [1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-16 bg-brand-neutral-dark/30 rounded-lg animate-pulse"
            />
          ))
        }
      </div>
      {/* <div className="absolute flex items-center justify-center inset-0">
        <LoadingSpinner />
      </div> */}
    </div>
  );
}

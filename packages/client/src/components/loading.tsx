import { cn } from "@shadcn/utils";
import { Spinner } from "./icons/spinner";

export const Loading: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div
      className={cn(
        "flex flex-row items-center gap-2 text-sm text-background",
        className
      )}
    >
      <Spinner className="h-4 w-4 animate-spin" />
      Loading...
    </div>
  );
};

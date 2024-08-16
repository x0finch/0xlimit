import { cn } from "@shadcn/utils";
import { SpinnerIcon } from "./icons/spinner";

export const Loading: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div
      className={cn(
        "flex flex-row items-center gap-2 text-sm text-background",
        className
      )}
    >
      <SpinnerIcon />
      Loading...
    </div>
  );
};

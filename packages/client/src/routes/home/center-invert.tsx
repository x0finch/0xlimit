import { Button } from "@shadcn/components/ui/button";
import { SymbolIcon } from "@radix-ui/react-icons";
import { useDraftMakerContext } from "./context";

export const CenterInvert = () => {
  const { invert } = useDraftMakerContext()
  return (
    <Button
      onClick={invert}
      variant="outline"
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 p-0 border-4 border-background bg-accent shadow-none rounded-xl"
    >
      <SymbolIcon />
    </Button>
  );
};

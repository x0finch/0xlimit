import { Link } from "react-router-dom";
import { ExternalLinkIcon } from "@radix-ui/react-icons";

export const Comment = () => {
  return (
    <div className="w-full flex text-sm text-muted-foreground p-4 bg-muted rounded-sm ">
      Review created limit orders through
      <Link
        target="_blank"
        rel="noopener noreferrer"
        to="https://app.uniswap.org/pool"
        className="underline text-primary ml-1 inline-flex flex-row items-center"
      >
        Uniswap Pools
        <ExternalLinkIcon className="w-4 h-4 ml-1 mt-0.5" />
      </Link>
    </div>
  );
};

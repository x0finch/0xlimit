import { Link, Outlet } from "react-router-dom";
import { Navbar } from "~/components/nav-bar";
import { Analytics } from "@vercel/analytics/react";
import { GitHubLogoIcon } from "@radix-ui/react-icons";

const Root = () => {
  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <Analytics />
    </div>
  );
};

const GithubLink = () => {
  return (
    <Link
      target="_blank"
      rel="noopener noreferrer"
      to="https://github.com/x0finch/0xlimit"
    >
      <GitHubLogoIcon className="h-4 w-4" />
    </Link>
  );
};

const PoweredBy = () => {
  return (
    <div className="text-xs text-muted-foreground">
      Powered by Uniswap Liquidity V3
    </div>
  );
};

const Footer = () => {
  return (
    <footer className="flex justify-center items-center relative px-4 py-1">
      <PoweredBy />
      <div className="absolute right-2">
        <GithubLink />
      </div>
    </footer>
  );
};

export const Component = Root;

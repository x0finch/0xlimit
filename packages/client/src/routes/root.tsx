import { Link, Outlet } from "react-router-dom";
import { Navbar } from "~/components/nav-bar";
import { Analytics } from "@vercel/analytics/react";

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

const Footer = () => {
  return (
    <footer className="flex items-center relative px-4 py-1">
      <div className="text-[11px] text-muted-foreground">
        Powered by Uniswap Liquidity V3, the source code is available on{" "}
        <Link
          to="https://github.com/x0finch/0xlimit"
          className="underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </Link>
        .
      </div>
    </footer>
  );
};

export const Component = Root;

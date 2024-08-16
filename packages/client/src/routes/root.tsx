import { Outlet } from "react-router-dom";
import { Navbar } from "~/components/nav-bar";
import { Analytics } from "@vercel/analytics/react";

const Root = () => {
  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Analytics />
    </div>
  );
};

export const Component = Root;

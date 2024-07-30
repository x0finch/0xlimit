import { Outlet } from "react-router-dom";
import { Navbar } from "~/components/nav-bar";

const Root = () => {
  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};

export const Component = Root;

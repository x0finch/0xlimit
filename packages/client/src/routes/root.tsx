import { Outlet } from "react-router-dom";
import { Navbar } from "~/components/nav-bar";

const Root = () => {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
    </>
  );
};

export const Component = Root;

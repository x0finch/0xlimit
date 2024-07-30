import { createBrowserRouter } from "react-router-dom";

export const router: ReturnType<typeof createBrowserRouter> =
  createBrowserRouter([
    {
      path: "/",
      lazy: () => import("./root"),
      children: [
        {
          index: true,
          lazy: () => import("./home"),
        },
      ],
    },
  ]);

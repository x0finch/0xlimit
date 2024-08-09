import { ThemeProvider } from "@shadcn/components/theme-provider";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { Web3Provider } from "./components/wagmi/web3-provider";

export function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="shadcn-ui-theme">
      <Web3Provider>
        <RouterProvider router={router} />
      </Web3Provider>
    </ThemeProvider>
  );
}

export default App;

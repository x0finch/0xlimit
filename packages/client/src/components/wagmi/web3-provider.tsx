import { mainnet } from "viem/chains";
import { createConfig, WagmiProvider } from "wagmi";
import { createClient, http } from "viem";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";

const config = createConfig(
  getDefaultConfig({
    chains: [mainnet],
    client({ chain }) {
      return createClient({ chain, transport: http() });
    },
    appName: "0xLimit",
    appDescription: "A Limit Order Application Powered By Uniswap Liquidity V3",
    walletConnectProjectId: "",
  })
);

const queryClient = new QueryClient();

export const Web3Provider: React.FC<React.PropsWithChildren<unknown>> = ({
  children,
}) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider>{children}</ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

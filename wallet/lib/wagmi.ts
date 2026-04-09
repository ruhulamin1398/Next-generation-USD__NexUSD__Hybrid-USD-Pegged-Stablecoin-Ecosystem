import { createConfig } from "wagmi";
import { getDefaultConfig } from "connectkit";
import {
    mainnet,
    sepolia,
    baseSepolia,
    arbitrumSepolia,
    optimismSepolia,
    polygonAmoy,
    avalancheFuji,
    hoodi,
    gnosisChiado,
    mantleSepoliaTestnet,
} from "wagmi/chains";

const chains = [
    sepolia,
    baseSepolia,
    arbitrumSepolia,
    optimismSepolia,
    polygonAmoy,
    mainnet,
    avalancheFuji,
    hoodi,
    gnosisChiado,
    mantleSepoliaTestnet,
] as const;

export const wagmiConfig = createConfig(
    getDefaultConfig({
        chains,
        walletConnectProjectId:
            process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? "",
        appName: "NexUSD Wallet",
        appDescription: "Next-Generation USD Stablecoin Wallet",
        appUrl: process.env.NEXT_PUBLIC_APP_URL,
        enableAaveAccount: false,
    }),
);

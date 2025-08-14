import React from "react";

// Network icon components using simple SVGs for now
const EthereumIcon = () => (
  <svg viewBox="0 0 32 32" className="w-full h-full">
    <g fill="none" fillRule="evenodd">
      <circle cx="16" cy="16" r="16" fill="#627EEA" />
      <g fill="#FFF" fillRule="nonzero">
        <path fillOpacity=".602" d="M16.498 4v8.87l7.497 3.35z" />
        <path d="M16.498 4L9 16.22l7.498-3.35z" />
        <path fillOpacity=".602" d="M16.498 21.968v6.027L24 17.616z" />
        <path d="M16.498 27.995v-6.028L9 17.616z" />
        <path fillOpacity=".2" d="M16.498 20.573l7.497-4.353-7.497-3.348z" />
        <path fillOpacity=".602" d="M9 16.22l7.498 4.353v-7.701z" />
      </g>
    </g>
  </svg>
);

const PolygonIcon = () => (
  <svg viewBox="0 0 32 32" className="w-full h-full">
    <g fill="none" fillRule="evenodd">
      <circle cx="16" cy="16" r="16" fill="#8247E5" />
      <path
        d="M21.092 12.693c-.369-.215-.848-.215-1.254 0l-2.879 1.654-1.955 1.078-2.879 1.653c-.369.216-.848.216-1.254 0l-2.288-1.294c-.369-.215-.627-.647-.627-1.078V12.19c0-.431.221-.863.627-1.078l2.25-1.258c.369-.216.848-.216 1.254 0l2.25 1.258c.369.215.627.647.627 1.078v1.654l1.955-1.115V11.08c0-.431-.22-.863-.627-1.078l-4.17-2.373c-.369-.216-.848-.216-1.254 0l-4.244 2.373c-.369.215-.627.647-.627 1.078v4.746c0 .431.221.863.627 1.078l4.244 2.373c.369.215.848.215 1.254 0l2.879-1.617 1.955-1.115 2.879-1.616c.369-.216.848-.216 1.254 0l2.25 1.258c.369.215.627.647.627 1.078v2.516c0 .431-.221.863-.627 1.078l-2.25 1.294c-.369.216-.848.216-1.254 0l-2.25-1.258c-.369-.215-.627-.647-.627-1.078v-1.654l-1.955 1.115v1.653c0 .431.221.863.627 1.078l4.244 2.374c.369.215.848.215 1.254 0l4.244-2.374c.369-.215.627-.647.627-1.078v-4.746c0-.431-.221-.863-.627-1.078l-4.244-2.373z"
        fill="#FFF"
      />
    </g>
  </svg>
);

const AvalancheIcon = () => (
  <svg viewBox="0 0 32 32" className="w-full h-full">
    <g fill="none" fillRule="evenodd">
      <circle cx="16" cy="16" r="16" fill="#E84142" />
      <path
        d="M14.171 18.687h3.658c.275 0 .444-.138.513-.344l3.021-7.318c.069-.207.069-.414 0-.55-.069-.138-.238-.276-.513-.276h-3.658c-.275 0-.444.138-.513.276-.069.138-.069.344 0 .55l3.021 7.318c.069.206.238.344.513.344zm-6.042 4.469h11.742c.55 0 .894-.275 1.032-.688.138-.413 0-.894-.344-1.238l-5.887-5.887c-.344-.344-.825-.481-1.238-.344-.413.138-.688.481-.688 1.032v11.742c0 .55.275.894.688 1.032.413.138.894 0 1.238-.344l5.887-5.887c.344-.344.481-.825.344-1.238-.138-.413-.481-.688-1.032-.688H8.129z"
        fill="#FFF"
      />
    </g>
  </svg>
);

const OptimismIcon = () => (
  <svg viewBox="0 0 32 32" className="w-full h-full">
    <g fill="none" fillRule="evenodd">
      <circle cx="16" cy="16" r="16" fill="#FF0420" />
      <path
        d="M12.611 21.984h4.738c2.996 0 5.42-2.388 5.42-5.336 0-2.948-2.424-5.336-5.42-5.336h-1.684c-.792 0-1.584.624-1.584 1.404v8.864c0 .78.792 1.404 1.584 1.404h.946z"
        fill="#FFF"
      />
      <path
        d="M7.236 21.984h4.738c2.996 0 5.42-2.388 5.42-5.336 0-2.948-2.424-5.336-5.42-5.336H9.29c-.792 0-1.584.624-1.584 1.404v8.864c0 .78.792 1.404 1.584 1.404h.946z"
        fill="#FFF"
      />
    </g>
  </svg>
);

const ArbitrumIcon = () => (
  <svg viewBox="0 0 32 32" className="w-full h-full">
    <g fill="none" fillRule="evenodd">
      <circle cx="16" cy="16" r="16" fill="#28A0F0" />
      <path
        d="M7.283 17.693l7.071-12.25c.707-1.225 2.475-1.225 3.182 0l7.071 12.25c.707 1.225-.177 2.756-1.591 2.756H8.874c-1.414 0-2.298-1.531-1.591-2.756z"
        fill="#FFF"
      />
      <path d="M12.5 15.5l3.5-6 3.5 6-3.5 2-3.5-2z" fill="#28A0F0" />
    </g>
  </svg>
);

const BnbIcon = () => (
  <svg viewBox="0 0 32 32" className="w-full h-full">
    <g fill="none" fillRule="evenodd">
      <circle cx="16" cy="16" r="16" fill="#F3BA2F" />
      <path
        d="M12.116 14.404L16 10.52l3.886 3.884 2.26-2.26L16 6l-6.144 6.144 2.26 2.26zM6 16l2.26-2.26L10.52 16l-2.26 2.26L6 16zm6.116 1.596L16 21.48l3.886-3.884 2.26 2.26L16 26l-6.144-6.144-2.26-2.26zm9.764-5.844L24.14 16 21.88 18.26 19.62 16l2.26-2.26z"
        fill="#FFF"
      />
    </g>
  </svg>
);

import { Network } from "../../interfaces/network";

export const networks: Network[] = [
  // Crypto Backed Networks (All Testnets)
  {
    name: "Polygon Amoy",
    logo: PolygonIcon,
    url: "#",
    type: "crypto",
    status: "coming-soon",
    contractAddress: "",
    description: "Polygon testnet for crypto-backed development and testing",
    chainId: 80002,
    rpcUrl: "https://rpc-amoy.polygon.technology",
    explorerUrl: "https://amoy.polygonscan.com",
  },
  {
    name: "Ethereum Sepolia",
    logo: EthereumIcon,
    url: "#",
    type: "crypto",
    status: "coming-soon",
    contractAddress: "",
    description: "Ethereum testnet for crypto-backed development and testing",
    chainId: 11155111,
    rpcUrl: "https://sepolia.infura.io/v3/YOUR_INFURA_KEY",
    explorerUrl: "https://sepolia.etherscan.io",
  },

  {
    name: "Avalanche Fuji",
    logo: AvalancheIcon,
    url: "#",
    type: "crypto",
    status: "coming-soon",
    contractAddress: "",
    description: "Avalanche testnet for crypto-backed development and testing",
    chainId: 43113,
    rpcUrl: "https://api.avax-test.network/ext/bc/C/rpc",
    explorerUrl: "https://testnet.snowtrace.io",
  },
  {
    name: "Optimism Sepolia",
    logo: OptimismIcon,
    url: "#",
    type: "crypto",
    status: "coming-soon",
    contractAddress: "",
    description:
      "Optimism testnet for crypto-backed layer 2 development and testing",
    chainId: 11155420,
    rpcUrl: "https://sepolia.optimism.io",
    explorerUrl: "https://sepolia-optimism.etherscan.io",
  },
  {
    name: "Arbitrum Sepolia",
    logo: ArbitrumIcon,
    url: "#",
    type: "crypto",
    status: "coming-soon",
    contractAddress: "",
    description:
      "Arbitrum testnet for crypto-backed layer 2 development and testing",
    chainId: 421614,
    rpcUrl: "https://sepolia-rollup.arbitrum.io/rpc",
    explorerUrl: "https://sepolia.arbiscan.io",
  },
  {
    name: "BNB Smart Chain Testnet",
    logo: BnbIcon,
    url: "#",
    type: "crypto",
    status: "coming-soon",
    contractAddress: "",
    description:
      "BNB Smart Chain testnet for crypto-backed development and testing",
    chainId: 97,
    rpcUrl: "https://data-seed-prebsc-1-s1.binance.org:8545",
    explorerUrl: "https://testnet.bscscan.com",
  },

  // Fiat Backed Networks (All Testnets)

  {
    name: "Polygon Amoy",
    logo: PolygonIcon,
    url: "https://amoy.polygonscan.com/address/0x6db9d8fea1b96fe25b2382a6b26656d9eb260502",
    type: "fiat",
    status: "live",
    contractAddress: "0x6db9d8fea1b96fe25b2382a6b26656d9eb260502",
    description: "Polygon testnet for fiat-backed development and testing",
    chainId: 80002,
    rpcUrl: "https://rpc-amoy.polygon.technology",
    explorerUrl: "https://amoy.polygonscan.com",
  },
  {
    name: "Ethereum Sepolia",
    logo: EthereumIcon,
    url: "#",
    type: "fiat",
    status: "coming-soon",
    contractAddress: "",
    description: "Ethereum testnet for fiat-backed development and testing",
    chainId: 11155111,
    rpcUrl: "https://sepolia.infura.io/v3/YOUR_INFURA_KEY",
    explorerUrl: "https://sepolia.etherscan.io",
  },
  {
    name: "Avalanche Fuji",
    logo: AvalancheIcon,
    url: "#",
    type: "fiat",
    status: "coming-soon",
    contractAddress: "",
    description: "Avalanche testnet for fiat-backed development and testing",
    chainId: 43113,
    rpcUrl: "https://api.avax-test.network/ext/bc/C/rpc",
    explorerUrl: "https://testnet.snowtrace.io",
  },
  {
    name: "Optimism Goerli",
    logo: OptimismIcon,
    url: "#",
    type: "fiat",
    status: "coming-soon",
    contractAddress: "",
    description:
      "Optimism testnet for fiat-backed layer 2 development and testing",
    chainId: 420,
    rpcUrl: "https://goerli.optimism.io",
    explorerUrl: "https://goerli-optimism.etherscan.io",
  },
  {
    name: "Arbitrum Goerli",
    logo: ArbitrumIcon,
    url: "#",
    type: "fiat",
    status: "coming-soon",
    contractAddress: "",
    description:
      "Arbitrum testnet for fiat-backed layer 2 development and testing",
    chainId: 421613,
    rpcUrl: "https://goerli-rollup.arbitrum.io/rpc",
    explorerUrl: "https://goerli.arbiscan.io",
  },
  {
    name: "BNB Smart Chain Testnet",
    logo: BnbIcon,
    url: "#",
    type: "fiat",
    status: "coming-soon",
    contractAddress: "",
    description:
      "BNB Smart Chain testnet for fiat-backed development and testing",
    chainId: 97,
    rpcUrl: "https://data-seed-prebsc-1-s1.binance.org:8545",
    explorerUrl: "https://testnet.bscscan.com",
  },
];

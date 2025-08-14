import React from "react";

export interface Network {
  name: string;
  logo: React.ComponentType | string;
  url: string;
  type: "crypto" | "fiat";
  status: "live" | "coming-soon";
  contractAddress?: string;
  description?: string;
  chainId?: number;
  rpcUrl?: string;
  explorerUrl?: string;
  gasPrice?: string; // Gas price in gwei
}

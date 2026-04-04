import { useState, useEffect, useCallback, useMemo } from "react";

import { networks as staticNetworks } from "../utils/const/networks";
import type { Network } from "../interfaces/network";

export type NetworkType = "crypto" | "fiat";
export type NetworkStatus = "live" | "coming-soon";

export interface BackendNetworkConfig {
    _id: string;
    title: string;
    contractAddress: string;
    decimals: number;
    rpcUrl: string;
    network: string;
    explorerUrl: string;
    totalHolders: number;
    totalSupply: number;
    totalTransferred: number;
}

export interface NetworkFilter {
    type?: NetworkType;
    status?: NetworkStatus;
    name?: string;
    chainId?: number;
}

export interface UseNetworkConfigReturn {
    allNetworks: Network[];
    liveNetworks: Network[];
    fiatNetworks: Network[];
    cryptoNetworks: Network[];
    isLoading: boolean;
    error: string | null;
    getNetworkByName: (name: string) => Network | undefined;
    getNetworkByChainId: (chainId: number) => Network | undefined;
    filterNetworks: (filter?: NetworkFilter) => Network[];
}

function mapBackendConfigToNetwork(config: BackendNetworkConfig): Network {
    return {
        name: config.title,
        logo: "",
        url: config.explorerUrl
            ? `${config.explorerUrl}/address/${config.contractAddress}`
            : "#",
        type: "fiat",
        status: "live",
        contractAddress: config.contractAddress,
        rpcUrl: config.rpcUrl || undefined,
        explorerUrl: config.explorerUrl || undefined,
    };
}

export const useNetworkConfig = (): UseNetworkConfigReturn => {
    const [fiatNetworks, setFiatNetworks] = useState<Network[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Crypto networks are always static and coming-soon
    const cryptoNetworks = useMemo(
        () => staticNetworks.filter((n) => n.type === "crypto"),
        []
    );

    useEffect(() => {
        let cancelled = false;

        async function fetchFiatNetworks() {
            setIsLoading(true);
            setError(null);
            try {
                const response = await fetch("/api/configs");
                if (!response.ok) {
                    throw new Error(`Failed to fetch network configs: ${response.status}`);
                }
                const data: BackendNetworkConfig[] = await response.json();
                if (!cancelled) {
                    setFiatNetworks(data.map(mapBackendConfigToNetwork));
                }
            } catch (err) {
                if (!cancelled) {
                    setError(err instanceof Error ? err.message : "Unknown error fetching network configs");
                }
            } finally {
                if (!cancelled) {
                    setIsLoading(false);
                }
            }
        }

        fetchFiatNetworks();
        return () => {
            cancelled = true;
        };
    }, []);

    const allNetworks = useMemo(
        () => [...cryptoNetworks, ...fiatNetworks],
        [cryptoNetworks, fiatNetworks]
    );

    const liveNetworks = useMemo(
        () => allNetworks.filter((n) => n.status === "live"),
        [allNetworks]
    );

    const getNetworkByName = useCallback(
        (name: string) =>
            allNetworks.find((n) => n.name.toLowerCase() === name.toLowerCase()),
        [allNetworks]
    );

    const getNetworkByChainId = useCallback(
        (chainId: number) => allNetworks.find((n) => n.chainId === chainId),
        [allNetworks]
    );

    const filterNetworks = useCallback(
        (filter?: NetworkFilter) => {
            if (!filter) return allNetworks;

            return allNetworks.filter((n) => {
                const matchesType = filter.type ? n.type === filter.type : true;
                const matchesStatus = filter.status ? n.status === filter.status : true;
                const matchesName = filter.name
                    ? n.name.toLowerCase().includes(filter.name.toLowerCase())
                    : true;
                const matchesChainId = filter.chainId ? n.chainId === filter.chainId : true;

                return matchesType && matchesStatus && matchesName && matchesChainId;
            });
        },
        [allNetworks]
    );

    return {
        allNetworks,
        liveNetworks,
        fiatNetworks,
        cryptoNetworks,
        isLoading,
        error,
        getNetworkByName,
        getNetworkByChainId,
        filterNetworks,
    };
};


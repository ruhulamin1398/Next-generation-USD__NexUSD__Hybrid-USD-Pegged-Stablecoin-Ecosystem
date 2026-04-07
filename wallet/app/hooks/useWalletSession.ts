"use client";

import { useAccount } from "wagmi";
import { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "nexusd-wallet-session";

export type WalletSessionType = "own" | "dummy" | "none";

export interface WalletSession {
  type: WalletSessionType;
  address: string | null;
  isConnected: boolean;
  isDummy: boolean;
  isOwn: boolean;
  ready: boolean;
  dummyLoading: boolean;
  dummyError: string | null;
  connectDummy: () => Promise<void>;
  disconnectDummy: () => void;
}

interface StoredWalletSession {
  type: "dummy";
  address: string;
}

export function useWalletSession(): WalletSession {
  const { address: ownAddress, isConnected: ownConnected } = useAccount();
  const [dummyAddress, setDummyAddress] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [dummyLoading, setDummyLoading] = useState(false);
  const [dummyError, setDummyError] = useState<string | null>(null);

  useEffect(() => {
    setReady(true);

    if (typeof window === "undefined") {
      return;
    }

    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return;
      }

      const parsed = JSON.parse(raw) as StoredWalletSession;
      if (parsed?.type === "dummy" && typeof parsed.address === "string") {
        setDummyAddress(parsed.address);
      }
    } catch {
      sessionStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    if (ownConnected && dummyAddress) {
      sessionStorage.removeItem(STORAGE_KEY);
      setDummyAddress(null);
    }
  }, [ownConnected, dummyAddress]);

  const isDummy = !!dummyAddress && !ownConnected;
  const isOwn = ownConnected;
  const address = ownConnected ? ownAddress ?? null : dummyAddress;
  const isConnected = isOwn || isDummy;

  const connectDummy = async () => {
    setDummyLoading(true);
    setDummyError(null);

    try {
      const response = await fetch("/api/dummy-wallet");
      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        throw new Error(
          payload?.error || "Unable to load the demo wallet. Check .env settings.",
        );
      }

      const data = await response.json();
      if (!data?.address) {
        throw new Error("Dummy wallet API returned invalid data.");
      }

      setDummyAddress(data.address);
      sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ type: "dummy", address: data.address }),
      );
    } catch (error: unknown) {
      setDummyError(error instanceof Error ? error.message : "Unknown error");
    } finally {
      setDummyLoading(false);
    }
  };

  const disconnectDummy = () => {
    setDummyAddress(null);
    setDummyError(null);
    if (typeof window !== "undefined") {
      sessionStorage.removeItem(STORAGE_KEY);
    }
  };

  return useMemo(
    () => ({
      type: isOwn ? "own" : isDummy ? "dummy" : "none",
      address,
      isConnected,
      isDummy,
      isOwn,
      ready,
      dummyLoading,
      dummyError,
      connectDummy,
      disconnectDummy,
    }),
    [address, dummyError, dummyLoading, isConnected, isDummy, isOwn, ready],
  );
}

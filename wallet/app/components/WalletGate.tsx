"use client";

import { useDisconnect } from "wagmi";
import { useWalletSession } from "@/app/hooks/useWalletSession";
import { ConnectModal } from "./ConnectModal";

function shortenAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function WalletGate({ children }: { children: React.ReactNode }) {
  const session = useWalletSession();
  const { disconnect } = useDisconnect();

  const disconnectHandler = async () => {
    if (session.isDummy) {
      session.disconnectDummy();
      return;
    }

    try {
      await disconnect();
    } catch {
      // swallow disconnect errors for UI simplicity
    }
  };

  if (!session.ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
        <p className="rounded-3xl border border-slate-200 bg-white/90 px-6 py-4 text-sm text-slate-700 shadow-xl shadow-slate-200/40 dark:border-slate-800 dark:bg-slate-950/90 dark:text-slate-300">
          Restoring wallet session...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      {!session.isConnected ? (
        <ConnectModal
          onSelectDummy={session.connectDummy}
          dummyLoading={session.dummyLoading}
          dummyError={session.dummyError}
        />
      ) : null}

      {session.isConnected ? (
        <div className="min-h-screen">
          <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/95 py-4 backdrop-blur dark:border-slate-800/80 dark:bg-slate-950/95">
            <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-6 sm:px-8">
              <div>
                <p className="text-xs uppercase tracking-[0.32em] text-slate-500 dark:text-slate-400">
                  Connected wallet
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-slate-800 dark:text-slate-200">
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    {session.isDummy ? "Demo Wallet" : "Own Wallet"}
                  </span>
                  <span className="font-mono">{session.address ? shortenAddress(session.address) : "-"}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={disconnectHandler}
                className="rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
              >
                Disconnect
              </button>
            </div>
          </header>

          <main className="mx-auto max-w-6xl px-6 py-10 sm:px-8">
            {children}
          </main>
        </div>
      ) : null}
    </div>
  );
}

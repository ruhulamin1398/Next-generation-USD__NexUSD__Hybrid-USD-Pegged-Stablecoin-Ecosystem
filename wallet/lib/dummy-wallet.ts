import { privateKeyToAccount } from "viem/accounts";

export function getDummyWalletAddress() {
  const privateKey = process.env.DUMMY_WALLET_PRIVATE_KEY;
  if (!privateKey) {
    throw new Error("DUMMY_WALLET_PRIVATE_KEY is not configured in the server environment.");
  }

  const account = privateKeyToAccount(privateKey as `0x${string}`);
  return account.address;
}

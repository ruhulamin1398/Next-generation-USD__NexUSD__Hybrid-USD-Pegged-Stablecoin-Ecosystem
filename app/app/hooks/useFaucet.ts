import { useState, useCallback } from "react";

export interface FaucetFormData {
  address: string;
  network: string;
  amount: string;
}

export interface FaucetResponse {
  success: boolean;
  transactionHash?: string;
  error?: string;
  network?: {
    name: string;
    explorerUrl: string;
  };
}

export interface UseFaucetReturn {
  fiatForm: FaucetFormData;
  cryptoForm: FaucetFormData;
  responses: {
    fiat?: FaucetResponse;
    crypto?: FaucetResponse;
  };
  isLoading: boolean;
  updateForm: (
    type: "fiat" | "crypto",
    field: keyof FaucetFormData,
    value: string
  ) => void;
  submitForm: (type: "fiat" | "crypto") => Promise<void>;
  resetForm: (type: "fiat" | "crypto") => void;
  clearResponse: (type: "fiat" | "crypto") => void;
}

const initialFormData: FaucetFormData = {
  address: "",
  network: "",
  amount: "",
};

export const useFaucet = (): UseFaucetReturn => {
  const [fiatForm, setFiatForm] = useState<FaucetFormData>(initialFormData);
  const [cryptoForm, setCryptoForm] = useState<FaucetFormData>(initialFormData);
  const [isLoading, setIsLoading] = useState(false);
  const [responses, setResponses] = useState<{
    fiat?: FaucetResponse;
    crypto?: FaucetResponse;
  }>({});

  const validateForm = useCallback((form: FaucetFormData): string | null => {
    if (!form.address || !form.network || !form.amount) {
      return "Please fill in all fields";
    }

    // Validate address format (basic check for Ethereum address)
    const addressRegex = /^0x[a-fA-F0-9]{40}$/;
    if (!addressRegex.test(form.address)) {
      return "Invalid wallet address format";
    }

    // Validate amount (max 500)
    const amount = parseFloat(form.amount);
    if (isNaN(amount) || amount <= 0 || amount > 500) {
      return "Amount must be between 1 and 500 tokens";
    }

    return null;
  }, []);

  const updateForm = useCallback(
    (type: "fiat" | "crypto", field: keyof FaucetFormData, value: string) => {
      const setForm = type === "fiat" ? setFiatForm : setCryptoForm;

      // For amount field, only allow valid numbers
      if (field === "amount") {
        if (value === "" || /^\d*\.?\d*$/.test(value)) {
          setForm((prev) => ({ ...prev, [field]: value }));
        }
      } else {
        setForm((prev) => ({ ...prev, [field]: value }));
      }
    },
    []
  );

  const submitForm = useCallback(
    async (type: "fiat" | "crypto") => {
      const form = type === "fiat" ? fiatForm : cryptoForm;
      const setForm = type === "fiat" ? setFiatForm : setCryptoForm;

      // Validate form
      const validationError = validateForm(form);
      if (validationError) {
        setResponses((prev) => ({
          ...prev,
          [type]: { success: false, error: validationError },
        }));
        return;
      }

      setIsLoading(true);
      setResponses((prev) => ({ ...prev, [type]: undefined }));

      try {
        const response = await fetch("/api/faucet", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            address: form.address,
            network: form.network,
            amount: form.amount,
            type: type,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          setResponses((prev) => ({
            ...prev,
            [type]: {
              success: true,
              transactionHash: data.transactionHash,
              network: data.network,
            },
          }));
          // Reset form on success
          setForm(initialFormData);
        } else {
          setResponses((prev) => ({
            ...prev,
            [type]: {
              success: false,
              error: data.error || "Failed to mint tokens",
            },
          }));
        }
      } catch (error) {
        setResponses((prev) => ({
          ...prev,
          [type]: { success: false, error: "Network error. Please try again." },
        }));
      } finally {
        setIsLoading(false);
      }
    },
    [fiatForm, cryptoForm, validateForm]
  );

  const resetForm = useCallback((type: "fiat" | "crypto") => {
    const setForm = type === "fiat" ? setFiatForm : setCryptoForm;
    setForm(initialFormData);
  }, []);

  const clearResponse = useCallback((type: "fiat" | "crypto") => {
    setResponses((prev) => ({ ...prev, [type]: undefined }));
  }, []);

  return {
    fiatForm,
    cryptoForm,
    responses,
    isLoading,
    updateForm,
    submitForm,
    resetForm,
    clearResponse,
  };
};

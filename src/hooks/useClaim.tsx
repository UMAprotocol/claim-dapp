import React from "react";

const EMPTY: unique symbol = Symbol();

type NetworkStatus = "idle" | "pending" | "resolved" | "rejected";
type TClaimContext = {
  claim: () => void;
  claimed: boolean;
  status: NetworkStatus;
  error: Error | null;
  isLoading: boolean;
};
const ClaimContext = React.createContext<typeof EMPTY | TClaimContext>(EMPTY);

export function useClaim() {
  const context = React.useContext(ClaimContext);

  if (context === EMPTY) {
    throw new Error(`UseClaim must be used within a Claim Provider.`);
  }

  return context;
}

export const ClaimProvider: React.FC = ({ children, ...delegated }) => {
  const [claimed, setClaimed] = React.useState(false);
  const [status, setStatus] = React.useState<NetworkStatus>("idle");
  const [error, setError] = React.useState<Error | null>(null);
  const claim = React.useCallback(() => {
    setStatus("pending");
    try {
      setTimeout(() => {
        setClaimed(true);
        setStatus("resolved");
      }, 500);
    } catch (e) {
      setStatus("rejected");
      setError(e);
    }
  }, []);

  const value = {
    claimed,
    status,
    claim,
    isLoading: status === "pending",
    error,
  };
  return (
    <ClaimContext.Provider {...delegated} value={value}>
      {children}
    </ClaimContext.Provider>
  );
};

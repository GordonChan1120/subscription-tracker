import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type { Subscription } from "../types/subscription";
import { mockSubscriptions } from "../data/mock-subscriptions";

interface SubscriptionContextValue {
  subscriptions: Subscription[];
  addSubscription: (sub: Omit<Subscription, "id">) => void;
  updateSubscription: (id: string, data: Partial<Subscription>) => void;
  deleteSubscription: (id: string) => void;
  getSubscription: (id: string) => Subscription | undefined;
}

const SubscriptionContext = createContext<SubscriptionContextValue | null>(
  null,
);

let nextId = mockSubscriptions.length + 1;

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const [subscriptions, setSubscriptions] =
    useState<Subscription[]>(mockSubscriptions);

  const addSubscription = useCallback((sub: Omit<Subscription, "id">) => {
    const newSub: Subscription = { id: String(nextId++), ...sub };
    setSubscriptions((prev) => [...prev, newSub]);
  }, []);

  const updateSubscription = useCallback(
    (id: string, data: Partial<Subscription>) => {
      setSubscriptions((prev) =>
        prev.map((s) => (s.id === id ? { ...s, ...data } : s)),
      );
    },
    [],
  );

  const deleteSubscription = useCallback((id: string) => {
    setSubscriptions((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const getSubscription = useCallback(
    (id: string) => subscriptions.find((s) => s.id === id),
    [subscriptions],
  );

  return (
    <SubscriptionContext.Provider
      value={{
        subscriptions,
        addSubscription,
        updateSubscription,
        deleteSubscription,
        getSubscription,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscriptions() {
  const ctx = useContext(SubscriptionContext);
  if (!ctx)
    throw new Error(
      "useSubscriptions must be used within SubscriptionProvider",
    );
  return ctx;
}

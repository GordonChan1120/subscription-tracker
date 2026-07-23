import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search } from "lucide-react";
import { useSubscriptions } from "../../context/SubscriptionContext";
import { Button } from "../ui/Button";
import { SubscriptionCard } from "./SubscriptionCard";
import { SubscriptionDetail } from "./SubscriptionDetail";
import { EmptyState } from "../ui/EmptyState";
import { CATEGORIES } from "../../types/subscription";

export function SubscriptionsPage() {
  const navigate = useNavigate();
  const { subscriptions, deleteSubscription } = useSubscriptions();
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered = subscriptions
    .filter((s) => {
      const matchSearch =
        !search ||
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.service.toLowerCase().includes(search.toLowerCase());
      const matchCategory = categoryFilter === "all" || s.category === categoryFilter;
      return matchSearch && matchCategory;
    })
    .sort(
      (a, b) =>
        new Date(a.nextPaymentDate).getTime() -
        new Date(b.nextPaymentDate).getTime()
    );

  const selectedSub = selectedId
    ? subscriptions.find((s) => s.id === selectedId)
    : undefined;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Subscriptions</h1>
          <Button onClick={() => navigate("/subscriptions/new")}>
          <Plus size={16} className="mr-1" />
          Add Subscription
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
          />
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 py-2 pl-10 pr-3 text-sm placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        >
          <option value="all">All Categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No subscriptions found"
          description={
            search || categoryFilter !== "all"
              ? "Try adjusting your filters."
              : "Add your first subscription to get started."
          }
          actionLabel="Add Subscription"
          onAction={() => navigate("/subscriptions/new")}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((sub) => (
            <SubscriptionCard
              key={sub.id}
              subscription={sub}
              onEdit={(id) => setSelectedId(id)}
              onDelete={(id) => {
                if (confirm("Delete this subscription?")) deleteSubscription(id);
              }}
            />
          ))}
        </div>
      )}

      {selectedSub && (
        <SubscriptionDetail
          subscription={selectedSub}
          onClose={() => setSelectedId(null)}
          onEdit={() => {}}
          onDelete={(id) => {
            deleteSubscription(id);
            setSelectedId(null);
          }}
        />
      )}
    </div>
  );
}

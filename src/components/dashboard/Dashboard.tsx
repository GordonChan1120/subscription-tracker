import { DollarSign, CreditCard, CalendarClock } from "lucide-react";
import { useSubscriptions } from "../../context/SubscriptionContext";
import { StatsCard } from "./StatsCard";
import { UpcomingPayments } from "./UpcomingPayments";

export function Dashboard() {
  const { subscriptions } = useSubscriptions();

  const activeSubs = subscriptions.filter((s) => s.status === "active");

  const monthlyTotal = activeSubs.reduce((sum, sub) => {
    switch (sub.billingCycle) {
      case "yearly":
        return sum + sub.price / 12;
      case "quarterly":
        return sum + sub.price / 3;
      case "weekly":
        return sum + sub.price * 4.33;
      default:
        return sum + sub.price;
    }
  }, 0);

  const nextPayment = activeSubs
    .slice()
    .sort(
      (a, b) =>
        new Date(a.nextPaymentDate).getTime() -
        new Date(b.nextPaymentDate).getTime()
    )[0];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Dashboard</h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatsCard
          icon={<DollarSign size={24} />}
          label="Monthly Spend"
          value={`$${monthlyTotal.toFixed(2)}`}
          subtext={`From ${activeSubs.length} active subscriptions`}
        />
        <StatsCard
          icon={<CreditCard size={24} />}
          label="Active Subscriptions"
          value={String(activeSubs.length)}
          subtext={`${subscriptions.length - activeSubs.length} inactive`}
        />
        <StatsCard
          icon={<CalendarClock size={24} />}
          label="Next Payment"
          value={
            nextPayment
              ? new Date(nextPayment.nextPaymentDate).toLocaleDateString(
                  "en-US",
                  { month: "short", day: "numeric" }
                )
              : "---"
          }
          subtext={nextPayment ? nextPayment.name : "No active subscriptions"}
        />
      </div>

      <UpcomingPayments subscriptions={subscriptions} />
    </div>
  );
}

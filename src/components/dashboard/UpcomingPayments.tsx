import { useEffect, useState } from "react";
import { format, parseISO, differenceInDays } from "date-fns";
import { CreditCard } from "lucide-react";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { EmptyState } from "../ui/EmptyState";
import type { Subscription } from "../../types/subscription";

interface UpcomingPaymentsProps {
  subscriptions: Subscription[];
}

export function UpcomingPayments({ subscriptions }: UpcomingPaymentsProps) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const upcoming = subscriptions
    .filter((s) => s.status === "active")
    .sort(
      (a, b) =>
        new Date(a.nextPaymentDate).getTime() -
        new Date(b.nextPaymentDate).getTime()
    )
    .slice(0, 5);

  if (upcoming.length === 0) {
    return (
      <Card className="p-6">
        <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
          Upcoming Payments
        </h2>
        <EmptyState
          icon={<CreditCard size={40} />}
          title="No upcoming payments"
          description="All your active subscriptions are paid up."
        />
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
        Upcoming Payments
      </h2>
      <div className="space-y-3">
        {upcoming.map((sub) => {
          const paymentDate = parseISO(sub.nextPaymentDate);
          const daysLeft = differenceInDays(paymentDate, now);
          const formattedDate = format(paymentDate, "MMM d, yyyy");

          let badgeVariant: "warning" | "danger" | "info" = "info";
          let badgeLabel = `${daysLeft} days`;
          if (daysLeft <= 0) {
            badgeVariant = "danger";
            badgeLabel = "Due today";
          } else if (daysLeft <= 3) {
            badgeVariant = "danger";
            badgeLabel = `${daysLeft} day${daysLeft === 1 ? "" : "s"}`;
          } else if (daysLeft <= 7) {
            badgeVariant = "warning";
            badgeLabel = `${daysLeft} days`;
          }

          return (
            <div
              key={sub.id}
              className="flex items-center justify-between rounded-lg border border-gray-100 dark:border-gray-800 px-4 py-3 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-xs font-bold uppercase">
                  {sub.service.slice(0, 2)}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{sub.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{formattedDate}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={badgeVariant}>{badgeLabel}</Badge>
                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  ${sub.price.toFixed(2)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

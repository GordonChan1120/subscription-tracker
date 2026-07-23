import { format, parseISO, differenceInDays } from "date-fns";
import { MoreHorizontal } from "lucide-react";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import type { Subscription } from "../../types/subscription";

interface SubscriptionCardProps {
  subscription: Subscription;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const statusVariant: Record<string, "success" | "warning" | "danger"> = {
  active: "success",
  paused: "warning",
  cancelled: "danger",
};

export function SubscriptionCard({
  subscription: sub,
  onEdit,
  onDelete,
}: SubscriptionCardProps) {
  const daysLeft = differenceInDays(parseISO(sub.nextPaymentDate), new Date());

  let dueLabel = `${daysLeft} days`;
  let dueVariant: "info" | "warning" | "danger" = "info";
  if (daysLeft <= 0) {
    dueVariant = "danger";
    dueLabel = "Due today";
  } else if (daysLeft <= 3) {
    dueVariant = "danger";
    dueLabel = `${daysLeft}d`;
  } else if (daysLeft <= 7) {
    dueVariant = "warning";
    dueLabel = `${daysLeft}d`;
  }

  return (
    <Card className="p-4 transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-900/40 text-sm font-bold text-indigo-600 dark:text-indigo-300 uppercase">
            {sub.service.slice(0, 2)}
          </div>
          <div>
            <p className="font-medium text-gray-900 dark:text-gray-100">{sub.name}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{sub.service}</p>
          </div>
        </div>
        <div className="relative group">
          <button className="rounded-lg p-1 text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
            <MoreHorizontal size={18} />
          </button>
          <div className="absolute right-0 top-full z-10 mt-1 hidden w-32 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-lg group-focus-within:block group-hover:block">
            <button
              onClick={() => onEdit(sub.id)}
              className="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(sub.id)}
              className="w-full px-3 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div>
          <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
            ${sub.price.toFixed(2)}
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 capitalize">{sub.billingCycle}</p>
        </div>
        <div className="text-right">
          <Badge variant={dueVariant}>{dueLabel}</Badge>
          <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
            {format(parseISO(sub.nextPaymentDate), "MMM d")}
          </p>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <Badge>{sub.category}</Badge>
        <Badge variant={statusVariant[sub.status]}>{sub.status}</Badge>
      </div>
    </Card>
  );
}

import { format, parseISO } from "date-fns";
import { X, ExternalLink } from "lucide-react";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import type { Subscription } from "../../types/subscription";

interface SubscriptionDetailProps {
  subscription: Subscription;
  onClose: () => void;
  onEdit: () => void;
  onDelete: (id: string) => void;
}

export function SubscriptionDetail({
  subscription: sub,
  onClose,
  onEdit,
  onDelete,
}: SubscriptionDetailProps) {
  return (
    <div className="fixed inset-0 z-40 flex items-start justify-center pt-20">
      <div
        className="absolute inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
      />
      <Card className="relative z-10 w-full max-w-lg p-6">
        <div className="mb-6 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-900/40 text-lg font-bold text-indigo-600 dark:text-indigo-300 uppercase">
              {sub.service.slice(0, 2)}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{sub.name}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">{sub.service}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Price</p>
            <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
              ${sub.price.toFixed(2)}
              <span className="text-sm font-normal text-gray-400 dark:text-gray-500">
                /{sub.billingCycle}
              </span>
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Category</p>
            <Badge className="mt-1">{sub.category}</Badge>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Billing Cycle</p>
            <p className="mt-1 text-sm font-medium text-gray-900 dark:text-gray-100 capitalize">
              {sub.billingCycle}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Start Date</p>
            <p className="mt-1 text-sm font-medium text-gray-900 dark:text-gray-100">
              {format(parseISO(sub.startDate), "MMM d, yyyy")}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Next Payment</p>
            <p className="mt-1 text-sm font-medium text-gray-900 dark:text-gray-100">
              {format(parseISO(sub.nextPaymentDate), "MMM d, yyyy")}
            </p>
          </div>
        </div>

        {sub.notes && (
          <div className="mb-6">
            <p className="text-xs text-gray-500 dark:text-gray-400">Notes</p>
            <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">{sub.notes}</p>
          </div>
        )}

        <div className="flex items-center justify-between border-t border-gray-100 dark:border-gray-700 pt-4">
          <Button variant="ghost" onClick={() => onDelete(sub.id)}>
            Delete
          </Button>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={onClose}>
              Close
            </Button>
            <Button onClick={onEdit}>
              <ExternalLink size={16} className="mr-1" />
              Edit
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

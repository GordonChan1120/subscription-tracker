import type { ReactNode } from "react";
import { Card } from "../ui/Card";

interface StatsCardProps {
  icon: ReactNode;
  label: string;
  value: string;
  subtext?: string;
}

export function StatsCard({ icon, label, value, subtext }: StatsCardProps) {
  return (
    <Card className="flex items-center gap-4 p-5">
      <div className="rounded-lg bg-indigo-50 dark:bg-indigo-900/40 p-3 text-indigo-600 dark:text-indigo-300">
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
        <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{value}</p>
        {subtext && <p className="text-xs text-gray-400 dark:text-gray-500">{subtext}</p>}
      </div>
    </Card>
  );
}

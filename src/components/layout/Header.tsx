import { useState, useRef, useEffect } from "react";
import { Bell, Sun, Moon } from "lucide-react";
import { format, parseISO, differenceInDays } from "date-fns";
import { useSubscriptions } from "../../context/SubscriptionContext";
import { useSettings } from "../../context/SettingsContext";

export function Header() {
  const { subscriptions } = useSubscriptions();
  const { settings, updateSettings } = useSettings();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const now = new Date();

  const upcoming = subscriptions
    .filter((s) => s.status === "active")
    .map((s) => ({
      ...s,
      daysLeft: differenceInDays(parseISO(s.nextPaymentDate), now),
    }))
    .filter((s) => s.daysLeft <= settings.reminderDays)
    .sort((a, b) => a.daysLeft - b.daysLeft)
    .slice(0, 5);

  useEffect(() => {
    if (!open) return;
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <header className="flex h-16 items-center justify-end gap-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-6">
      <div ref={ref} className="relative">
        <button
          onClick={() => setOpen((p) => !p)}
          className="relative rounded-lg p-2 text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          <Bell size={20} />
          {upcoming.length > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
              {upcoming.length}
            </span>
          )}
        </button>

        {open && (
          <div className="absolute right-0 top-full z-50 mt-2 w-80 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-lg">
            <div className="border-b border-gray-100 dark:border-gray-800 px-4 py-3">
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                Upcoming Payments
              </p>
            </div>
            {upcoming.length === 0 ? (
              <div className="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                No payments due in the next {settings.reminderDays} days.
              </div>
            ) : (
              <div className="max-h-72 overflow-y-auto">
                {upcoming.map((sub) => (
                  <div
                    key={sub.id}
                    className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800 text-xs font-bold text-gray-600 dark:text-gray-300 uppercase">
                        {sub.service.slice(0, 2)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {sub.name}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500">
                          {format(parseISO(sub.nextPaymentDate), "MMM d, yyyy")}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                        ${sub.price.toFixed(2)}
                      </p>
                      <p
                        className={`text-xs ${
                          sub.daysLeft <= 0 ? "text-red-500" : "text-orange-500"
                        }`}
                      >
                        {sub.daysLeft <= 0
                          ? "Due today"
                          : `${sub.daysLeft} day${sub.daysLeft === 1 ? "" : "s"} left`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      <button
        onClick={() => updateSettings({ darkMode: !settings.darkMode })}
        className="rounded-lg p-2 text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        title={settings.darkMode ? "Switch to light mode" : "Switch to dark mode"}
      >
        {settings.darkMode ? <Sun size={20} /> : <Moon size={20} />}
      </button>
    </header>
  );
}

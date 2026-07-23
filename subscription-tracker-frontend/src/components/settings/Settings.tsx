import { Sun, Moon, Download, Server, Bell, DollarSign } from "lucide-react";
import { Card } from "../ui/Card";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
import { Button } from "../ui/Button";
import { useSettings } from "../../context/SettingsContext";
import { useSubscriptions } from "../../context/SubscriptionContext";
import type { Subscription } from "../../types/subscription";

function exportJson(subscriptions: Subscription[]) {
  const blob = new Blob([JSON.stringify(subscriptions, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "subscriptions.json";
  a.click();
  URL.revokeObjectURL(url);
}

function exportCsv(subscriptions: Subscription[]) {
  const headers = ["Name", "Service", "Price", "Currency", "Billing Cycle", "Category", "Next Payment", "Start Date", "Notes"];
  const rows = subscriptions.map((s) =>
    [
      s.name,
      s.service,
      s.price,
      s.currency,
      s.billingCycle,
      s.category,
      s.nextPaymentDate,
      s.startDate,
      s.notes ?? "",
    ]
      .map((v) => `"${String(v).replace(/"/g, '""')}"`)
      .join(",")
  );
  const csv = [headers.join(","), ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "subscriptions.csv";
  a.click();
  URL.revokeObjectURL(url);
}

export function Settings() {
  const { settings, updateSettings, updateImap } = useSettings();
  const { subscriptions } = useSubscriptions();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Settings</h1>

      <Card className="p-6">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
          <DollarSign size={20} /> Default Currency
        </h2>
        <Select
          value={settings.currency}
          onChange={(e) => updateSettings({ currency: e.target.value })}
          options={[
            { value: "USD", label: "USD ($)" },
            { value: "HKD", label: "HKD (HK$)" },
            { value: "EUR", label: "EUR (€)" },
            { value: "GBP", label: "GBP (£)" },
            { value: "IDR", label: "IDR (Rp)" },
          ]}
        />
      </Card>

      <Card className="p-6">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
          <Bell size={20} /> Notification Preferences
        </h2>
        <Input
          label="Remind me days before payment"
          type="number"
          min={1}
          value={String(settings.reminderDays)}
          onChange={(e) =>
            updateSettings({ reminderDays: Math.max(1, Number(e.target.value)) })
          }
        />
      </Card>

      <Card className="p-6">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
          <Sun size={20} /> Appearance
        </h2>
        <div className="flex items-center gap-3">
          <Button
            variant={settings.darkMode ? "secondary" : "primary"}
            onClick={() => updateSettings({ darkMode: false })}
          >
            <Sun size={16} className="mr-1" /> Light
          </Button>
          <Button
            variant={settings.darkMode ? "primary" : "secondary"}
            onClick={() => updateSettings({ darkMode: true })}
          >
            <Moon size={16} className="mr-1" /> Dark
          </Button>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
          <Server size={20} /> IMAP / Email Configuration
        </h2>
        <div className="space-y-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Configure your IMAP server so the app can scan your inbox for
            subscription receipts.
          </p>
          <Input
            label="IMAP Host"
            value={settings.imap.host}
            onChange={(e) => updateImap({ host: e.target.value })}
            placeholder="imap.gmail.com"
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Port"
              type="number"
              value={String(settings.imap.port)}
              onChange={(e) => updateImap({ port: Number(e.target.value) })}
            />
            <Select
              label="Security"
              value={settings.imap.useSsl ? "ssl" : "tls"}
              onChange={(e) =>
                updateImap({ useSsl: e.target.value === "ssl" })
              }
              options={[
                { value: "ssl", label: "SSL" },
                { value: "tls", label: "TLS/STARTTLS" },
              ]}
            />
          </div>
          <Input
            label="Email"
            type="email"
            value={settings.imap.user}
            onChange={(e) => updateImap({ user: e.target.value })}
          />
          <Input
            label="Password"
            type="password"
            value={settings.imap.password}
            onChange={(e) => updateImap({ password: e.target.value })}
          />
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
          <Download size={20} /> Export Data
        </h2>
        <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
          Export all {subscriptions.length} subscription{subscriptions.length === 1 ? "" : "s"} as JSON or CSV.
        </p>
        <div className="flex gap-3">
          <Button
            variant="secondary"
            onClick={() => exportJson(subscriptions)}
            disabled={subscriptions.length === 0}
          >
            Export JSON
          </Button>
          <Button
            variant="secondary"
            onClick={() => exportCsv(subscriptions)}
            disabled={subscriptions.length === 0}
          >
            Export CSV
          </Button>
        </div>
      </Card>
    </div>
  );
}

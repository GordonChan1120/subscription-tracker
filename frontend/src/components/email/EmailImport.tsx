import { useState } from "react";
import { Mail, Inbox, RefreshCw, Check, X } from "lucide-react";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { EmptyState } from "../ui/EmptyState";
import type { EmailSubscription } from "../../types/subscription";

const detectedEmails: EmailSubscription[] = [
  {
    id: "e1",
    serviceName: "Netflix",
    amount: 15.99,
    currency: "USD",
    date: "2026-07-15",
    sender: "billing@netflix.com",
    subject: "Your Netflix subscription receipt",
  },
  {
    id: "e2",
    serviceName: "Spotify",
    amount: 9.99,
    currency: "USD",
    date: "2026-07-20",
    sender: "no-reply@spotify.com",
    subject: "Your Spotify Premium payment",
  },
];

export function EmailImport() {
  const [connected, setConnected] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [emails, setEmails] = useState<EmailSubscription[]>([]);
  const [imported, setImported] = useState<Set<string>>(new Set());

  async function handleConnect() {
    setConnected(true);
    setScanning(true);
    await new Promise((r) => setTimeout(r, 1500));
    setEmails(detectedEmails);
    setScanning(false);
  }

  function handleImport(id: string) {
    setImported((prev) => new Set(prev).add(id));
  }

  function handleIgnore(id: string) {
    setEmails((prev) => prev.filter((e) => e.id !== id));
  }

  if (!connected) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Email Import</h1>
        <Card className="p-12">
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 rounded-full bg-indigo-50 dark:bg-indigo-900/40 p-4 text-indigo-600 dark:text-indigo-300">
              <Mail size={40} />
            </div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Connect your email
            </h2>
            <p className="mt-2 max-w-md text-sm text-gray-500 dark:text-gray-400">
              We'll scan your inbox for subscription receipts and automatically
              detect your services, prices, and billing dates.
            </p>
            <Button className="mt-6" onClick={handleConnect}>
              Connect with IMAP
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Email Import</h1>
        <Badge variant="success" className="text-sm">
          Connected
        </Badge>
      </div>

      {scanning ? (
        <Card className="p-12">
          <div className="flex flex-col items-center text-center">
            <RefreshCw size={32} className="mb-4 animate-spin text-indigo-600 dark:text-indigo-400" />
            <p className="text-sm text-gray-500 dark:text-gray-400">Scanning your inbox...</p>
          </div>
        </Card>
      ) : emails.length === 0 ? (
        <Card className="p-6">
          <EmptyState
            icon={<Inbox size={40} />}
            title="No subscriptions found"
            description="We didn't find any subscription receipts in your recent emails."
          />
        </Card>
      ) : (
        <>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Found {emails.length} subscription{emails.length > 1 ? "s" : ""} in
            your inbox. Select which ones to import.
          </p>
          <div className="space-y-3">
            {emails.map((email) => {
              const done = imported.has(email.id);
              return (
                <Card key={email.id} className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800 text-sm font-bold text-gray-600 dark:text-gray-300 uppercase">
                      {email.serviceName.slice(0, 2)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {email.serviceName}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">{email.subject}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">{email.sender}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      ${email.amount.toFixed(2)}
                    </span>
                    {done ? (
                      <Badge variant="success">Imported</Badge>
                    ) : (
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleImport(email.id)}
                          className="rounded-lg p-1.5 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
                          title="Import"
                        >
                          <Check size={18} />
                        </button>
                        <button
                          onClick={() => handleIgnore(email.id)}
                          className="rounded-lg p-1.5 text-red-400 dark:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                          title="Ignore"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
          {imported.size > 0 && (
            <p className="text-sm text-green-600 dark:text-green-400">
              {imported.size} subscription{imported.size > 1 ? "s" : ""} imported
              successfully.
            </p>
          )}
        </>
      )}
    </div>
  );
}

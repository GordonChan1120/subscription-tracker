import { useState } from "react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
import {
  CATEGORIES,
  BILLING_CYCLES,
  type BillingCycle,
  type Subscription,
} from "../../types/subscription";

interface SubscriptionFormProps {
  initial?: Subscription;
  onSubmit: (data: Omit<Subscription, "id">) => void;
  onCancel: () => void;
}

export function SubscriptionForm({
  initial,
  onSubmit,
  onCancel,
}: SubscriptionFormProps) {
  const [name, setName] = useState(initial?.name ?? "");
  const [service, setService] = useState(initial?.service ?? "");
  const [price, setPrice] = useState(String(initial?.price ?? ""));
  const [currency, setCurrency] = useState(initial?.currency ?? "HKD");
  const [billingCycle, setBillingCycle] = useState<BillingCycle>(
    initial?.billingCycle ?? "monthly"
  );
  const [startDate, setStartDate] = useState(initial?.startDate ?? "");
  const [nextPaymentDate, setNextPaymentDate] = useState(
    initial?.nextPaymentDate ?? ""
  );
  const [category, setCategory] = useState(initial?.category ?? CATEGORIES[0]);
  const [notes, setNotes] = useState(initial?.notes ?? "");
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate() {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = "Name is required";
    if (!service.trim()) errs.service = "Service is required";
    if (!price || isNaN(Number(price)) || Number(price) <= 0)
      errs.price = "Valid price is required";
    if (!startDate) errs.startDate = "Start date is required";
    if (!nextPaymentDate) errs.nextPaymentDate = "Next payment date is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({
      name: name.trim(),
      service: service.trim(),
      price: Number(price),
      currency,
      billingCycle,
      startDate,
      nextPaymentDate,
      category,
      notes: notes.trim() || undefined,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} error={errors.name} />
        <Input label="Service" value={service} onChange={(e) => setService(e.target.value)} error={errors.service} />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Input
          label="Price"
          type="number"
          step="0.01"
          min="0"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          error={errors.price}
        />
        <Select
          label="Currency"
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          options={[
            { value: "USD", label: "USD ($)" },
            { value: "HKD", label: "HKD (HK$)" },
            { value: "EUR", label: "EUR (€)" },
            { value: "GBP", label: "GBP (£)" },
            { value: "IDR", label: "IDR (Rp)" },
          ]}
        />
        <Select
          label="Billing Cycle"
          value={billingCycle}
          onChange={(e) => setBillingCycle(e.target.value as BillingCycle)}
          options={BILLING_CYCLES.map((bc) => ({ value: bc, label: bc.charAt(0).toUpperCase() + bc.slice(1) }))}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input label="Start Date" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} error={errors.startDate} />
        <Input label="Next Payment Date" type="date" value={nextPaymentDate} onChange={(e) => setNextPaymentDate(e.target.value)} error={errors.nextPaymentDate} />
      </div>

      <Select
        label="Category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        options={CATEGORIES.map((c) => ({ value: c, label: c }))}
      />

      <Input label="Notes" value={notes} onChange={(e) => setNotes(e.target.value)} />

      <div className="flex justify-end gap-3 pt-2">
        <Button variant="secondary" type="button" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {initial ? "Save Changes" : "Add Subscription"}
        </Button>
      </div>
    </form>
  );
}

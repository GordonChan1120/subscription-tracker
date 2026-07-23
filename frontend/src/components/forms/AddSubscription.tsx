import { useNavigate } from "react-router-dom";
import { useSubscriptions } from "../../context/SubscriptionContext";
import { SubscriptionForm } from "./SubscriptionForm";
import { Card } from "../ui/Card";
import type { Subscription } from "../../types/subscription";

export function AddSubscription() {
  const navigate = useNavigate();
  const { addSubscription } = useSubscriptions();

  function handleSubmit(data: Omit<Subscription, "id">) {
    addSubscription(data);
    navigate("/subscriptions");
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Add Subscription</h1>
      <Card className="p-6">
        <SubscriptionForm
          onSubmit={handleSubmit}
          onCancel={() => navigate("/subscriptions")}
        />
      </Card>
    </div>
  );
}

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SubscriptionProvider } from "./context/SubscriptionContext";
import { SettingsProvider } from "./context/SettingsContext";
import { Layout } from "./components/layout/Layout";
import { Dashboard } from "./components/dashboard/Dashboard";
import { SubscriptionsPage } from "./components/subscriptions/SubscriptionsPage";
import { AddSubscription } from "./components/forms/AddSubscription";
import { EmailImport } from "./components/email/EmailImport";
import { Settings } from "./components/settings/Settings";

function App() {
  return (
    <BrowserRouter>
      <SubscriptionProvider>
        <SettingsProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="subscriptions" element={<SubscriptionsPage />} />
            <Route path="subscriptions/new" element={<AddSubscription />} />
            <Route path="email-import" element={<EmailImport />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
        </SettingsProvider>
      </SubscriptionProvider>
    </BrowserRouter>
  );
}

export default App;

import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

export function Layout() {
  return (
    <div className="flex">
      <Sidebar />
      <div className="ml-64 flex min-h-screen flex-1 flex-col">
        <Header />
        <main className="flex-1 bg-gray-50 dark:bg-gray-950 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

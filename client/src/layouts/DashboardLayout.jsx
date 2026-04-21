import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const DashboardLayout = () => (
  <div className="flex min-h-screen bg-gray-100">
    <Sidebar />
    <main className="flex-1 p-6 overflow-y-auto">
      <Outlet />  {/* admin / teacher / student pages render here */}
    </main>
  </div>
);

export default DashboardLayout;
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const PublicLayout = () => (
  <div className="flex flex-col min-h-screen bg-gray-50">
    <Navbar />
    <main className="flex-1">
      <Outlet />  {/* Home / About / Gallery / Login renders here */}
    </main>
    <Footer />
  </div>
);

export default PublicLayout;
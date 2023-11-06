import { Outlet } from "react-router-dom";

import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function BaseLayout() {
  return (
    <div className="flex flex-col min-h-full">
      <Header />
      <main className="flex-auto">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

import { Outlet } from "react-router-dom";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Tools from "@/components/Tools/Tools";
import { useSelector } from "@/hooks/redux";

export default function BaseLayout() {
  const isLogin = useSelector((state) => state.user.isLogin);
  return (
    <>
      <Header />
      <main className="flex-auto mt-[--header-height] flex flex-col">
        <Outlet />
      </main>
      <Footer />
      {isLogin && <Tools />}
    </>
  );
}

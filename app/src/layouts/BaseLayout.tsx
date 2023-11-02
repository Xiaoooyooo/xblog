import { Outlet } from "react-router-dom";

import Header from "@/views/components/Header";
import Footer from "@/views/components/Footer";
import styles from "./BaseLayout.module.scss";

export default function BaseLayout() {
  return (
    <>
      <Header />
      <main className={styles.main}>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

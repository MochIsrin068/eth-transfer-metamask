import { ReactFragment, ReactPortal } from "react";
import Header from "./Header";
import Footer from "./Footer";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ReactNode = ReactFragment | ReactPortal | null | undefined | any;

export default function Layout({ children }: ReactNode) {
  return (
    <main className="w-screen h-screen bg-gradient-to-r from-[#d3c4f6] via-[#cfc5f7] to-[#d5dbfb] flex flex-col justify-between">
      <Header />
      <section className="flex items-center justify-center z-10">
        {children}
      </section>
      <Footer />
    </main>
  );
}

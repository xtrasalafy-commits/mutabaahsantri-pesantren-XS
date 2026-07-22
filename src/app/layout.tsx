import type { Metadata } from "next";
import type { ReactNode } from "react";
import TrakteerDonationWidget from "@/components/trakteer-donation-widget";
import "./globals.css";

export const metadata: Metadata = {
  title: "MutabaahSantri | Sistem Mutabaah Pesantren",
  description: "Catat, pantau, dan laporkan perkembangan hafalan santri dengan rapi.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return <html lang="id"><body>{children}<TrakteerDonationWidget /></body></html>;
}

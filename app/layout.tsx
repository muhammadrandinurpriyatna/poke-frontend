import type { Metadata } from "next";
import "./globals.css";
import { StoreProvider } from "@/components/StoreProvider";
import Navbar from "../components/Navbar";

export const metadata: Metadata = {
  title: "Pokemon",
  description: "List pokemon terlengkap 2024",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <StoreProvider>
      <html lang="en">
        <body>
          <Navbar />
          {children}
        </body>
      </html>
    </StoreProvider>
  );
}

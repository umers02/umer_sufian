import type { Metadata } from "next";
import "../styles/globals.css";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Navigation } from "@/components/navigation";
import { QueryProvider } from "@/providers/QueryProvider";
import { SocketProvider } from "@/providers/SocketProvider";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Auction App",
  description: "Created by Abdullah Jabbar",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="w-full">
        <QueryProvider>
          <SocketProvider>
            <div className="flex flex-col w-full">
              <Header />
              <Navigation />
              <main className="flex-1 w-full">{children}</main>
              <Footer />
              <Toaster position="top-right" richColors />
            </div>
          </SocketProvider>
        </QueryProvider>
      </body>
    </html>
  );
}

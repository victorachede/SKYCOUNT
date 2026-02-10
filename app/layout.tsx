import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/shared/Sidebar";
import { Header } from "@/components/shared/Header";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark"> 
      <body className={`${inter.className} bg-zinc-950 text-zinc-100 antialiased overflow-hidden`}>
        <div className="flex h-screen">
          <Sidebar />
          <main className="flex-1 flex flex-col min-w-0">
            <Header />
            <div className="flex-1 overflow-y-auto p-4 lg:p-8">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
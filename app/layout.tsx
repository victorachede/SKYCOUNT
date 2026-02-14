import "./globals.css";

export const metadata = {
  title: "SkyCount AI",
  description: "Real-time human movement tracking",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
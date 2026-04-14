import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '700'], // Añade los pesos que necesites
  variable: '--font-montserrat', // Opcional: para usar con CSS variables
});

export const metadata: Metadata = {
  title: "Prueba Login",
  description: "Prueba de login",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${montserrat.className} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

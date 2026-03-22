import type { Metadata } from "next";
import "./globals.css";
import TopMenu from "@/components/TopMenu";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/authOptions";
import NextAuthProvider from "@/providers/NextAuthProvider";
import ReduxProvider from "@/redux/ReduxProvider";

export const metadata: Metadata = {
  title: "Car Rental Service",
  description: "Find your perfect car for rent — from economy to luxury vehicles, we have the perfect ride for your needs.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="ja">
      <body suppressHydrationWarning>
        <NextAuthProvider session={session}>
          <ReduxProvider>
            <TopMenu />
            {children}
          </ReduxProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}

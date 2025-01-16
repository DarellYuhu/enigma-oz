import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import * as Tooltip from "@radix-ui/react-tooltip";
import ThemeProvider from "@/providers/themeprovider";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_APP_NAME,
  description: process.env.NEXT_PUBLIC_APP_DESCRIPTION,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://api.tiles.mapbox.com/mapbox-gl-js/v1.13.3/mapbox-gl.css"
          rel="stylesheet"
        />
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <Tooltip.Provider delayDuration={200}>{children}</Tooltip.Provider>
        </ThemeProvider>
      </body>
    </html>
  );
}

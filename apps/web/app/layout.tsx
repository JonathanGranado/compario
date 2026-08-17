import type { Metadata, Viewport } from "next";
import "./styles.css";
import { ThemeMenu } from "./theme-menu";

export const metadata: Metadata = {
  title: "Compario | Optometry school comparison",
  description: "Compare cited costs and outcomes across U.S. optometry programs.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f6f4ed",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <ThemeMenu />
        {children}
      </body>
    </html>
  );
}

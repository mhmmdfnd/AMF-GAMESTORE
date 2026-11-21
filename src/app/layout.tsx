import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "AMF GAMESTORE — Digital Gaming Marketplace",
  description: "Top up game dan produk digital dengan mudah, aman, dan cepat."
};
export default function RootLayout({children}:{children:React.ReactNode}) {
  return <html lang="id"><body>{children}</body></html>;
}

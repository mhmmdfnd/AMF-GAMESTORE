import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
export const metadata: Metadata={title:"AMF GAMESTORE | Premium Game Account Marketplace",description:"Marketplace akun PUBG Mobile, Mobile Legends, Free Fire dan eFootball."};
export default function RootLayout({children}:{children:React.ReactNode}) {
 return <html lang="id"><body><header className="top"><Link href="/" className="logo"><b>AMF</b><span>GAME<em>STORE</em><small>LEVEL UP YOUR GAME</small></span></Link><nav><Link href="/catalog">Katalog</Link><Link href="/orders">Pesanan Saya</Link><Link href="/admin">Admin</Link><Link href="/login" className="navbtn">Masuk</Link></nav></header>{children}<footer>© 2026 AMF GAMESTORE · PLAY SMART. STAY SAFE.</footer></body></html>
}
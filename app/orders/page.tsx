import {createClient} from "@/lib/supabase/server";
import Link from "next/link";
import {redirect} from "next/navigation";
import PaymentProofForm from "@/components/PaymentProofForm";
const money=(n:number)=>new Intl.NumberFormat("id-ID",{style:"currency",currency:"IDR",maximumFractionDigits:0}).format(n);
export default async function Orders(){
 const db=await createClient();const {data:{user}}=await db.auth.getUser();if(!user)redirect("/login");
 const {data:orders}=await db.from("orders").select("id,order_code,product_title,game,total,status,created_at,payment_method,payment_reference,admin_note").eq("user_id",user.id).order("created_at",{ascending:false});
 return <main className="wrap page"><small className="eyebrow">CUSTOMER AREA</small><h1>My <em>Orders.</em></h1>{(orders||[]).map(o=><article className="panel order-card" key={o.id}><div className="order-head"><div><small>{o.order_code}</small><h3>{o.product_title}</h3><p>{o.game} · {new Date(o.created_at).toLocaleString("id-ID")}</p></div><span className="status">{o.status.replaceAll("_"," ")}</span></div><strong>{money(o.total)}</strong>{o.status==="awaiting_payment"&&<PaymentProofForm orderId={o.id}/ >}{o.status==="payment_rejected"&&<p className="notice">Bukti pembayaran perlu diperbaiki. Silakan unggah kembali bukti yang valid.</p>}{o.status==="paid"&&<p className="notice">Pembayaran terverifikasi. Pesanan sedang diproses admin.</p>}{o.status==="delivered"&&<p className="notice">Pesanan ditandai telah diserahkan admin. Hubungi admin jika membutuhkan bantuan.</p>}{o.admin_note&&<p className="muted">Catatan admin: {o.admin_note}</p>}</article>)}{(!orders||orders.length===0)&&<div className="notice">Belum ada pesanan. <Link href="/catalog">Jelajahi katalog</Link>.</div>}</main>
}
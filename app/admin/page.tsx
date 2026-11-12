import {requireAdmin} from "@/lib/auth";
import {createClient} from "@/lib/supabase/server";
import Link from "next/link";
import {redirect} from "next/navigation";
export default async function AdminHome(){
 const auth=await requireAdmin();if(!auth.ok)redirect("/login");
 const db=await createClient();const {data:orders}=await db.from("orders").select("id,status,total,order_code,product_title,created_at").order("created_at",{ascending:false}).limit(10);
 const counts=(orders||[]).reduce((a,o)=>{a[o.status]=(a[o.status]||0)+1;return a;},{} as Record<string,number>);
 return <main className="wrap page"><small className="eyebrow">CONTROL CENTER / {auth.role?.toUpperCase()}</small><h1>Admin <em>Dashboard.</em></h1><div className="admin-links"><Link className="button" href="/admin/products">Kelola Produk</Link><Link className="button secondary" href="/admin/orders">Kelola Pesanan</Link></div><div className="stats">{["awaiting_payment","paid","processing","delivered"].map(s=><div className="panel stat" key={s}><small>{s.replaceAll("_"," ")}</small><b>{counts[s]||0}</b></div>)}</div><h2>Pesanan terbaru</h2><div className="table-wrap"><table><thead><tr><th>Kode</th><th>Produk</th><th>Status</th><th>Total</th></tr></thead><tbody>{(orders||[]).map(o=><tr key={o.id}><td>{o.order_code}</td><td>{o.product_title}</td><td>{o.status}</td><td>{o.total.toLocaleString("id-ID")}</td></tr>)}</tbody></table></div></main>
}
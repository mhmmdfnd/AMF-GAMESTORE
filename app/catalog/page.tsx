import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
export default async function Catalog(){
 const db=await createClient();
 const {data}=await db.from("products").select("id,title,game,price,image_url,short_description,stock").eq("is_active",true).gt("stock",0).order("created_at",{ascending:false});
 return <main className="wrap page"><small className="eyebrow">AMF COLLECTION</small><h1>Explore the <em>Drop.</em></h1><p className="muted">Pilih game dan periksa informasi produk sebelum membuat pesanan.</p><div className="grid">{(data||[]).map(p=><article className="product" key={p.id}>{p.image_url?<img src={p.image_url} alt=""/>:<div className="placeholder">AMF / {p.game}</div>}<div className="pad"><small>{p.game} · Stok {p.stock}</small><h3>{p.title}</h3><p>{p.short_description}</p><b>{new Intl.NumberFormat("id-ID",{style:"currency",currency:"IDR",maximumFractionDigits:0}).format(p.price)}</b><Link className="button full" href={`/checkout?product=${p.id}`}>Pesan akun</Link></div></article>)}</div>{(!data||data.length===0)&&<div className="notice">Belum ada produk aktif. Admin dapat menambahkan produk melalui dashboard.</div>}</main>
}
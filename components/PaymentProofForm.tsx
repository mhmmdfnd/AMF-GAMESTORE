"use client";
import {useState} from "react";
export default function PaymentProofForm({orderId}:{orderId:string}){
 const [file,setFile]=useState<File|null>(null);const [ref,setRef]=useState("");const [msg,setMsg]=useState("");const [busy,setBusy]=useState(false);
 async function send(e:React.FormEvent){e.preventDefault();if(!file)return;setBusy(true);setMsg("");const fd=new FormData();fd.append("orderId",orderId);fd.append("proof",file);fd.append("paymentReference",ref);const r=await fetch("/api/payment-proof",{method:"POST",body:fd});const j=await r.json();setBusy(false);setMsg(r.ok?"Bukti berhasil dikirim. Tunggu verifikasi admin.":j.error||"Gagal mengunggah.");if(r.ok)window.location.reload();}
 return <form className="proof-form" onSubmit={send}><b>Unggah bukti transfer</b><input type="file" accept="image/jpeg,image/png,image/webp,application/pdf" required onChange={e=>setFile(e.target.files?.[0]||null)}/><input placeholder="Nomor referensi transfer (opsional)" maxLength={100} value={ref} onChange={e=>setRef(e.target.value)}/><button className="button" disabled={busy||!file}>{busy?"Mengunggah...":"Kirim bukti pembayaran"}</button>{msg&&<small>{msg}</small>}</form>
}
"use client";
import {useState} from "react";
const actions:Record<string,string[]>={awaiting_payment:["paid","payment_rejected","cancelled"],paid:["processing","cancelled"],processing:["delivered","cancelled"],payment_rejected:["awaiting_payment","cancelled"]};
export default function AdminOrderActions({orderId,status,note}:{orderId:string;status:string;note:string}){
 const [next,setNext]=useState(actions[status]?.[0]||status);const [text,setText]=useState(note);const [msg,setMsg]=useState("");const [busy,setBusy]=useState(false);
 async function save(){setBusy(true);setMsg("");const r=await fetch(`/api/admin/orders/${orderId}`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({status:next,adminNote:text})});const j=await r.json();setBusy(false);setMsg(r.ok?"Perubahan tersimpan.":j.error||"Gagal menyimpan.");if(r.ok)window.location.reload();}
 return <div className="admin-actions"><label>Status berikutnya<select value={next} onChange={e=>setNext(e.target.value)}>{(actions[status]||[status]).map(s=><option key={s} value={s}>{s}</option>)}</select></label><label>Catatan admin<textarea value={text} maxLength={500} onChange={e=>setText(e.target.value)}/></label><button className="button" disabled={busy} onClick={save}>{busy?"Menyimpan...":"Simpan status"}</button>{msg&&<small>{msg}</small>}</div>
}
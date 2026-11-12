"use client";
import {useState} from "react";
import {createClient} from "@/lib/supabase/client";
export default function LoginForm(){
 const [email,setEmail]=useState("");const [password,setPassword]=useState("");const [msg,setMsg]=useState("");const [busy,setBusy]=useState(false);
 async function submit(e:React.FormEvent){e.preventDefault();setBusy(true);setMsg("");const db=createClient();const {error}=await db.auth.signInWithPassword({email,password});setBusy(false);if(error){setMsg(error.message);return;}window.location.href="/";}
 return <form className="panel form" onSubmit={submit}><label>Email<input type="email" required autoComplete="email" value={email} onChange={e=>setEmail(e.target.value)}/></label><label>Password<input type="password" required autoComplete="current-password" value={password} onChange={e=>setPassword(e.target.value)}/></label><button className="button" disabled={busy}>{busy?"Memproses...":"Masuk"}</button>{msg&&<p className="error">{msg}</p>}<p className="muted tiny">Akun pelanggan dibuat melalui proses registrasi yang disediakan admin. Tidak ada pendaftaran admin publik.</p></form>
}
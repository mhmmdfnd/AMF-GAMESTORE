 "use client";
import { useMemo, useState } from "react";
import { ArrowRight, Search, ShieldCheck, Zap, Headphones, Menu, X, Gamepad2, ChevronRight, Sparkles, ShoppingBag } from "lucide-react";
import { demoProducts, rupiah, type Product } from "@/lib/products";

export default function Home() {
  const [query,setQuery]=useState("");
  const [category,setCategory]=useState("Semua");
  const [mobileOpen,setMobileOpen]=useState(false);
  const categories=["Semua","Mobile Legends","Free Fire","PUBG Mobile","eFootball"];
  const products=useMemo(()=>demoProducts.filter(p=>(category==="Semua"||p.category===category)&&p.name.toLowerCase().includes(query.toLowerCase())),[query,category]);
  const wa=process.env.NEXT_PUBLIC_WHATSAPP || "6281234567890";
  const order=(p:Product)=>window.open(`https://wa.me/${wa}?text=${encodeURIComponent(`Halo AMF GAMESTORE, saya ingin order ${p.name}.`)}`,"_blank");
  return <main className="min-h-screen overflow-hidden">
    <div className="fixed inset-0 pointer-events-none grid-bg opacity-50"/>
    <header className="relative z-20 border-b border-white/5 bg-[#071426]/85 backdrop-blur-xl">
      <div className="container h-[78px] flex items-center justify-between">
        <a href="#" className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl btn-primary flex items-center justify-center"><Gamepad2 size={22}/></div>
          <div><div className="font-bold tracking-[.12em] text-white">AMF<span className="text-blue-400">.</span></div><div className="text-[9px] tracking-[.28em] text-slate-400">GAMESTORE</div></div>
        </a>
        <nav className="hidden md:flex items-center gap-8 text-sm text-slate-300">
          <a href="#home" className="hover:text-blue-300">Beranda</a><a href="#products" className="hover:text-blue-300">Produk</a><a href="#advantages" className="hover:text-blue-300">Keunggulan</a><a href="#contact" className="hover:text-blue-300">Kontak</a>
        </nav>
        <a href="#products" className="hidden md:flex btn-primary rounded-xl px-5 py-3 text-sm font-bold">Mulai Belanja <ArrowRight size={16} className="ml-2"/></a>
        <button className="md:hidden p-2" onClick={()=>setMobileOpen(!mobileOpen)} aria-label="Menu">{mobileOpen?<X/>:<Menu/>}</button>
      </div>
      {mobileOpen&&<div className="md:hidden px-5 pb-5 flex flex-col gap-4 text-slate-300"><a href="#home">Beranda</a><a href="#products">Produk</a><a href="#advantages">Keunggulan</a><a href="#contact">Kontak</a></div>}
    </header>

    <section id="home" className="relative">
      <div className="absolute -top-24 right-[-8%] h-[520px] w-[520px] rounded-full bg-blue-600/15 blur-[120px]"/>
      <div className="container relative grid lg:grid-cols-[1.1fr_.9fr] gap-12 items-center py-20 md:py-28">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-400/10 px-4 py-2 text-xs text-blue-200"><Sparkles size={14}/> DIGITAL GAMING MARKETPLACE</div>
          <h1 className="mt-7 max-w-2xl font-['Space_Grotesk'] text-5xl md:text-7xl font-bold leading-[1.06] tracking-tight">Upgrade Your <span className="blue-text">Game.</span><br/>Unlock Your Potential.</h1>
          <p className="mt-6 max-w-xl text-base md:text-lg leading-8 text-slate-400">Semua kebutuhan game favoritmu dalam satu tempat. Nikmati pengalaman belanja produk digital yang praktis, cepat, dan nyaman.</p>
          <div className="mt-9 flex flex-wrap gap-3"><a href="#products" className="btn-primary rounded-xl px-6 py-4 font-bold flex items-center">Jelajahi Produk <ArrowRight size={17} className="ml-3"/></a><a href="#advantages" className="glass rounded-xl px-6 py-4 font-semibold text-slate-200 hover:bg-white/10">Kenali Kami</a></div>
          <div className="mt-12 flex flex-wrap gap-8 text-sm text-slate-400"><span className="flex items-center gap-2"><ShieldCheck className="text-blue-400" size={18}/> Transaksi nyaman</span><span className="flex items-center gap-2"><Zap className="text-blue-400" size={18}/> Proses praktis</span></div>
        </div>
        <div className="relative mx-auto w-full max-w-[480px]">
          <div className="absolute inset-8 rounded-full bg-blue-500/20 blur-[80px]"/>
          <div className="glass relative rounded-[30px] p-5 shadow-glow rotate-1">
            <div className="flex items-center justify-between border-b border-white/10 pb-4"><div className="text-xs tracking-widest text-slate-400">FEATURED COLLECTION</div><span className="h-2 w-2 rounded-full bg-emerald-400"/></div>
            <div className="my-6 rounded-2xl border border-blue-300/10 bg-gradient-to-br from-[#163c70] via-[#102c51] to-[#0a1b31] p-8 text-center">
              <div className="text-7xl">🎮</div><div className="mt-5 text-2xl font-bold">LEVEL UP</div><div className="mt-2 text-sm text-blue-200">Your next victory starts here.</div>
              <div className="mt-7 flex justify-center gap-2"><span className="rounded-full bg-blue-400/15 px-3 py-1 text-xs text-blue-200">TOP UP</span><span className="rounded-full bg-blue-400/15 px-3 py-1 text-xs text-blue-200">GAMES</span></div>
            </div>
            <div className="flex items-center justify-between"><div><div className="text-sm font-bold">Gaming essentials</div><div className="mt-1 text-xs text-slate-400">Explore your favorite games</div></div><div className="h-10 w-10 rounded-full bg-blue-500/15 flex items-center justify-center text-blue-300"><ArrowRight/></div></div>
          </div>
          <div className="glass absolute -left-5 bottom-10 rounded-2xl px-4 py-3 shadow-glow"><div className="text-xs text-slate-400">STORE STATUS</div><div className="mt-1 flex items-center gap-2 text-sm font-bold"><span className="h-2 w-2 rounded-full bg-emerald-400"/> Ready to serve</div></div>
        </div>
      </div>
    </section>

    <section id="products" className="relative py-20 border-t border-white/5">
      <div className="container">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div><div className="text-xs font-bold tracking-[.25em] text-blue-400">OUR CATALOG</div><h2 className="mt-3 font-['Space_Grotesk'] text-3xl md:text-4xl font-bold">Temukan kebutuhan <span className="blue-text">gaming-mu.</span></h2><p className="mt-3 text-slate-400">Pilih produk favorit dan mulai transaksi.</p></div>
          <div className="relative w-full md:w-72"><Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Cari produk..." className="w-full rounded-xl border border-white/10 bg-[#0d1d33] py-3 pl-11 pr-4 text-sm outline-none focus:border-blue-400/60"/></div>
        </div>
        <div className="mt-9 flex flex-wrap gap-2">{categories.map(c=><button key={c} onClick={()=>setCategory(c)} className={`rounded-full px-4 py-2 text-sm ${category===c?"bg-blue-500 text-white":"glass text-slate-400 hover:text-white"}`}>{c}</button>)}</div>
        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {products.map(p=><article key={p.id} className="card group rounded-2xl p-5 transition-all">
            <div className="relative flex h-40 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-[#173d70] to-[#0a1b31]"><div className="absolute h-32 w-32 rounded-full bg-blue-400/20 blur-3xl"/><span className="relative text-6xl">{p.image}</span>{p.badge&&<span className="absolute left-3 top-3 rounded-full bg-blue-500/20 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-blue-200">{p.badge}</span>}</div>
            <div className="mt-5 flex items-start justify-between gap-3"><div><div className="text-xs text-blue-300">{p.category}</div><h3 className="mt-1 font-bold">{p.name}</h3></div><ShoppingBag className="text-slate-500 group-hover:text-blue-300" size={19}/></div>
            <p className="mt-3 min-h-10 text-sm leading-5 text-slate-400">{p.description}</p>
            <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4"><div><div className="text-[10px] text-slate-500">MULAI DARI</div><div className="mt-1 font-bold text-white">{rupiah(p.price)}</div></div><button onClick={()=>order(p)} className="btn-primary rounded-lg px-4 py-2.5 text-xs font-bold">Pesan <ChevronRight className="inline" size={15}/></button></div>
          </article>)}
        </div>
        {products.length===0&&<div className="py-16 text-center text-slate-400">Produk tidak ditemukan. Coba kata kunci lain.</div>}
        <p className="mt-6 text-xs text-slate-500">* Produk di atas adalah data contoh. Ganti dengan katalog dan harga resmi sebelum website dipublikasikan.</p>
      </div>
    </section>

    <section id="advantages" className="border-y border-white/5 bg-[#0a192c]/70 py-20">
      <div className="container"><div className="text-center"><div className="text-xs font-bold tracking-[.25em] text-blue-400">WHY AMF</div><h2 className="mt-3 font-['Space_Grotesk'] text-3xl font-bold">Belanja digital lebih <span className="blue-text">nyaman.</span></h2></div>
        <div className="mt-12 grid md:grid-cols-3 gap-5">
          {[{icon:ShieldCheck,title:"Transaksi Terarah",desc:"Informasi pesanan disajikan dengan jelas untuk membantu proses pembelian."},{icon:Zap,title:"Proses Praktis",desc:"Alur pemesanan dibuat sederhana agar mudah digunakan."},{icon:Headphones,title:"Dukungan Pelanggan",desc:"Hubungi tim AMF untuk bantuan dan informasi pesanan."}].map(x=><div key={x.title} className="glass rounded-2xl p-7"><div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/15 text-blue-300"><x.icon size={24}/></div><h3 className="mt-5 text-lg font-bold">{x.title}</h3><p className="mt-2 text-sm leading-6 text-slate-400">{x.desc}</p></div>)}
        </div>
      </div>
    </section>
    <footer id="contact" className="py-12"><div className="container flex flex-col md:flex-row items-center justify-between gap-6"><div><div className="font-bold tracking-[.14em]">AMF<span className="text-blue-400">.</span> GAMESTORE</div><p className="mt-2 text-xs text-slate-500">Your Digital Gaming Marketplace.</p></div><div className="text-xs text-slate-500">© {new Date().getFullYear()} AMF GAMESTORE. All rights reserved.</div><a href={`https://wa.me/${wa}`} target="_blank" className="text-sm text-blue-300 hover:text-white">Hubungi kami <ArrowRight className="inline" size={14}/></a></div></footer>
  </main>;
}

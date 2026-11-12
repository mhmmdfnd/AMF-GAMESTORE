import {NextResponse} from "next/server";import {z} from "zod";import {requireAdmin} from "@/lib/auth";import {createAdminClient} from "@/lib/supabase/admin";
const schema=z.object({status:z.enum(["paid","payment_rejected","processing","delivered","cancelled","awaiting_payment"]),adminNote:z.string().max(500).optional()});
const transitions:Record<string,string[]>={awaiting_payment:["paid","payment_rejected","cancelled"],payment_rejected:["awaiting_payment","cancelled"],paid:["processing","cancelled"],processing:["delivered","cancelled"],delivered:[],cancelled:[]};
export async function PATCH(req:Request,{params}:{params:Promise<{id:string}>}){
 const auth=await requireAdmin(["owner","admin"]);if(!auth.ok)return NextResponse.json({error:"Tidak memiliki izin."},{status:auth.status});
 const body=schema.safeParse(await req.json());if(!body.success)return NextResponse.json({error:"Input tidak valid."},{status:400});
 const {id}=await params;const db=createAdminClient();const {data:order,error:find}=await db.from("orders").select("id,status").eq("id",id).single();
 if(find||!order)return NextResponse.json({error:"Pesanan tidak ditemukan."},{status:404});
 if(!transitions[order.status]?.includes(body.data.status))return NextResponse.json({error:"Perubahan status tidak diizinkan."},{status:409});
 if(body.data.status==="paid"){
  const {count}=await db.from("payment_proofs").select("*",{count:"exact",head:true}).eq("order_id",id);
  if(!count)return NextResponse.json({error:"Verifikasi ditolak: belum ada bukti transfer."},{status:409});
 }
 const {error}=await db.from("orders").update({status:body.data.status,admin_note:body.data.adminNote||null,updated_at:new Date().toISOString()}).eq("id",id);
 if(error)return NextResponse.json({error:"Gagal memperbarui pesanan."},{status:500});
 await db.from("order_events").insert({order_id:id,actor_id:auth.user!.id,from_status:order.status,to_status:body.data.status,note:body.data.adminNote||null});
 return NextResponse.json({ok:true});
}
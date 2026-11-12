import {NextResponse} from "next/server";
import {createClient} from "@/lib/supabase/server";
const allowed=["image/jpeg","image/png","image/webp","application/pdf"];
export async function POST(req:Request){
 try{
  const db=await createClient();const {data:{user}}=await db.auth.getUser();if(!user)return NextResponse.json({error:"Login diperlukan."},{status:401});
  const fd=await req.formData();const id=String(fd.get("orderId")||"");const file=fd.get("proof");const reference=String(fd.get("paymentReference")||"").slice(0,100);
  if(!(file instanceof File)||!allowed.includes(file.type)||file.size>5*1024*1024)return NextResponse.json({error:"File harus JPG, PNG, WEBP atau PDF maksimal 5 MB."},{status:400});
  const {data:order}=await db.from("orders").select("id,status").eq("id",id).eq("user_id",user.id).single();
  if(!order||!["awaiting_payment","payment_rejected"].includes(order.status))return NextResponse.json({error:"Pesanan tidak ditemukan atau tidak menerima bukti baru."},{status:404});
  const ext=file.type==="application/pdf"?"pdf":file.type.split("/")[1].replace("jpeg","jpg");const path=`${user.id}/${id}/${crypto.randomUUID()}.${ext}`;
  const {error:up}=await db.storage.from("payment-proofs").upload(path,file,{contentType:file.type,upsert:false});if(up)throw up;
  const {error}=await db.from("payment_proofs").insert({order_id:id,user_id:user.id,storage_path:path,payment_reference:reference||null});
  if(error){await db.storage.from("payment-proofs").remove([path]);throw error;}
  return NextResponse.json({ok:true},{status:201});
 }catch(e){console.error("proof upload failed",e);return NextResponse.json({error:"Unggah bukti gagal. Coba kembali."},{status:500});}
}
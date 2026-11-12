import {NextResponse} from "next/server";
import {z} from "zod";
import {createClient} from "@/lib/supabase/server";
const schema=z.object({productId:z.number().int().positive(),customerName:z.string().trim().min(2).max(80),customerPhone:z.string().trim().min(8).max(20).regex(/^[+0-9 ()-]+$/),notes:z.string().max(500).optional()});
export async function POST(req:Request){
 try{
  const parsed=schema.safeParse(await req.json());if(!parsed.success)return NextResponse.json({error:"Data pesanan tidak valid."},{status:400});
  const db=await createClient();const {data:{user}}=await db.auth.getUser();if(!user)return NextResponse.json({error:"Silakan masuk terlebih dahulu."},{status:401});
  const {data:p,error:pe}=await db.from("products").select("id,title,game,price,stock,is_active").eq("id",parsed.data.productId).single();
  if(pe||!p||!p.is_active||p.stock<1)return NextResponse.json({error:"Produk tidak tersedia."},{status:409});
  const code="AMF-"+Date.now().toString(36).toUpperCase()+"-"+crypto.randomUUID().slice(0,5).toUpperCase();
  const {data:order,error}=await db.from("orders").insert({order_code:code,user_id:user.id,product_id:p.id,product_title:p.title,game:p.game,unit_price:p.price,total:p.price,customer_name:parsed.data.customerName,customer_phone:parsed.data.customerPhone,customer_notes:parsed.data.notes||null,status:"awaiting_payment"}).select("id,order_code,status,total").single();
  if(error)throw error;
  return NextResponse.json({order},{status:201});
 }catch(e){console.error("create order failed",e);return NextResponse.json({error:"Tidak dapat membuat pesanan saat ini."},{status:500});}
}
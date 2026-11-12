import {createClient} from "@/lib/supabase/server";
import CheckoutForm from "@/components/CheckoutForm";
export default async function Checkout({searchParams}:{searchParams:Promise<{product?:string}>}){
 const {product}=await searchParams;const db=await createClient();
 const {data}=product?await db.from("products").select("id,title,game,price").eq("id",product).eq("is_active",true).single():{data:null};
 return <main className="narrow page"><small className="eyebrow">ORDER REQUEST</small><h1>Create an <em>Order.</em></h1>{data?<CheckoutForm product={data}/>:<p className="notice">Produk tidak ditemukan atau sudah tidak aktif. Kembali ke katalog.</p>}</main>
}
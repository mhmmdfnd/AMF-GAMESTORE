import { createClient } from "@/lib/supabase/server";
export type AdminRole = "owner" | "admin" | "staff";
export async function getUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}
export async function requireAdmin(allowed: AdminRole[] = ["owner","admin","staff"]) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok:false as const, status:401, user:null, role:null };
  const { data } = await supabase.from("profiles").select("role,is_active").eq("id",user.id).maybeSingle();
  if (!data || !data.is_active || !allowed.includes(data.role as AdminRole)) {
    return { ok:false as const, status:403, user, role:null };
  }
  return { ok:true as const, status:200, user, role:data.role as AdminRole };
}
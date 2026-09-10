/**
 * Config do Supabase Auth. A anon key é pública por design (protegida por RLS),
 * por isso vai com prefixo NEXT_PUBLIC_. A service_role key NUNCA vem para cá.
 */
export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return Boolean(url && key && !key.startsWith("COLE_"));
}

export function getSupabaseEnv(): { url: string; anonKey: string } {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey || anonKey.startsWith("COLE_")) {
    throw new Error(
      "Supabase Auth não configurado. Preencha NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY no .env.",
    );
  }
  return { url, anonKey };
}

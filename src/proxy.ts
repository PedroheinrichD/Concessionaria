import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { isSupabaseConfigured, getSupabaseEnv } from "@/lib/supabase/config";

/**
 * Proxy (Next 16, ex-"middleware"). Protege /admin/*; fora de /admin não faz
 * nada (matcher abaixo). Também renova a sessão do Supabase a cada request.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isLogin = pathname === "/admin/login";

  if (!isSupabaseConfigured()) {
    // Sem Supabase Auth configurado: deixa só a tela de login (que avisa),
    // qualquer outra rota /admin volta para lá.
    return isLogin
      ? NextResponse.next()
      : NextResponse.redirect(new URL("/admin/login", request.url));
  }

  const response = NextResponse.next({ request });
  const { url, anonKey } = getSupabaseEnv();

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (toSet) => {
        toSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user && !isLogin) {
    const redirect = new URL("/admin/login", request.url);
    redirect.searchParams.set("next", pathname);
    return NextResponse.redirect(redirect);
  }
  if (user && isLogin) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};

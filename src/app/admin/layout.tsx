import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { getCurrentUser } from "@/lib/auth";
import { signOut } from "@/app/actions/auth";

export const metadata: Metadata = {
  title: { default: "Painel", template: "Admin · %s" },
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const nav = [
  { href: "/admin", label: "Visão geral" },
  { href: "/admin/veiculos", label: "Veículos" },
  { href: "/admin/leads", label: "Leads" },
  { href: "/admin/config", label: "Dados da loja" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  // Sem sessão: só renderiza o conteúdo (a página de login). O middleware já
  // barra as outras rotas /admin.
  if (!user) return <>{children}</>;

  return (
    <div className="min-h-[100svh]">
      <header className="border-b border-border bg-bg-elev">
        <Container width="wide">
          <div className="flex h-16 items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <span className="font-display text-sm font-semibold text-fg">
                Benevento&rsquo;s · Painel
              </span>
              <nav className="hidden items-center gap-4 sm:flex">
                {nav.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-[0.85rem] text-fg-dim hover:text-fg"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <span className="hidden text-[0.8rem] text-muted md:inline">
                {user.email}
              </span>
              <form action={signOut}>
                <button
                  type="submit"
                  className="rounded border border-border-strong px-3 py-1.5 text-[0.8rem] text-fg-dim hover:border-fg hover:text-fg"
                >
                  Sair
                </button>
              </form>
            </div>
          </div>
        </Container>
      </header>
      <main className="py-10">
        <Container width="wide">{children}</Container>
      </main>
    </div>
  );
}

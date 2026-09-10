@AGENTS.md

# Benevento's Veículos - site institucional + catálogo

## O que é

Site de uma concessionária de seminovos (compra, venda, troca e financiamento).
Cliente real: Benevento's Veículos (Instagram @beneventoveiculos, +700 carros
vendidos em 3 anos). Visual cinematográfico escuro, alto contraste, um único
acento vermelho puxado da fachada da loja. Referência de tom: marca automotiva,
não marketplace.

Hoje roda 100% com dados mockados e imagens em placeholder. Está estruturado
para receber backend/CMS depois trocando só `src/lib/vehicles.ts` e o
componente `Placeholder` por `next/image`.

## Stack

- **Next.js 16** (App Router, Turbopack por padrão em dev e build) + TypeScript
- **React 19.2**
- **Tailwind CSS v4** via `@tailwindcss/postcss`, com tokens em `@theme` dentro
  de `src/app/globals.css`. Sem CSS Modules, sem CSS-in-JS.
- **GSAP + ScrollTrigger** para o scroll cinematográfico
- **Lenis** para scroll suave (roda no ticker do GSAP para ficar em fase com o
  ScrollTrigger)
- **@phosphor-icons/react** (import de `/dist/ssr`), uma família só de ícones
- **next/font/google**: Archivo (display) + Inter (corpo/UI)

### Notas de Next 16 (mudou em relação ao que você provavelmente conhece)

- `params` e `searchParams` são **Promises**: `const { id } = await params`.
  Tipar com `PageProps<'/rota'>` / `LayoutProps<'/rota'>` (globais, gerados por
  `next dev` / `next build` / `next typegen`).
- Turbopack é padrão. `next lint` não existe mais: lint é `eslint` direto
  (`package.json` já tem `"lint": "eslint"`), flat config em `eslint.config.mjs`.
- `next.config.ts` fixa `turbopack.root` porque há um `package-lock.json` solto
  na pasta do usuário que confundia a detecção de workspace.
- Imagens locais/remotas: `images.qualities` default é `[75]`; `images.domains`
  saiu, usar `remotePatterns`.

## Comandos

```
npm install
npm run dev          # http://localhost:3000
npm run build
npx tsc --noEmit     # checagem de tipos
npx eslint src       # lint
npx next typegen     # regenera PageProps/LayoutProps se preciso
npm run db:test      # testa a conexão com o Postgres do Supabase
npm run db:verify    # confere tabelas / enums / FKs / índices no banco
npm run db:seed      # (re)popula veículos, fotos, depoimentos, config (idempotente)
npm run db:studio    # abre o Prisma Studio
npm run admin:create # cria o usuário admin no Supabase Auth a partir do .env
npx prisma migrate dev --name <x>   # nova migration (Session pooler)
npx prisma generate  # regenera o Prisma Client (roda no postinstall também)
```

Rodar `tsc --noEmit` + `eslint src` + `next build` antes de considerar
qualquer etapa concluída.

## Estrutura

```
src/
  proxy.ts               protege /admin/* (Next 16, ex-middleware.ts)
  app/
    layout.tsx           só <html><body> + fonts + metadata
    globals.css          @import tailwindcss + tokens (@theme) + base + motion CSS
    icon.svg             favicon (monograma B)
    not-found.tsx        404 global (sem chrome)
    sitemap.ts           rotas + slugs de veiculos do banco
    (site)/              route group do site público
      layout.tsx         SmoothScroll + SiteHeader + SiteFooter
      page.tsx           Home
      not-found.tsx      404 com chrome (usado pelo notFound() das rotas de site)
      estoque/page.tsx           catálogo (EstoqueBrowser), força dynamic
      estoque/[id]/page.tsx      página do veículo por slug + generateMetadata
      sobre/page.tsx  contato/page.tsx
    admin/              painel (fora do (site), shell próprio)
      layout.tsx  login/  page.tsx (stats)  leads/  veiculos/
    actions/
      leads.ts           "use server" - submitContact/Trade/InterestLead
      auth.ts            "use server" - signIn / signOut (Supabase Auth)

  components/
    motion/    SmoothScroll, Reveal, SplitLines, Parallax, Magnetic
    layout/    SiteHeader (client), SiteFooter (server)
    ui/        Container, Button (ButtonLink + Button), WhatsappCta,
               SectionIntro, Placeholder
    home/      Hero, ProofBar, FeaturedVehicles, Services, Financing,
               TradeIn, WhyUs, Testimonials, VisitUs
    vehicle/   VehicleCard, VehicleImage, EstoqueBrowser (client), Gallery (client),
               VehicleInterestForm (client)
    contato/   ContactForm (client)

  types/vehicle.ts     interface Vehicle (+ VehiclePhoto, VehicleStatus)
  lib/
    site.ts            dados institucionais - TEM PLACEHOLDERS (ver "Banco de dados")
    db.ts              PrismaClient server-only + adapter pg + omit dos campos admin
    vehicles.ts        server-only, Prisma. get* + toVehicle()
    vehicle-format.ts  puro/isomórfico: formatPrice/Mileage/Year, filterVehicles
    content.ts         server-only: getTestimonials()
    leads.ts           server-only: valida (zod) + grava leads
    admin.ts           server-only: consultas do painel (leads, veículos c/ campos internos)
    auth.ts            server-only: getCurrentUser / requireUser
    supabase/          config.ts, server.ts, client.ts (Supabase Auth SSR)
    useIsomorphicLayoutEffect.ts

prisma/schema.prisma   modelos do banco (ver "Banco de dados")
prisma/migrations/     20260910174458_init
prisma/seed.mjs        dados iniciais (npm run db:seed)
prisma.config.ts       config do Prisma 7 (schema + URL de migrations, lê do .env)
scripts/               db-test.mjs, db-verify.mjs, create-admin.mjs
```

## Design system

Tema **único**: escuro, comprometido (sem modo claro). `color-scheme: dark`.
Tudo definido em `src/app/globals.css`.

### Cor (tokens em `:root`, mapeados em `@theme` -> utilitários `bg-*`, `text-*`)

| token | valor | uso |
|---|---|---|
| `--bg` | `#0b0b0c` | fundo base |
| `--bg-elev` | `#121214` | seções alternadas, footer |
| `--surface` | `#17171a` | cards, formulários |
| `--surface-2` | `#1e1e22` | superfície mais alta |
| `--fg` | `#eeece7` | texto primário (off-white quente) |
| `--fg-dim` | `#b6b4ae` | texto secundário |
| `--muted` | `#86858b` | labels, legendas |
| `--border` | `#2a2a2f` | divisores 1px |
| `--border-strong` | `#3a3a41` | bordas de input/botão outline |
| `--accent` | `#c22a22` | vermelho - CTAs, kickers, números-chave. Usar com moderação |
| `--accent-hover` | `#dc4136` | hover do acento, texto de erro |
| `--accent-ink` | `#fdecea` | texto sobre fundo acento |

Regra: **um acento só**, o mesmo na página inteira. Sem segundo acento.

### Tipografia

- **Display** (`font-display`, Archivo): headlines, nomes de modelo, preços.
  Peso 600, `letter-spacing: -0.02em`, `text-wrap: balance`.
- **Sans** (`font-sans`, Inter): corpo, nav, specs, labels.
- Headlines de seção: `text-[clamp(1.6rem,6vw,3rem)]`. Hero: `clamp(2rem,8.5vw,5rem)`.
  Os mínimos do clamp são baixos de propósito para caber em 360-390px.
- Números (preço, km, ano): classe `.tnum` (tabular-nums).
- Nunca all-caps via CSS para labels/eyebrows. Sem `→` em botão/link.
- Sem serifa. Sem `Fraunces`/`Instrument_Serif`.

### Espaçamento e forma

- Escala do Tailwind v4 (base 0.25rem). Densidade baixa-média.
- Seções: `py-16 md:py-24`. Hero: `min-h-[100svh]` (nunca `h-screen`).
- **Um border-radius só**: `--radius` = 3px (`rounded`). Cards, inputs, botões.
- **Sem `box-shadow`**. Profundidade vem de contraste tonal e borda 1px.
- Hover em imagem de card: `scale(1.03)`, 400-500ms, ease `cubic-bezier(0.65,0,0.35,1)`.
- `:active` em botão: `translate-y-px` (feedback tátil).

### Regras de composição herdadas (anti-slop)

- Máximo 1 kicker/eyebrow a cada 3 seções (hoje: hero, FeaturedVehicles, WhyUs).
  Preferir headline sozinha.
- Sem `—` (travessão) em lugar nenhum visível. Usar hífen, vírgula ou frase nova.
- Sem numeração 01/02/03 em conteúdo que não é sequência (Compra/Venda/Troca
  não são passos, são serviços paralelos).
- Layout: no máximo 2 seções seguidas com o mesmo padrão "texto + visual lado a
  lado". Alternar famílias de layout.
- Bento: nº de células = nº de itens, sem célula vazia.
- Placeholder de foto sempre marcado ("Foto ilustrativa") e com comentário
  `{/* TODO: foto real */}` no ponto de uso.

## Sistema de movimento

Objetivo: sensação cinematográfica coesa, não uma animação isolada. Sutil,
intencional, guiando a ordem de leitura.

- **`SmoothScroll`** (`layout.tsx`, renderiza null): inicia o Lenis e o pluga no
  `gsap.ticker`; `lenis.on("scroll", ScrollTrigger.update)`. Dá `ScrollTrigger.refresh()`
  ao trocar de rota. Se `prefers-reduced-motion: reduce`, não inicia Lenis.
- **`Hero`**: timeline de `ScrollTrigger` com `scrub` presa à seção
  (`start "top top"`, `end "bottom top"`). O "carro" (placeholder) cresce
  (`scale 1.16`), gira `2.2deg` e sobe; o texto sobe e some; o scrim escurece.
  É a "aproximação de câmera". Sem `pin` (mais robusto).
- **`SplitLines`**: título revelado linha a linha por máscara. As quebras são o
  array `lines` passado pelo chamador (sem medição frágil de layout). `immediate`
  = anima ao montar (hero); senão anima no scroll (`start "top 90%"`).
- **`Reveal`**: revela o próprio elemento ou, com `stagger`, os filhos
  `[data-reveal-item]` em sequência. Variantes: `fade-up`, `blur-in`, `rise`, `scale`.
- **`Parallax`**: deslocamento vertical sutil com `scrub`.
- **`Magnetic`**: atração leve ao cursor no CTA principal (desktop, ponteiro fino).

**Regras:**
- Todo componente de motion é client-leaf isolado (`"use client"` no topo),
  usa `useIsomorphicLayoutEffect`, `gsap.context()` e `return () => ctx.revert()`.
- Todo componente checa `matchMedia("(prefers-reduced-motion: reduce)")` e **sai
  cedo**, deixando o conteúdo visível e estático. Sem JS, o conteúdo aparece
  normal (as revelações não escondem nada via CSS).
- **Proibido** `window.addEventListener("scroll", ...)`. Usar ScrollTrigger,
  IntersectionObserver (o header usa uma sentinela no body) ou o evento do Lenis.
- Só `transform` / `opacity` / `clip-path` animados no scroll. Nunca `top/left/width/height`.

## Camada de dados

Toda a UI lê de `src/lib/vehicles.ts`, **nunca** de `data/vehicles.ts` direto.
Trocar o mock por API/CMS = editar só `lib/vehicles.ts`.

- Filtro/ordenação do `/estoque` é client-side (`filterVehicles` sobre a lista
  completa). Como os dados são estáticos e pequenos, tudo bem enviar ao cliente.
- `/estoque/[id]` é SSG: `generateStaticParams` gera as 14 páginas,
  `generateMetadata` monta title/description por veículo.
- Formulários (troca, contato) não têm backend: montam uma mensagem e abrem o
  `wa.me` com o texto pré-preenchido, depois mostram estado de sucesso.

### Banco de dados

- **Engine:** PostgreSQL, hospedado no Supabase (projeto `vetqzeeefvqvxiekzokw`).
- **ORM:** Prisma 7 (`prisma` + `@prisma/client` + `@prisma/adapter-pg` + `pg`).

**Arquitetura Prisma 7 (mudou):**
- O schema fica em `prisma/schema.prisma`. O `datasource` só declara `provider`,
  **nunca a URL** (o Prisma 7 proíbe `url` no schema).
- `prisma.config.ts` (raiz) tem a URL para CLI/migrations, lida de `env("DATABASE_URL")`.
  Carrega o `.env` com `process.loadEnvFile(".env")` (o Prisma 7 não carrega `.env`
  sozinho quando existe `prisma.config.ts`).
- Runtime: `src/lib/db.ts` cria o `PrismaClient` com o adapter `PrismaPg`
  (`new PrismaPg(process.env.DATABASE_URL)`). Tem `import "server-only"` no topo:
  o build quebra se for importado de um Client Component. `DATABASE_URL` não tem
  prefixo `NEXT_PUBLIC_`, então nunca vai para o browser.
- **Campos administrativos de `Vehicle`** (`licensePlate`, `renavam`, `chassis`,
  `fipeCode`, `purchaseCost`, `internalNotes`): `omit` global no `PrismaClient`
  (`VEHICLE_ADMIN_FIELDS` em `src/lib/db.ts`). Toda query os exclui por padrão;
  só `src/lib/admin.ts` (`getVehiclesForAdmin`, com `omit: { <campo>: false }`)
  os lê. Verificado em runtime: cliente público devolve 22 campos, sem os 6.
- `postinstall` roda `prisma generate`. Scripts: `db:test` (conexão),
  `db:verify` (tabelas/enums/FKs/índices), `db:seed`, `db:studio`,
  `admin:create` (cria o usuário admin no Supabase Auth a partir do `.env`).
- Credenciais só em `.env` (coberto por `.gitignore`, padrão `.env*`).

**Fluxo de dados (mocks -> banco):** `data/vehicles.ts` foi removido. A UI
consome de:
- `src/lib/vehicle-format.ts` — puro (formatação + `filterVehicles`), isomórfico,
  usado pelo `EstoqueBrowser` (client) e por Server Components.
- `src/lib/vehicles.ts` — `server-only`, Prisma. `getVehicles`, `getFeaturedVehicles`,
  `getVehicleBySlug` (cacheada, = `getVehicleById`), `getRelatedVehicles`,
  `getBrands`, `getBodyTypes`, `getPriceRange`, `countVehicles`. `toVehicle()`
  mapeia a linha do Prisma para o `Vehicle` do front (enum -> rótulo, `id` = slug,
  `photos` de `veiculo_fotos`).
- `src/lib/content.ts` — `getTestimonials()` (tabela `depoimentos`).
- `/`, `/estoque`, `/estoque/[id]` são `dynamic = "force-dynamic"` (sempre
  refletem o banco). `/sobre` e `/contato` continuam estáticas.
- `VehicleImage` renderiza `veiculo_fotos` via `next/image` (host liberado em
  `next.config.ts` `images.remotePatterns`); sem foto cai no `Placeholder`.

**Leads:** `src/lib/leads.ts` (`server-only`, valida com `zod`) +
`src/app/actions/leads.ts` (`"use server"`). `ContactForm`, `TradeIn` e
`VehicleInterestForm` chamam a action, gravam em `leads` (status `NEW`,
`vehicleId` quando há veículo) e ainda abrem o WhatsApp. **Nenhuma leitura
pública de `leads`** — só `src/lib/admin.ts`, dentro de `/admin`.

**Auth / admin (Supabase Auth, sem Better Auth, sem auth própria):**
- `src/lib/supabase/{config,server,client}.ts` — clientes SSR/browser.
- `src/proxy.ts` (ex-`middleware.ts`; Next 16 renomeou) — protege `/admin/*`
  (`matcher`), renova a sessão. Sem Supabase configurado, `/admin/*` (menos
  `/admin/login`) redireciona para o login.
- `src/lib/auth.ts` — `getCurrentUser()` (nunca lança), `requireUser()` (redirect).
- Route group `src/app/(site)/` tem o shell público (SmoothScroll + header +
  footer); `src/app/admin/` fica fora dele e tem shell próprio. `layout.tsx`
  raiz virou só `<html><body>`.
- Páginas: `/admin/login`, `/admin` (stats), `/admin/leads`, `/admin/veiculos`
  (com os campos internos). CRUD de veículos/fotos fica para a próxima etapa —
  a infra (`admin.ts`, auth, omit opt-in) já está pronta.
- `.env`: `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY` (a anon
  key é pública por design). `SUPABASE_SERVICE_ROLE_KEY` é segredo, sem
  `NEXT_PUBLIC_`, usado só pelo `admin:create`.

**Tabelas** (nomes em pt-BR via `@@map`; modelos/campos em inglês para casar
com `src/types/vehicle.ts`):
1. `veiculos` — `Vehicle`: slug, brand, model, version, year, manufactureYear,
   price (R$ inteiros), mileage, fuel/transmission/body (enums), color, doors,
   plateEnd, featured, status, highlights[] , features[], description, timestamps.
   Campos internos (placa, renavam, chassi, fipe, custo, notas) nunca vão ao site.
2. `veiculo_fotos` — `VehiclePhoto`: vehicleId, url, alt, position (capa = menor).
3. `leads` — `Lead`: kind (CONTATO/TROCA/INTERESSE/FINANCIAMENTO), name, phone,
   subject, message, tradeCar, tradeKm, vehicleId?, status.
4. `depoimentos` — `Testimonial`: quote, author, context, published, position.
5. `configuracoes` — `SiteConfig`: linha única (`id = "default"`). Espelha
   `src/lib/site.ts` (o site ainda lê de `site.ts`; a tabela existe seedada e
   pronta para migrar quando o cliente enviar os dados reais).

**Status:** migration `prisma/migrations/20260910174458_init` aplicada no
Supabase (Session pooler, PostgreSQL 17.6). `db:verify`: 5 tabelas + 6 enums +
2 FKs + 15 índices. Seed: 14 veículos, 89 fotos (picsum, dev), 4 depoimentos,
1 config. `db:test` / `tsc` / `eslint` / `next build` passam.

Migrations futuras: `prisma migrate dev --name <x>` (Session pooler suporta).
Para produção/serverless: `DATABASE_URL` no pooler **transaction** (6543,
`?pgbouncer=true`) + `directUrl` no **session** (5432) no `datasource`.
As fotos de dev (`picsum.photos`) saem quando o cliente enviar as reais →
Supabase Storage (host já liberado em `next.config.ts`).

## Pendências / o que precisa dos dados reais do cliente

Tudo marcado com `// TODO` e concentrado em `src/lib/site.ts`:

1. **Contato**: WhatsApp, endereço, CEP, horário, e-mail, link do Google Maps.
   Hoje são placeholders (`(00) 00000-0000`, "Av. Exemplo, 1234", etc.).
2. **Imagens**: todo `Placeholder` (hero, cards, galeria, fachada, mapa) precisa
   de foto real. Trocar `<Placeholder>` por `<Image>` do `next/image` e, se usar
   host externo, configurar `images.remotePatterns` no `next.config.ts`.
   Pontos: foto principal do hero, fotos de cada um dos veículos (galeria),
   fachada/equipe (`/sobre`), embed do mapa (`VisitUs` e `/contato`).
3. **Estoque**: 14 veículos mockados. Ligar ao sistema de gestão do cliente.
4. **Nome/domínio**: `metadataBase` e `sitemap.ts` usam
   `https://beneventoveiculos.com.br` como placeholder.

## Regras de manutenção

- Lógica de dados só via `lib/vehicles.ts`.
- Não criar novo valor de cor, radius ou fonte fora dos tokens de `globals.css`.
- Novo componente visual: arquivo próprio, nome espelhando o componente. Client
  só quando precisa de interação/motion; o resto é Server Component.
- Rodar `tsc --noEmit` + `eslint src` + `build` antes de fechar qualquer etapa.
- `AGENTS.md` tem o bloco de regras do Next 16 (re-adicionado pelo `next dev`);
  commitar junto para o diff ficar limpo.

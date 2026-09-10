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
```

Rodar `tsc --noEmit` + `eslint src` + `next build` antes de considerar
qualquer etapa concluída.

## Estrutura

```
src/
  app/
    layout.tsx           fonts, metadata (pt-BR), SmoothScroll + Header + Footer
    globals.css          @import tailwindcss + tokens (@theme) + base + motion CSS
    page.tsx             Home (compõe as seções de components/home)
    icon.svg             favicon (monograma B)
    not-found.tsx  sitemap.ts
    estoque/page.tsx           catálogo (usa EstoqueBrowser)
    estoque/[id]/page.tsx      página do veículo (generateStaticParams + generateMetadata)
    sobre/page.tsx  contato/page.tsx

  components/
    motion/    SmoothScroll, Reveal, SplitLines, Parallax, Magnetic
    layout/    SiteHeader (client), SiteFooter (server)
    ui/        Container, Button (ButtonLink + Button), WhatsappCta,
               SectionIntro, Placeholder
    home/      Hero, ProofBar, FeaturedVehicles, Services, Financing,
               TradeIn, WhyUs, Testimonials, VisitUs
    vehicle/   VehicleCard, EstoqueBrowser (client, filtros), Gallery (client, lightbox)
    contato/   ContactForm (client)

  data/vehicles.ts     array mockado, 14 veículos (modelos vistos no Instagram)
  types/vehicle.ts     interface Vehicle
  lib/
    site.ts            dados institucionais (nome, contato, horário) - TEM PLACEHOLDERS
    vehicles.ts        camada de acesso: getVehicles, getFeaturedVehicles,
                       getVehicleById, getRelatedVehicles, getBrands, getBodyTypes,
                       getPriceRange, filterVehicles, formatPrice/Mileage/Year
    useIsomorphicLayoutEffect.ts
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

- **Engine:** PostgreSQL (via Supabase)
- **ORM:** Prisma (recomendado) ou raw queries via `@supabase/supabase-js`
- **Tabelas:**
  1. `veiculos` — marca, modelo, versão, ano, preço, km, combustível, câmbio, carroceria, cor, etc. (54 campos)
  2. `veiculo_fotos` — id, veiculo_id, url, ordem
  3. `leads` — tipo (contato/troca/interesse/financiamento), nome, telefone, assunto, mensagem, veiculo_id (opcional), status
  4. `depoimentos` — texto, autor, contexto, publicado, ordem
  5. `configuracoes` — site-wide: nome, slogan, WhatsApp, email, endereço, horários, Google Maps URL

**Status:** TODO - banco não foi criado ainda. Será criado quando o cliente fornecer as credenciais do Supabase.

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

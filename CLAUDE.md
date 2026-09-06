# Vertice Motors — Site de Concessionária Premium

## O que é

Site institucional + catálogo de veículos para concessionária premium. Visual cinematográfico, minimalista, alto contraste. Referência: marca automotiva de luxo, não marketplace/dashboard.

Preparado para receber backend, banco de dados e painel `/admin` depois — hoje roda 100% com dados mockados.

## Stack

- Next.js (App Router) + TypeScript
- React
- CSS Modules (sem Tailwind, sem CSS-in-JS)
- lucide-react (ícones)
- GSAP (animações — usado só onde melhora a experiência)
- next/font/google: Fraunces (display) + Geist (sans)

## Comandos

```
npm install
npm run dev       # localhost:3000
npm run build
npx tsc --noEmit  # typecheck
npx eslint src --ext .ts,.tsx
```

## Estrutura

```
src/
  app/
    layout.tsx          → fonts, metadata base
    page.tsx             → Home
    globals.css           → reset + import de variables.css
    estoque/              → (a construir) catálogo
    estoque/[id]/          → (a construir) página do veículo
    sobre/                 → (a construir)
    contato/               → (a construir)

  components/
    layout/     Header, Footer, (MobileMenu está embutido no Header)
    home/       Hero, FeaturedVehicles, FeaturedVehicle, StockPreview,
                CinematicSection, Benefits, FinalCTA
    vehicle/    VehicleCard (única peça de /estoque já construída)
    ui/         Button, Container  (primitivas reutilizáveis)

  data/
    vehicles.ts   → array mockado, 4 veículos (Toyota, BMW, Mercedes, Audi)

  types/
    vehicle.ts    → interface Vehicle

  lib/
    vehicles.ts   → camada de acesso a dados: getVehicles(), getFeaturedVehicles(),
                    getVehicleById(), formatPrice(), formatMileage()
                    ⚠️ TODA a UI deve ler daqui, nunca de data/vehicles.ts direto.
                    Trocar mock por API/DB = editar só este arquivo.

  styles/
    variables.css → design tokens (cor, tipografia, spacing, breakpoints)
```

## Design system

### Cor
| token | valor | uso |
|---|---|---|
| `--background` | `#0a0a0b` | fundo base |
| `--surface` | `#141416` | superfícies elevadas |
| `--foreground` | `#edebe6` | texto primário (off-white quente) |
| `--muted` | `#8a8a8d` | texto secundário |
| `--border` | `#232326` | divisores |
| `--accent` | `#8a1f1f` | vermelho desaturado — usar com moderação (hover, kicker, detalhes) |

### Tipografia
- **Display** (`--font-display`, Fraunces): headlines, preços, nomes de modelo. Usa peso 300/400, itálico como recurso expressivo (não decoração aleatória).
- **Sans** (`--font-sans`, Geist): corpo, nav, labels, specs.
- Escala em `variables.css`: `--fs-xs` (13px) até `--fs-4xl` (104px).
- Regra: nunca all-caps via CSS para labels/eyebrows. Nunca `→` em botão/link.

### Spacing
Escala em base 4px: `--space-1` (4px) até `--space-48` (192px). Usar sempre os tokens, não valores soltos.

### Componentes visuais
- Border-radius único: `--radius` = 4px (não usar outro valor)
- Sem sombras (`box-shadow`) — profundidade vem de contraste tonal, não de shadow
- Cards: borda 1px sutil, sem elevação
- Hover em imagem: `scale(1.03)`, 400ms, `--ease` (`cubic-bezier(0.65,0,0.35,1)`)
- Motion não-disparado-por-usuário: só nos momentos definidos (hero reveal, cinematic scroll-reveal) — não replicar fade-up genérico em toda seção
- `prefers-reduced-motion: reduce` respeitado em `globals.css` + checado manualmente em Hero.tsx/CinematicSection.tsx

## Estado atual (o que já existe)

Home completa e funcional:
Header (transparente→scroll com blur) → Hero (GSAP reveal) → FeaturedVehicles (editorial alternado, 3 veículos) → StockPreview (grid 4 cards) → CinematicSection (reveal via IntersectionObserver) → Benefits → FinalCTA → Footer

Build, typecheck e lint passando limpo.

## Pendências / decisões em aberto

1. **Imagens**: todo lugar que deveria ter foto de veículo usa placeholder CSS (gradiente/vinheta), marcado com comentário `/* substituir por foto real */`. Precisa de banco de imagens real antes de trocar por `next/image`.
2. **Nome da concessionária**: "Vertice Motors" é placeholder, hardcoded em 3 lugares — `Header.tsx`, `Footer.tsx`, `layout.tsx` (metadata). Trocar quando o nome real for definido.
3. **Dados mockados**: só 4 veículos (suficiente pra Home). Expandir para 12+ ao construir `/estoque`.
4. **Rotas não construídas ainda**: `/estoque`, `/estoque/[id]`, `/sobre`, `/contato`.
5. **Reserva de arquitetura futura**: `/admin` e `/api` não existem ainda, mas a camada `lib/vehicles.ts` já isola o acesso a dados especificamente para essa troca ser barata.

## Ordem de implementação combinada

1. ~~Setup + design system~~ ✅
2. ~~Header~~ ✅
3. ~~Hero~~ ✅
4. ~~Home~~ ✅
5. ~~Dados mockados~~ ✅ (parcial, 4 veículos)
6. ~~VehicleCard~~ ✅ (versão mínima)
7. `/estoque` (grid completo, 3/2/1 colunas)
8. Filtros + ordenação (funcionais, não decorativos)
9. `/estoque/[id]`
10. Galeria (lightbox, swipe mobile)
11. Especificações + equipamentos
12. Veículos relacionados
13. Animações finais
14. Responsividade — revisão
15. SEO (metadata dinâmica por veículo)
16. Revisão final (build, lint, links, imagens)

## Regras de manutenção

- Não colocar lógica de dados direto em componentes — sempre via `lib/vehicles.ts`.
- Não criar novo valor de `border-radius`, cor ou spacing fora dos tokens em `variables.css`.
- Todo novo componente visual: CSS Module próprio, nome espelhando o componente (`Nome.tsx` + `Nome.module.css`).
- Novas seções de página não-sequenciais não usam marcadores numerados (01/02/03) — só usar numeração se o conteúdo for de fato um processo/sequência.
- Rodar `npx tsc --noEmit` + `npx eslint src` antes de considerar qualquer etapa concluída.
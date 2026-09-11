"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";
import { Container } from "@/components/ui/Container";
import { Placeholder } from "@/components/ui/Placeholder";
import { ButtonLink } from "@/components/ui/Button";
import { WhatsappCta } from "@/components/ui/WhatsappCta";
import { SplitLines } from "@/components/motion/SplitLines";
import { Reveal } from "@/components/motion/Reveal";
import { Magnetic } from "@/components/motion/Magnetic";
import { site } from "@/lib/site";

export function Hero() {
  const section = useRef<HTMLElement>(null);
  const photo = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const scrim = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const el = section.current;
    if (!el) return;
    gsap.registerPlugin(ScrollTrigger);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      // Aproximacao de camera: o carro cresce, gira de leve e sobe enquanto
      // o texto sai de cena. Tudo preso ao progresso do scroll da secao.
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });

      tl.to(photo.current, { scale: 1.16, rotate: 2.2, yPercent: -6, ease: "none" }, 0)
        .to(content.current, { yPercent: -22, autoAlpha: 0, ease: "none" }, 0)
        .to(scrim.current, { opacity: 0.9, ease: "none" }, 0);
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={section}
      className="relative flex min-h-[100svh] items-center overflow-hidden pb-16 pt-24"
    >
      <div className="absolute inset-0 -z-10">
        <div ref={photo} className="absolute -inset-[8%] will-change-transform">
          {/* TODO: foto real principal (carro em destaque, 1920x1080+) */}
          <Placeholder
            label="Carro em destaque no pátio"
            tone="hero"
            ratio="16 / 10"
            className="size-full rounded-none border-0"
          />
        </div>
        <div
          ref={scrim}
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(11,11,12,0.30) 0%, rgba(11,11,12,0.20) 40%, rgba(11,11,12,0.92) 100%), linear-gradient(90deg, rgba(11,11,12,0.80) 0%, rgba(11,11,12,0.10) 55%, transparent 80%)",
          }}
        />
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.5] mix-blend-overlay"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.35'/%3E%3C/svg%3E\")",
          }}
        />
      </div>

      <Container className="relative">
        <div ref={content} className="flex max-w-2xl flex-col gap-6">
          <span className="text-[0.82rem] text-accent">
            Garagem de seminovos
          </span>

          <SplitLines
            as="h1"
            immediate
            lines={["Seu próximo carro", "já está no pátio."]}
            className="text-[clamp(2rem,8.5vw,5rem)] font-semibold leading-[1.02] text-fg"
          />

          <Reveal variant="fade-up" delay={0.55}>
            <p className="max-w-xl text-[1.1rem] leading-relaxed text-fg-dim">
              {site.tagline} Mais de {site.soldCount} famílias já saíram daqui
              dirigindo.
            </p>
          </Reveal>

          <Reveal variant="fade-up" delay={0.68}>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Magnetic>
                <ButtonLink href="/estoque" size="lg">
                  Ver estoque
                </ButtonLink>
              </Magnetic>
              <WhatsappCta size="lg" message="Olá! Vi o site e quero ajuda para escolher um carro.">
                Falar no WhatsApp
              </WhatsappCta>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}

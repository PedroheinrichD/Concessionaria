"use client";

import { useEffect, useRef } from "react";
import Button from "@/components/ui/Button";
import styles from "./Hero.module.css";

export default function Hero() {
  const imageRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const els = [imageRef.current, textRef.current, actionsRef.current, scrollRef.current];

    if (prefersReduced) {
      els.forEach((el) => el?.classList.add(styles.visible));
      return;
    }

    let gsapCtx: (() => void) | undefined;

    import("gsap").then(({ gsap }) => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(
        imageRef.current,
        { opacity: 0, scale: 1.04 },
        { opacity: 1, scale: 1, duration: 1.4 }
      )
        .fromTo(
          textRef.current,
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.9 },
          "-=0.8"
        )
        .fromTo(
          actionsRef.current,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.7 },
          "-=0.5"
        )
        .fromTo(
          scrollRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.6 },
          "-=0.2"
        );
      gsapCtx = () => tl.kill();
    });

    return () => gsapCtx?.();
  }, []);

  return (
    <section className={styles.hero}>
      <div ref={imageRef} className={styles.image} />

      <div className={styles.content}>
        <div ref={textRef} className={styles.textBlock}>
          <h1 className={styles.headline}>
            Seu próximo carro
            <br />
            começa aqui.
          </h1>
          <p className={styles.subtext}>
            Veículos selecionados para quem exige mais.
          </p>
        </div>

        <div ref={actionsRef} className={styles.actions}>
          <Button href="/estoque" variant="primary">
            Ver estoque
          </Button>
          <Button href="/contato" variant="secondary">
            Fale conosco
          </Button>
        </div>
      </div>

      <div ref={scrollRef} className={styles.scrollIndicator}>
        <span className={styles.scrollLine} />
      </div>
    </section>
  );
}

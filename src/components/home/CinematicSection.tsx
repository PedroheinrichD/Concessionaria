"use client";

import { useEffect, useRef } from "react";
import styles from "./CinematicSection.module.css";

export default function CinematicSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReduced) {
      sectionRef.current?.classList.add(styles.visible);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          sectionRef.current?.classList.add(styles.visible);
          observer.disconnect();
        }
      },
      { threshold: 0.35 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className={styles.section}>
      <div className={styles.image} />
      <div ref={textRef} className={styles.textBlock}>
        <p className={styles.line}>Performance.</p>
        <p className={styles.line}>Design.</p>
        <p className={styles.line}>Presença.</p>
      </div>
    </section>
  );
}

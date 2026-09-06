"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import Container from "@/components/ui/Container";
import styles from "./Header.module.css";

const NAV_LINKS = [
  { label: "Início", href: "/" },
  { label: "Estoque", href: "/estoque" },
  { label: "Sobre", href: "/sobre" },
  { label: "Contato", href: "/contato" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
  }, [menuOpen]);

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ""}`}>
      <Container className={styles.inner}>
        <Link href="/" className={styles.logo}>
          Vertice Motors
        </Link>

        <nav className={styles.nav}>
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className={styles.navLink}>
              {link.label}
            </Link>
          ))}
        </nav>

        <Link href="/estoque" className={styles.cta}>
          Ver estoque
        </Link>

        <button
          className={styles.menuButton}
          onClick={() => setMenuOpen(true)}
          aria-label="Abrir menu"
        >
          <Menu size={22} strokeWidth={1.5} />
        </button>
      </Container>

      <div className={`${styles.overlay} ${menuOpen ? styles.overlayOpen : ""}`}>
        <button
          className={styles.closeButton}
          onClick={() => setMenuOpen(false)}
          aria-label="Fechar menu"
        >
          <X size={24} strokeWidth={1.5} />
        </button>
        <nav className={styles.overlayNav}>
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={styles.overlayLink}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/estoque"
          className={styles.overlayCta}
          onClick={() => setMenuOpen(false)}
        >
          Ver estoque
        </Link>
      </div>
    </header>
  );
}

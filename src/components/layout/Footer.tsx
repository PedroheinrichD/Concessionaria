import Link from "next/link";
import Container from "@/components/ui/Container";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <Container>
        <div className={styles.top}>
          <div className={styles.brandBlock}>
            <p className={styles.logo}>Vertice Motors</p>
            <p className={styles.address}>
              Av. das Nações, 1200 — São Paulo, SP
            </p>
          </div>

          <div className={styles.col}>
            <p className={styles.colTitle}>Navegação</p>
            <Link href="/estoque">Estoque</Link>
            <Link href="/sobre">Sobre</Link>
            <Link href="/contato">Contato</Link>
            <Link href="/contato">Financiamento</Link>
          </div>

          <div className={styles.col}>
            <p className={styles.colTitle}>Contato</p>
            <a href="tel:+551140028922">(11) 4002-8922</a>
            <a href="https://wa.me/5511940028922" target="_blank" rel="noopener noreferrer">
              WhatsApp
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              Instagram
            </a>
          </div>

          <div className={styles.col}>
            <p className={styles.colTitle}>Horário</p>
            <p>Segunda a sexta</p>
            <p>08:00 – 18:00</p>
          </div>
        </div>

        <div className={styles.bottom}>
          <p>© {new Date().getFullYear()} Vertice Motors. Todos os direitos reservados.</p>
        </div>
      </Container>
    </footer>
  );
}

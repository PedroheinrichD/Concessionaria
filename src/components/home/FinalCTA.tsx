import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import styles from "./FinalCTA.module.css";

export default function FinalCTA() {
  return (
    <section className={styles.section}>
      <Container className={styles.container}>
        <h2 className={styles.title}>
          Encontre o carro que
          <br />
          combina com você.
        </h2>
        <p className={styles.subtext}>
          Explore nosso estoque ou fale diretamente com um especialista.
        </p>
        <div className={styles.actions}>
          <Button href="/estoque" variant="primary">
            Explorar estoque
          </Button>
          <Button href="/contato" variant="secondary">
            Falar com especialista
          </Button>
        </div>
      </Container>
    </section>
  );
}

import Container from "@/components/ui/Container";
import styles from "./Benefits.module.css";

const BENEFITS = [
  { title: "Veículos selecionados", description: "Cada carro passa por uma curadoria criteriosa antes de chegar até você." },
  { title: "Procedência garantida", description: "Histórico completo e verificado, sem surpresas." },
  { title: "Atendimento personalizado", description: "Um especialista te acompanha do primeiro contato à entrega." },
  { title: "Financiamento facilitado", description: "Condições flexíveis, aprovação rápida." },
];

export default function Benefits() {
  return (
    <section className={styles.section}>
      <Container>
        <h2 className={styles.title}>
          Mais do que um carro.
          <br />
          Uma escolha certa.
        </h2>

        <div className={styles.grid}>
          {BENEFITS.map((benefit) => (
            <div key={benefit.title} className={styles.item}>
              <h3 className={styles.itemTitle}>{benefit.title}</h3>
              <p className={styles.itemText}>{benefit.description}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

import { Vehicle } from "@/types/vehicle";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import VehicleCard from "@/components/vehicle/VehicleCard";
import styles from "./StockPreview.module.css";

interface StockPreviewProps {
  vehicles: Vehicle[];
}

export default function StockPreview({ vehicles }: StockPreviewProps) {
  return (
    <section className={styles.section}>
      <Container>
        <div className={styles.heading}>
          <h2 className={styles.title}>Explore nosso estoque</h2>
          <p className={styles.subtext}>
            Uma seleção de veículos escolhidos por qualidade, procedência e estado.
          </p>
        </div>

        <div className={styles.grid}>
          {vehicles.map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>

        <div className={styles.footer}>
          <Button href="/estoque" variant="secondary">
            Ver todo o estoque
          </Button>
        </div>
      </Container>
    </section>
  );
}

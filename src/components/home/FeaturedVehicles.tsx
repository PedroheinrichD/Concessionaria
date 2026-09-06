import { Vehicle } from "@/types/vehicle";
import Container from "@/components/ui/Container";
import FeaturedVehicle from "./FeaturedVehicle";
import styles from "./FeaturedVehicles.module.css";

interface FeaturedVehiclesProps {
  vehicles: Vehicle[];
}

export default function FeaturedVehicles({ vehicles }: FeaturedVehiclesProps) {
  return (
    <section className={styles.section}>
      <Container>
        <div className={styles.heading}>
          <span className={styles.kicker}>Seleção da semana</span>
          <h2 className={styles.title}>
            Veículos que merecem
            <br />
            ser vistos de perto.
          </h2>
        </div>
      </Container>

      <div className={styles.list}>
        {vehicles.map((vehicle, index) => (
          <FeaturedVehicle
            key={vehicle.id}
            vehicle={vehicle}
            reversed={index % 2 === 1}
          />
        ))}
      </div>
    </section>
  );
}

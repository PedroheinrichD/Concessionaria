import Link from "next/link";
import { Vehicle } from "@/types/vehicle";
import Container from "@/components/ui/Container";
import { formatPrice, formatMileage } from "@/lib/vehicles";
import styles from "./FeaturedVehicle.module.css";

interface FeaturedVehicleProps {
  vehicle: Vehicle;
  reversed?: boolean;
}

export default function FeaturedVehicle({ vehicle, reversed = false }: FeaturedVehicleProps) {
  return (
    <Container>
      <div className={`${styles.row} ${reversed ? styles.reversed : ""}`}>
        <Link href={`/estoque/${vehicle.id}`} className={styles.imageWrap}>
          <div className={styles.imagePlaceholder} />
        </Link>

        <div className={styles.info}>
          <p className={styles.brand}>{vehicle.brand}</p>
          <h3 className={styles.model}>
            {vehicle.model} <span className={styles.version}>{vehicle.version}</span>
          </h3>

          <dl className={styles.specs}>
            <div>
              <dt>Ano</dt>
              <dd>{vehicle.year}</dd>
            </div>
            <div>
              <dt>Km</dt>
              <dd>{formatMileage(vehicle.mileage)}</dd>
            </div>
            <div>
              <dt>Câmbio</dt>
              <dd>{vehicle.transmission}</dd>
            </div>
          </dl>

          <p className={styles.price}>{formatPrice(vehicle.price)}</p>

          <Link href={`/estoque/${vehicle.id}`} className={styles.link}>
            Ver veículo
          </Link>
        </div>
      </div>
    </Container>
  );
}

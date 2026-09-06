import Link from "next/link";
import { Vehicle } from "@/types/vehicle";
import { formatPrice } from "@/lib/vehicles";
import styles from "./VehicleCard.module.css";

interface VehicleCardProps {
  vehicle: Vehicle;
}

export default function VehicleCard({ vehicle }: VehicleCardProps) {
  return (
    <Link href={`/estoque/${vehicle.id}`} className={styles.card}>
      <div className={styles.imageWrap}>
        <div className={styles.imagePlaceholder} />
      </div>

      <div className={styles.body}>
        <p className={styles.brand}>{vehicle.brand}</p>
        <h3 className={styles.model}>{vehicle.model}</h3>
        <p className={styles.version}>{vehicle.version}</p>

        <p className={styles.meta}>
          {vehicle.year} · {vehicle.mileage.toLocaleString("pt-BR")} km
        </p>

        <div className={styles.footer}>
          <p className={styles.price}>{formatPrice(vehicle.price)}</p>
          <span className={styles.link}>Ver veículo</span>
        </div>
      </div>
    </Link>
  );
}

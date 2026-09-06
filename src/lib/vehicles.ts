import { vehicles } from "@/data/vehicles";
import { Vehicle } from "@/types/vehicle";

// Camada de acesso a dados. Hoje lê do mock (src/data/vehicles.ts).
// Ao integrar backend, trocar o corpo destas funções por chamadas fetch/API,
// mantendo as assinaturas para não impactar os componentes que as consomem.

export async function getVehicles(): Promise<Vehicle[]> {
  return vehicles;
}

export async function getFeaturedVehicles(count = 3): Promise<Vehicle[]> {
  return vehicles.slice(0, count);
}

export async function getVehicleById(id: string): Promise<Vehicle | undefined> {
  return vehicles.find((v) => v.id === id);
}

export function formatPrice(price: number): string {
  return price.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  });
}

export function formatMileage(mileage: number): string {
  return `${mileage.toLocaleString("pt-BR")} km`;
}

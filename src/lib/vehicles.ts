import { vehicles } from "@/data/vehicles";
import type { Vehicle } from "@/types/vehicle";

/**
 * Camada de acesso a dados. TODA a UI deve importar daqui, nunca de
 * `data/vehicles.ts` direto. Trocar o mock por API/banco = editar só este
 * arquivo.
 */

export function getVehicles(): Vehicle[] {
  return vehicles;
}

export function getFeaturedVehicles(limit = 3): Vehicle[] {
  return vehicles.filter((v) => v.featured).slice(0, limit);
}

export function getVehicleById(id: string): Vehicle | undefined {
  return vehicles.find((v) => v.id === id);
}

export function getRelatedVehicles(id: string, limit = 3): Vehicle[] {
  const current = getVehicleById(id);
  if (!current) return [];
  const scored = vehicles
    .filter((v) => v.id !== id)
    .map((v) => ({
      v,
      score:
        (v.body === current.body ? 2 : 0) +
        (v.brand === current.brand ? 1 : 0) +
        (Math.abs(v.price - current.price) < 25000 ? 1 : 0),
    }))
    .sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((s) => s.v);
}

export function getBrands(): string[] {
  return [...new Set(vehicles.map((v) => v.brand))].sort((a, b) =>
    a.localeCompare(b, "pt-BR"),
  );
}

export function getBodyTypes(): Vehicle["body"][] {
  return [...new Set(vehicles.map((v) => v.body))];
}

export function getPriceRange(): { min: number; max: number } {
  const prices = vehicles.map((v) => v.price);
  return { min: Math.min(...prices), max: Math.max(...prices) };
}

export type SortKey =
  | "relevancia"
  | "menor-preco"
  | "maior-preco"
  | "mais-novo"
  | "menos-km";

export interface VehicleFilters {
  search?: string;
  brands?: string[];
  bodies?: Vehicle["body"][];
  maxPrice?: number;
  minYear?: number;
  sort?: SortKey;
}

export function filterVehicles(
  list: Vehicle[],
  f: VehicleFilters,
): Vehicle[] {
  let out = list.slice();

  if (f.search?.trim()) {
    const q = f.search.trim().toLowerCase();
    out = out.filter((v) =>
      `${v.brand} ${v.model} ${v.version}`.toLowerCase().includes(q),
    );
  }
  if (f.brands?.length) {
    out = out.filter((v) => f.brands!.includes(v.brand));
  }
  if (f.bodies?.length) {
    out = out.filter((v) => f.bodies!.includes(v.body));
  }
  if (typeof f.maxPrice === "number") {
    out = out.filter((v) => v.price <= f.maxPrice!);
  }
  if (typeof f.minYear === "number") {
    out = out.filter((v) => v.year >= f.minYear!);
  }

  switch (f.sort) {
    case "menor-preco":
      out.sort((a, b) => a.price - b.price);
      break;
    case "maior-preco":
      out.sort((a, b) => b.price - a.price);
      break;
    case "mais-novo":
      out.sort((a, b) => b.year - a.year || a.mileage - b.mileage);
      break;
    case "menos-km":
      out.sort((a, b) => a.mileage - b.mileage);
      break;
    default:
      out.sort(
        (a, b) => Number(b.featured) - Number(a.featured) || b.year - a.year,
      );
  }

  return out;
}

const priceFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 0,
});

const numberFormatter = new Intl.NumberFormat("pt-BR");

export function formatPrice(value: number): string {
  return priceFormatter.format(value);
}

export function formatMileage(value: number): string {
  return `${numberFormatter.format(value)} km`;
}

export function formatYear(v: Vehicle): string {
  return v.manufactureYear === v.year
    ? String(v.year)
    : `${v.manufactureYear}/${v.year}`;
}

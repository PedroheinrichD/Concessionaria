import type { MetadataRoute } from "next";
import { getVehicles } from "@/lib/vehicles";

const base = "https://beneventoveiculos.com.br";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/estoque", "/sobre", "/contato"].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
  }));

  const vehicleRoutes = getVehicles().map((v) => ({
    url: `${base}/estoque/${v.id}`,
    lastModified: new Date(),
  }));

  return [...staticRoutes, ...vehicleRoutes];
}

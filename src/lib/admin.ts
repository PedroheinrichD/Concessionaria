import "server-only";

import { prisma } from "@/lib/db";

/**
 * Consultas exclusivamente administrativas. Só devem ser chamadas de dentro de
 * rotas /admin já protegidas por sessão (ver requireUser / middleware).
 *
 * IMPORTANTE: leads não têm nenhuma leitura pública. Só aqui.
 */

export async function getDashboardStats() {
  const [vehicles, available, reserved, sold, photos, leadsNew, leadsTotal] =
    await Promise.all([
      prisma.vehicle.count(),
      prisma.vehicle.count({ where: { status: "AVAILABLE" } }),
      prisma.vehicle.count({ where: { status: "RESERVED" } }),
      prisma.vehicle.count({ where: { status: "SOLD" } }),
      prisma.vehiclePhoto.count(),
      prisma.lead.count({ where: { status: "NEW" } }),
      prisma.lead.count(),
    ]);
  return { vehicles, available, reserved, sold, photos, leadsNew, leadsTotal };
}

export async function getLeads(limit = 100) {
  return prisma.lead.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
    include: {
      vehicle: { select: { slug: true, brand: true, model: true } },
    },
  });
}

/** Veículos COM os campos administrativos (opt-in explícito sobre o omit global). */
export async function getVehiclesForAdmin() {
  return prisma.vehicle.findMany({
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
    omit: {
      licensePlate: false,
      renavam: false,
      chassis: false,
      fipeCode: false,
      purchaseCost: false,
      internalNotes: false,
    },
    include: { _count: { select: { photos: true } } },
  });
}

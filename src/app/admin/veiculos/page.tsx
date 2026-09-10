import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { getVehiclesForAdmin } from "@/lib/admin";
import { formatPrice, formatMileage } from "@/lib/vehicle-format";

export const dynamic = "force-dynamic";

const STATUS_LABEL: Record<string, string> = {
  AVAILABLE: "Disponível",
  RESERVED: "Reservado",
  SOLD: "Vendido",
};

export default async function AdminVehiclesPage() {
  await requireUser();
  const vehicles = await getVehiclesForAdmin();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold text-fg">
            Veículos
          </h1>
          <p className="mt-1 text-[0.9rem] text-fg-dim">
            {vehicles.length} no estoque. Placa/RENAVAM/custo são internos — só
            aparecem aqui.
          </p>
        </div>
        <Link
          href="/admin/veiculos/novo"
          className="inline-flex h-10 items-center rounded bg-accent px-4 text-[0.88rem] font-medium text-accent-ink hover:bg-accent-hover"
        >
          Novo veículo
        </Link>
      </div>

      <div className="overflow-x-auto rounded border border-border">
        <table className="w-full min-w-[860px] text-left text-[0.85rem]">
          <thead className="bg-bg-elev text-muted">
            <tr>
              <th className="p-3 font-medium">Veículo</th>
              <th className="p-3 font-medium">Ano</th>
              <th className="p-3 font-medium">Km</th>
              <th className="p-3 font-medium">Preço</th>
              <th className="p-3 font-medium">Status</th>
              <th className="p-3 font-medium">Fotos</th>
              <th className="p-3 font-medium">Placa</th>
              <th className="p-3 font-medium">Custo</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {vehicles.map((v) => (
              <tr key={v.id} className="text-fg-dim">
                <td className="p-3">
                  <Link
                    href={`/admin/veiculos/${v.id}`}
                    className="text-fg hover:text-accent"
                  >
                    {v.brand} {v.model}
                  </Link>
                  <span className="block text-[0.78rem] text-muted">
                    {v.version}
                  </span>
                </td>
                <td className="p-3 tnum">{v.year}</td>
                <td className="whitespace-nowrap p-3 tnum">
                  {formatMileage(v.mileage)}
                </td>
                <td className="whitespace-nowrap p-3 tnum">
                  {formatPrice(v.price)}
                </td>
                <td className="p-3">{STATUS_LABEL[v.status] ?? v.status}</td>
                <td className="p-3 tnum">{v._count.photos}</td>
                <td className="p-3">{v.licensePlate ?? "—"}</td>
                <td className="whitespace-nowrap p-3 tnum">
                  {v.purchaseCost ? formatPrice(v.purchaseCost) : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

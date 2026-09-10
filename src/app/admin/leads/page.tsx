import { requireUser } from "@/lib/auth";
import { getLeads } from "@/lib/admin";

export const dynamic = "force-dynamic";

const KIND_LABEL: Record<string, string> = {
  CONTATO: "Contato",
  TROCA: "Troca",
  INTERESSE: "Interesse",
  FINANCIAMENTO: "Financiamento",
};
const STATUS_LABEL: Record<string, string> = {
  NEW: "Novo",
  WORKING: "Em atendimento",
  WON: "Fechado",
  LOST: "Perdido",
};

const dt = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "short",
  timeStyle: "short",
});

export default async function AdminLeadsPage() {
  await requireUser();
  const leads = await getLeads(200);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-fg">Leads</h1>
        <p className="mt-1 text-[0.9rem] text-fg-dim">
          {leads.length} registro(s). Dados administrativos — nunca expostos no
          site.
        </p>
      </div>

      {leads.length === 0 ? (
        <p className="rounded border border-border bg-surface p-6 text-[0.9rem] text-fg-dim">
          Nenhum lead ainda.
        </p>
      ) : (
        <div className="overflow-x-auto rounded border border-border">
          <table className="w-full min-w-[720px] text-left text-[0.85rem]">
            <thead className="bg-bg-elev text-muted">
              <tr>
                <th className="p-3 font-medium">Quando</th>
                <th className="p-3 font-medium">Tipo</th>
                <th className="p-3 font-medium">Nome</th>
                <th className="p-3 font-medium">WhatsApp</th>
                <th className="p-3 font-medium">Assunto / carro</th>
                <th className="p-3 font-medium">Veículo</th>
                <th className="p-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {leads.map((l) => (
                <tr key={l.id} className="text-fg-dim">
                  <td className="whitespace-nowrap p-3 tnum">
                    {dt.format(l.createdAt)}
                  </td>
                  <td className="p-3">{KIND_LABEL[l.kind] ?? l.kind}</td>
                  <td className="p-3 text-fg">{l.name}</td>
                  <td className="whitespace-nowrap p-3 tnum">{l.phone}</td>
                  <td className="p-3">
                    {l.subject ?? l.tradeCar ?? "—"}
                    {l.message ? (
                      <span className="block text-[0.78rem] text-muted">
                        {l.message}
                      </span>
                    ) : null}
                  </td>
                  <td className="p-3">
                    {l.vehicle
                      ? `${l.vehicle.brand} ${l.vehicle.model}`
                      : "—"}
                  </td>
                  <td className="p-3">{STATUS_LABEL[l.status] ?? l.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

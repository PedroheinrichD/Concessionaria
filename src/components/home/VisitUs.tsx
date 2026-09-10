import {
  MapPin,
  Clock,
  ArrowUpRight,
} from "@phosphor-icons/react/dist/ssr";
import { Container } from "@/components/ui/Container";
import { SplitLines } from "@/components/motion/SplitLines";
import { Reveal } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { WhatsappCta } from "@/components/ui/WhatsappCta";
import { Placeholder } from "@/components/ui/Placeholder";
import { getSiteConfig } from "@/lib/site-config";

export async function VisitUs() {
  const site = await getSiteConfig();
  return (
    <section id="visita" className="scroll-mt-24 py-16 md:py-24">
      <Container width="wide">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <div className="flex flex-col gap-7">
            <SplitLines
              lines={["Passa na loja."]}
              className="text-[clamp(1.6rem,6vw,3rem)] font-semibold text-fg"
            />
            <Reveal variant="fade-up">
              <p className="max-w-md text-[1.05rem] leading-relaxed text-fg-dim">
                Café na mesa, chave na mão e ninguém no seu pé. Venha ver os
                carros de perto e fazer um test drive de verdade.
              </p>
            </Reveal>

            <Reveal stagger>
              <div className="flex flex-col gap-4">
                <div
                  data-reveal-item
                  className="flex items-start gap-3 text-[0.95rem] text-fg-dim"
                >
                  <MapPin size={18} weight="light" className="mt-0.5 shrink-0 text-accent" />
                  <span>
                    {site.address.street} · {site.address.district}
                    <br />
                    {site.address.city} - {site.address.state}, {site.address.zip}
                  </span>
                </div>
                <div
                  data-reveal-item
                  className="flex items-start gap-3 text-[0.95rem] text-fg-dim"
                >
                  <Clock size={18} weight="light" className="mt-0.5 shrink-0 text-accent" />
                  <span>
                    {site.hours.map((h) => (
                      <span key={h.days} className="block">
                        {h.days}: {h.time}
                      </span>
                    ))}
                  </span>
                </div>
              </div>
            </Reveal>

            <Reveal variant="fade-up">
              <div className="flex flex-wrap gap-3 pt-2">
                <ButtonLink href="/estoque" size="lg">
                  Ver estoque
                </ButtonLink>
                <WhatsappCta size="lg">Falar no WhatsApp</WhatsappCta>
              </div>
            </Reveal>
          </div>

          <Reveal variant="scale">
            <a
              href={site.address.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative block"
            >
              {/* TODO: incorporar mapa real (Google Maps embed) da loja */}
              <Placeholder
                label="Mapa da loja"
                ratio="4 / 3"
              />
              <span className="absolute right-4 top-4 inline-flex items-center gap-1.5 rounded bg-bg/80 px-3 py-1.5 text-[0.82rem] text-fg backdrop-blur-sm transition-colors group-hover:text-accent">
                Como chegar
                <ArrowUpRight size={14} weight="bold" />
              </span>
            </a>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}

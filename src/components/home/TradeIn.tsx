"use client";

import { useId, useState, type FormEvent } from "react";
import { Check } from "@phosphor-icons/react/dist/ssr";
import { Container } from "@/components/ui/Container";
import { SplitLines } from "@/components/motion/SplitLines";
import { Reveal } from "@/components/motion/Reveal";
import { whatsappHref } from "@/components/ui/WhatsappCta";

type Field = "nome" | "telefone" | "carro";

export function TradeIn() {
  const uid = useId();
  const [values, setValues] = useState({
    nome: "",
    telefone: "",
    carro: "",
    km: "",
  });
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [sent, setSent] = useState(false);

  function update(name: keyof typeof values, value: string) {
    setValues((v) => ({ ...v, [name]: value }));
    if (name in errors) setErrors((e) => ({ ...e, [name]: undefined }));
  }

  function validate() {
    const next: Partial<Record<Field, string>> = {};
    if (values.nome.trim().length < 2) next.nome = "Diga como podemos te chamar.";
    const digits = values.telefone.replace(/\D/g, "");
    if (digits.length < 10)
      next.telefone = "Informe um número com DDD, ex.: (11) 99999-9999.";
    if (values.carro.trim().length < 3)
      next.carro = "Qual carro você quer dar na troca?";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    const msg = [
      "Olá! Quero avaliar meu carro para troca.",
      `Nome: ${values.nome}`,
      `WhatsApp: ${values.telefone}`,
      `Carro atual: ${values.carro}`,
      values.km ? `Km aproximada: ${values.km}` : null,
    ]
      .filter(Boolean)
      .join("\n");
    window.open(whatsappHref(msg), "_blank", "noopener,noreferrer");
    setSent(true);
  }

  const inputBase =
    "h-12 w-full rounded border border-border-strong bg-bg-elev px-3.5 text-fg placeholder:text-muted focus-visible:border-accent focus-visible:outline-none";

  return (
    <section id="troca" className="scroll-mt-24 bg-bg-elev py-16 md:py-24">
      <Container width="wide">
        <div className="grid gap-14 lg:grid-cols-2">
          <div className="flex flex-col gap-6">
            <SplitLines
              lines={["Seu usado", "vale entrada."]}
              className="text-[clamp(1.6rem,6vw,3rem)] font-semibold text-fg"
            />
            <Reveal variant="fade-up">
              <p className="max-w-md text-[1.05rem] leading-relaxed text-fg-dim">
                Manda os dados do seu carro atual. A gente responde no WhatsApp
                com uma faixa de avaliação e já agenda a vistoria presencial.
              </p>
            </Reveal>
            <Reveal variant="fade-up">
              <ul className="flex flex-col gap-3 text-[0.95rem] text-fg-dim">
                {[
                  "Avaliação presencial em cerca de 20 minutos",
                  "O valor abate direto na proposta do próximo carro",
                  "Sem obrigação de fechar negócio",
                ].map((t) => (
                  <li key={t} className="flex items-center gap-3">
                    <Check size={16} weight="bold" className="shrink-0 text-accent" />
                    {t}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          <Reveal variant="scale">
            {sent ? (
              <div className="flex h-full flex-col items-start justify-center gap-4 rounded border border-border bg-surface p-8">
                <span className="flex size-11 items-center justify-center rounded-full bg-accent/15 text-accent">
                  <Check size={22} weight="bold" />
                </span>
                <h3 className="font-display text-xl font-semibold text-fg">
                  Abrimos o WhatsApp com seus dados
                </h3>
                <p className="text-[0.95rem] text-fg-dim">
                  É só enviar a mensagem que já está pronta. Se o app não abriu,
                  chame a gente em {" "}
                  <a
                    className="text-accent hover:text-accent-hover"
                    href={whatsappHref()}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    nosso WhatsApp
                  </a>
                  .
                </p>
                <button
                  type="button"
                  onClick={() => setSent(false)}
                  className="text-[0.9rem] text-fg-dim underline underline-offset-4 hover:text-fg"
                >
                  Enviar outro carro
                </button>
              </div>
            ) : (
              <form
                onSubmit={onSubmit}
                noValidate
                className="flex flex-col gap-5 rounded border border-border bg-surface p-8"
              >
                <div className="flex flex-col gap-1.5">
                  <label htmlFor={`${uid}-nome`} className="text-[0.85rem] text-fg">
                    Seu nome
                  </label>
                  <input
                    id={`${uid}-nome`}
                    className={inputBase}
                    value={values.nome}
                    onChange={(e) => update("nome", e.target.value)}
                    aria-invalid={!!errors.nome}
                    aria-describedby={errors.nome ? `${uid}-nome-err` : undefined}
                    autoComplete="name"
                  />
                  {errors.nome ? (
                    <p id={`${uid}-nome-err`} className="text-[0.8rem] text-accent-hover">
                      {errors.nome}
                    </p>
                  ) : null}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor={`${uid}-tel`} className="text-[0.85rem] text-fg">
                    WhatsApp com DDD
                  </label>
                  <input
                    id={`${uid}-tel`}
                    inputMode="tel"
                    className={inputBase}
                    value={values.telefone}
                    onChange={(e) => update("telefone", e.target.value)}
                    aria-invalid={!!errors.telefone}
                    aria-describedby={
                      errors.telefone ? `${uid}-tel-err` : undefined
                    }
                    autoComplete="tel"
                  />
                  {errors.telefone ? (
                    <p id={`${uid}-tel-err`} className="text-[0.8rem] text-accent-hover">
                      {errors.telefone}
                    </p>
                  ) : null}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor={`${uid}-carro`} className="text-[0.85rem] text-fg">
                    Seu carro atual
                  </label>
                  <input
                    id={`${uid}-carro`}
                    className={inputBase}
                    placeholder="Ex.: Onix 1.0 2019, 60 mil km"
                    value={values.carro}
                    onChange={(e) => update("carro", e.target.value)}
                    aria-invalid={!!errors.carro}
                    aria-describedby={
                      errors.carro ? `${uid}-carro-err` : `${uid}-carro-help`
                    }
                  />
                  {errors.carro ? (
                    <p id={`${uid}-carro-err`} className="text-[0.8rem] text-accent-hover">
                      {errors.carro}
                    </p>
                  ) : (
                    <p id={`${uid}-carro-help`} className="text-[0.8rem] text-muted">
                      Marca, modelo, ano e uma ideia da quilometragem.
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor={`${uid}-km`} className="text-[0.85rem] text-fg">
                    Quilometragem aproximada
                    <span className="ml-1 text-muted">(opcional)</span>
                  </label>
                  <input
                    id={`${uid}-km`}
                    inputMode="numeric"
                    className={inputBase}
                    value={values.km}
                    onChange={(e) => update("km", e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  className="mt-1 inline-flex h-12 items-center justify-center rounded bg-accent px-6 font-medium text-accent-ink transition-colors duration-200 hover:bg-accent-hover active:translate-y-px"
                >
                  Pedir avaliação
                </button>
                <p className="text-[0.78rem] text-muted">
                  Ao enviar, abrimos o WhatsApp com a mensagem preenchida. Você
                  confere e envia.
                </p>
              </form>
            )}
          </Reveal>
        </div>
      </Container>
    </section>
  );
}

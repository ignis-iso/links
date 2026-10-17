import { useEffect, useState } from "react";
import { links } from "./links.ts";
import {
  diaDaSemana,
  duracao,
  hoje,
  noHorario,
  type Ocorrencia,
  proxima,
  semana,
  somarDias,
  transmissoesDoDia,
} from "./programacao.ts";

const twitch = links.find((l) => l.label === "twitch")!.href;

/** O instante atual, atualizado a cada 30s para os blocos esmaecerem e a frase mudar sozinhos. */
export function useAgora() {
  const [agora, setAgora] = useState(Date.now);
  useEffect(() => {
    const id = setInterval(() => setAgora(Date.now()), 30_000);
    return () => clearInterval(id);
  }, []);
  return agora;
}

const ddmm = (data: string) => `${data.slice(8, 10)}/${data.slice(5, 7)}`;
const abreviado = (data: string) => `${diaDaSemana(data).slice(0, 3)}.`;

function quando(data: string, agora: number) {
  const h = hoje(agora);
  if (data === h) return "hoje";
  if (data === somarDias(h, 1)) return "amanhã";
  if (data <= somarDias(h, 6)) return diaDaSemana(data);
  return `${diaDaSemana(data)}, ${ddmm(data)},`;
}

/** A frase com a próxima transmissão, ou o aviso discreto de que talvez a live esteja rolando. */
export function ProximaTransmissao({ agora }: { agora: number }) {
  if (noHorario(agora)) {
    return (
      <>
        pode ser que eu esteja ao vivo,{" "}
        <a href={twitch} target="_blank" rel="noopener noreferrer" className="underline">
          descubra
        </a>{" "}
        🤫
      </>
    );
  }
  const p = proxima(agora);
  if (!p) return <>sem transmissões agendadas</>;
  return <>a próxima transmissão será {quando(p.data, agora)} às {p.inicio} brt</>;
}

const horario = (o: Ocorrencia) => `${o.inicio} – ${o.fim}`;

export default function Programacao() {
  const agora = useAgora();
  const dias = semana(agora).map((data) => ({ data, transmissoes: transmissoesDoDia(data) }));
  const h = hoje(agora);

  return (
    <div className="w-full">
      <p className="text-lg sm:text-xl">
        <ProximaTransmissao agora={agora} />
      </p>
      <Lista dias={dias} hoje={h} agora={agora} />
      <Grade dias={dias} hoje={h} agora={agora} />
    </div>
  );
}

type Props = {
  dias: { data: string; transmissoes: Ocorrencia[] }[];
  hoje: string;
  agora: number;
};

/** Celular: um bloco por dia, com as transmissões embaixo. */
function Lista({ dias, hoje, agora }: Props) {
  return (
    <ul className="mt-6 flex flex-col gap-4 lg:hidden">
      {dias.map(({ data, transmissoes }) => (
        <li key={data} className={data === hoje ? "border-l-4 border-mint pl-3" : "pl-4"}>
          <h2 className="font-bold">
            {diaDaSemana(data)} {ddmm(data)}
            {data === hoje && <span className="font-normal opacity-70"> · hoje</span>}
          </h2>
          {transmissoes.length === 0
            ? <p className="mt-1 text-sm opacity-40">sem live</p>
            : (
              <ul className="mt-2 flex flex-col gap-2">
                {transmissoes.map((o) => (
                  <li
                    key={o.comeca}
                    className={`border-2 border-mint px-3 py-2 ${o.termina <= agora ? "opacity-40" : ""}`}
                  >
                    <p>{o.titulo}</p>
                    <p className="text-sm opacity-70">
                      {horario(o)}
                      {o.jogo && ` · ${o.jogo}`}
                    </p>
                  </li>
                ))}
              </ul>
            )}
        </li>
      ))}
    </ul>
  );
}

/** Desktop: grade de dias × horas, como a da Twitch. */
function Grade({ dias, hoje, agora }: Props) {
  const todas = dias.flatMap((d) => d.transmissoes);
  const minutosDe = (o: Ocorrencia) => Number(o.inicio.slice(0, 2)) * 60 + Number(o.inicio.slice(3));
  const primeira = todas.length > 0 ? Math.floor(Math.min(...todas.map(minutosDe)) / 60) : 12;
  const ultima = todas.length > 0
    ? Math.ceil(Math.max(...todas.map((o) => minutosDe(o) + duracao(o.inicio, o.fim))) / 60)
    : 24;
  const horas = Array.from({ length: ultima - primeira }, (_, i) => primeira + i);
  const total = (ultima - primeira) * 60;
  const pct = (min: number) => `${(min / total) * 100}%`;

  return (
    <div className="mt-6 hidden border-2 border-mint lg:block">
      <div className="flex border-b-2 border-mint text-sm">
        <div className="w-20 shrink-0 px-2 py-2 text-center opacity-70">brt</div>
        <div className="flex flex-1">
          {horas.map((hora) => (
            <div key={hora} className="flex-1 border-l border-mint/20 px-2 py-2">
              {String(hora % 24).padStart(2, "0")}:00
            </div>
          ))}
        </div>
      </div>
      {dias.map(({ data, transmissoes }) => (
        <div
          key={data}
          className={`flex h-20 border-b border-mint/20 last:border-b-0 ${
            data === hoje ? "bg-mint/5" : ""
          }`}
        >
          <div
            className={`flex w-20 shrink-0 flex-col items-center justify-center text-sm ${
              data === hoje ? "border-r-4 border-mint font-bold" : "border-r-4 border-transparent"
            }`}
          >
            <span>{abreviado(data)}</span>
            <span>{ddmm(data)}</span>
          </div>
          <div className="relative flex-1">
            {horas.map((hora, i) => (
              <div
                key={hora}
                className="absolute inset-y-0 border-l border-mint/10"
                style={{ left: pct(i * 60) }}
              />
            ))}
            {transmissoes.map((o) => (
              <div
                key={o.comeca}
                className={`absolute inset-y-2 overflow-hidden border-2 border-mint bg-ink px-2 py-1 ${
                  o.termina <= agora ? "opacity-40" : ""
                }`}
                style={{
                  left: pct(minutosDe(o) - primeira * 60),
                  width: pct(duracao(o.inicio, o.fim)),
                }}
                title={`${o.titulo} · ${horario(o)}${o.jogo ? ` · ${o.jogo}` : ""}`}
              >
                <p className="truncate text-sm">{o.titulo}</p>
                <p className="truncate text-xs opacity-70">
                  {horario(o)}
                  {o.jogo && ` · ${o.jogo}`}
                </p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

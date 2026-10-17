// Regras da programação (ver CONTEXT.md): transforma schedule.ts em transmissões com data e hora.
// Tudo é calculado em horário de Brasília, que é UTC-3 fixo (sem horário de verão desde 2019).
import { type Avulsa, avulsas, type DiaDaSemana, type Recorrente, recorrentes } from "./schedule.ts";

const BRT = -3 * 60 * 60 * 1000;
const DIA = 24 * 60 * 60 * 1000;

// Índice de Date.getUTCDay(): domingo = 0.
export const DIAS: DiaDaSemana[] = [
  "domingo",
  "segunda",
  "terça",
  "quarta",
  "quinta",
  "sexta",
  "sábado",
];

/** Uma transmissão já posicionada numa data, com instantes absolutos de início e fim. */
export type Ocorrencia = {
  titulo: string;
  jogo?: string;
  data: string;
  inicio: string;
  fim: string;
  comeca: number;
  termina: number;
};

const minutos = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

/** Duração em minutos, contando a virada da meia-noite quando o fim é menor que o início. */
export const duracao = (inicio: string, fim: string) => {
  const d = minutos(fim) - minutos(inicio);
  return d > 0 ? d : d + 24 * 60;
};

/** Meia-noite (BRT) da data AAAA-MM-DD como instante absoluto. */
const meiaNoite = (data: string) => Date.parse(`${data}T00:00:00Z`) - BRT;

export const hoje = (agora: number) => new Date(agora + BRT).toISOString().slice(0, 10);

export const somarDias = (data: string, n: number) =>
  new Date(Date.parse(`${data}T00:00:00Z`) + n * DIA).toISOString().slice(0, 10);

export const diaDaSemana = (data: string) => DIAS[new Date(`${data}T00:00:00Z`).getUTCDay()];

/** As transmissões de uma data: as avulsas dela, ou, se não houver, as recorrentes do dia da semana. */
export function transmissoesDoDia(data: string): Ocorrencia[] {
  const doDia: (Avulsa | Recorrente)[] = avulsas.filter((a) => a.data === data);
  const lista = doDia.length > 0 ? doDia : recorrentes.filter((r) => r.dia === diaDaSemana(data));
  return lista
    .map(({ titulo, jogo, inicio, fim }) => {
      const comeca = meiaNoite(data) + minutos(inicio) * 60_000;
      return { titulo, jogo, data, inicio, fim, comeca, termina: comeca + duracao(inicio, fim) * 60_000 };
    })
    .sort((a, b) => a.comeca - b.comeca);
}

/** As datas de segunda a domingo da semana que contém `agora`. */
export function semana(agora: number): string[] {
  const h = hoje(agora);
  const segunda = somarDias(h, -((DIAS.indexOf(diaDaSemana(h)) + 6) % 7));
  return Array.from({ length: 7 }, (_, i) => somarDias(segunda, i));
}

/** A transmissão cujo horário inclui `agora`, se houver. Olha ontem por causa das que viram a noite. */
export function noHorario(agora: number): Ocorrencia | undefined {
  const h = hoje(agora);
  return [...transmissoesDoDia(somarDias(h, -1)), ...transmissoesDoDia(h)].find(
    (o) => o.comeca <= agora && agora < o.termina,
  );
}

/** A primeira transmissão que ainda não começou, procurando além da semana exibida. */
export function proxima(agora: number): Ocorrencia | undefined {
  const h = hoje(agora);
  for (let i = 0; i <= 366; i++) {
    const o = transmissoesDoDia(somarDias(h, i)).find((o) => o.comeca > agora);
    if (o) return o;
  }
}

const HORARIO = /^([01]\d|2[0-3]):[0-5]\d$/;

/** Problemas em schedule.ts, em mensagens legíveis. Lista vazia = tudo certo. */
export function validar(): string[] {
  const erros: string[] = [];
  const todas: [string, Avulsa | Recorrente][] = [
    ...recorrentes.map((r) => [`recorrente de ${r.dia}`, r] as [string, Recorrente]),
    ...avulsas.map((a) => [`avulsa de ${a.data}`, a] as [string, Avulsa]),
  ];

  for (const [onde, t] of todas) {
    const nome = `${onde} "${t.titulo}"`;
    if (!t.titulo?.trim()) erros.push(`${onde}: falta o título`);
    if (!DIAS.includes((t as Recorrente).dia) && !("data" in t)) erros.push(`${nome}: dia inválido`);
    if ("data" in t) {
      const d = new Date(`${t.data}T00:00:00Z`);
      const ok = /^\d{4}-\d{2}-\d{2}$/.test(t.data) && !isNaN(d.getTime()) &&
        d.toISOString().startsWith(t.data);
      if (!ok) erros.push(`${nome}: data "${t.data}" inválida, use AAAA-MM-DD`);
    }
    for (const campo of ["inicio", "fim"] as const) {
      if (!HORARIO.test(t[campo])) erros.push(`${nome}: ${campo} "${t[campo]}" inválido, use HH:MM`);
    }
    if (t.inicio === t.fim) erros.push(`${nome}: início e fim iguais`);
  }
  if (erros.length > 0) return erros;

  // Sobreposição entre transmissões do mesmo dia (mesma data, ou mesmo dia da semana).
  const grupos = new Map<string, (Avulsa | Recorrente)[]>();
  for (const [onde, t] of todas) grupos.set(onde, [...(grupos.get(onde) ?? []), t]);
  for (const [onde, lista] of grupos) {
    const faixas = lista
      .map((t) => [minutos(t.inicio), minutos(t.inicio) + duracao(t.inicio, t.fim), t.titulo] as const)
      .sort((a, b) => a[0] - b[0]);
    for (let i = 1; i < faixas.length; i++) {
      if (faixas[i][0] < faixas[i - 1][1]) {
        erros.push(`${onde}: "${faixas[i - 1][2]}" e "${faixas[i][2]}" se cruzam`);
      }
    }
  }
  return erros;
}

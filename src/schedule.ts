// Programação das lives. Todos os horários em horário de Brasília (BRT).
//
// - recorrentes: se repetem toda semana no `dia` indicado.
// - avulsas: acontecem uma vez na `data` (AAAA-MM-DD) e substituem todas as recorrentes daquele dia.
//
// `inicio` e `fim` no formato "HH:MM". Se `fim` for menor que `inicio`, a live termina no dia
// seguinte (ex.: 21:00 → 01:00), mas continua pertencendo ao dia em que começou.
// `jogo` é opcional. O build quebra se algo estiver inválido ou se duas lives do mesmo dia se cruzarem.

export type DiaDaSemana =
  | "segunda"
  | "terça"
  | "quarta"
  | "quinta"
  | "sexta"
  | "sábado"
  | "domingo";

type Transmissao = { titulo: string; jogo?: string; inicio: string; fim: string };
export type Recorrente = Transmissao & { dia: DiaDaSemana };
export type Avulsa = Transmissao & { data: string };

export const recorrentes: Recorrente[] = [
  { dia: "quarta", inicio: "20:00", fim: "23:00", titulo: "13 / live de quarta", jogo: "a ser decidido" },
  { dia: "quinta", inicio: "20:00", fim: "23:00", titulo: "14 / live de quinta", jogo: "a ser decidido" },
  { dia: "sexta", inicio: "20:00", fim: "23:00", titulo: "15 / live de sexta", jogo: "a ser decidido" },
  // { dia: "sábado", inicio: "18:00", fim: "21:00", titulo: "16 / live de sábado", jogo: "a ser decidido" },
];

export const avulsas: Avulsa[] = [
  // { data: "2026-10-18", inicio: "19:00", fim: "22:00", titulo: "16.5 / live quântica", jogo: "a ser decidido" },
];

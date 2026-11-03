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

export const recorrentes: Recorrente[] = 
  // populaRecorrentes(diasComLive);
  [
    {
      dia: 'terça',
      inicio: "19:30",
      fim: "22:00",
      titulo: '19 / olhos 👀 / casa montanha',
      jogo: "quem sabe? eu, e é minecraft"
    },
    {
      dia: 'quarta',
      inicio: "19:30",
      fim: "22:00",
      titulo: '20 / adivinha',
      jogo: "games"
    },
    {
      dia: 'quinta',
      inicio: "19:30",
      fim: "22:00",
      titulo: '21 I / opa',
      jogo: "jogos"
    },
    {
      dia: 'sexta',
      inicio: "19:30",
      fim: "22:00",
      titulo: '21 II / é',
      jogo: "jogos"
    },
    {
      dia: 'sábado',
      inicio: "19:30",
      fim: "22:00",
      titulo: '23 / sim',
      jogo: "jogos"
    },
  ]
  ;

export const avulsas: Avulsa[] = [
  // { data: "2026-10-18", inicio: "19:00", fim: "22:00", titulo: "16.5 / live quântica", jogo: "a ser decidido" },
];

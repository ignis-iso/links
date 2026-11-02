// Comandos do chat da live.
export type Comando = { nome: string; descricao: string };

export const comandos: Comando[] = [
  { nome: "!comandos", descricao: "fala o link pra exatamente essa página :)" },
  { nome: "!sens", descricao: "fala a minha sens do overwatch e dpi do mouse" },
  { nome: "!perif", descricao: "fala a lista de periféricos" },
  { nome: "!seed", descricao: "fala a seed do mundo do servidor" },
  { nome: "!mods", descricao: "fala o link para a lista de mods" },
];

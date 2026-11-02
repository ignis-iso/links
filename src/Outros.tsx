import { mods, urlDoMod } from "./mods.ts";

// Cada tela tem o próprio endereço: #outros/<id>.
export const telas = [
  { id: "mods-minecraft", nome: "lista de mods do minecraft (26.3)", Conteudo: ModsMinecraft },
];

export default function Outros({ tela }: { tela?: string }) {
  const aberta = telas.find((t) => t.id === tela);
  if (aberta) {
    return (
      <div className="w-full">
        <a href="#outros" className="text-sm underline">{"<"} voltar</a>
        <h1 className="mt-4 text-xl font-bold sm:text-2xl">{aberta.nome}</h1>
        <aberta.Conteudo />
      </div>
    );
  }
  return (
    <ul className="flex w-full flex-col gap-4">
      {telas.map(({ id, nome }) => (
        <li key={id}>
          <a
            href={`#outros/${id}`}
            className="block border-2 border-mint px-5 py-3 text-lg transition-colors hover:bg-mint hover:text-ink focus-visible:bg-mint focus-visible:text-ink focus-visible:outline-none"
          >
            {nome}
          </a>
        </li>
      ))}
    </ul>
  );
}

function ModsMinecraft() {
  return (
    <ul className="mt-6 border-2 border-mint">
      {mods.map((mod) => (
        <li key={mod.id} className="border-b border-mint/20 last:border-b-0">
          <a
            href={urlDoMod(mod)}
            target="_blank"
            rel="noopener noreferrer"
            className="block px-3 py-2 break-words transition-colors hover:bg-mint hover:text-ink focus-visible:bg-mint focus-visible:text-ink focus-visible:outline-none"
          >
            <p>{mod.nome}</p>
            <p className="text-sm opacity-70">{mod.versao} · por {mod.autores}</p>
          </a>
        </li>
      ))}
    </ul>
  );
}

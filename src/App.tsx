import { useEffect, useState } from "react";
import { links } from "./links.ts";
import Outros, { telas } from "./Outros.tsx";
import Programacao, { ProximaTransmissao, useAgora } from "./Programacao.tsx";

const wisp = `${import.meta.env.BASE_URL}wisp.png`;

const abas = [
  { id: "links", nome: "links" },
  // { id: "programacao", nome: "agenda de lives" },
  { id: "outros", nome: "outros" },
];

// Uma rota é uma aba ou uma tela dentro de outros (outros/<id>).
const rotas = [...abas.map((a) => a.id), ...telas.map((t) => `outros/${t.id}`)];

// A rota fica no hash da URL (#programacao) pra dar pra mandar o link direto. Sem hash, abre em links.
const rotaDoHash = () => {
  const hash = location.hash.slice(1);
  return rotas.includes(hash) ? hash : "links";
};

function useRota() {
  const [rota, setRota] = useState(rotaDoHash);
  useEffect(() => {
    const atualizar = () => setRota(rotaDoHash());
    addEventListener("hashchange", atualizar);
    return () => removeEventListener("hashchange", atualizar);
  }, []);
  return rota;
}

const larguraDa = (rota: string) => {
  if (rota === "programacao") return "max-w-6xl";
  return rota.startsWith("outros/") ? "max-w-3xl" : "max-w-md";
};

// Quanto dura o fade de saída do conteúdo antes de trocar de rota (o resto anima em CSS).
const SAIDA_MS = 120;
const semMovimento = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

// A rota exibida segue a rota do hash com um atraso: primeiro o conteúdo some, depois troca
// (largura e alinhamento mudam com ele invisível) e o novo conteúdo entra com fade.
function useTroca(rota: string) {
  const [exibida, setExibida] = useState(rota);
  const [trocou, setTrocou] = useState(false); // no carregamento inicial não anima
  const saindo = exibida !== rota;
  useEffect(() => {
    if (!saindo) return;
    const trocar = () => {
      setExibida(rota);
      setTrocou(true);
    };
    if (semMovimento()) return trocar();
    const id = setTimeout(trocar, SAIDA_MS);
    return () => clearTimeout(id);
  }, [rota, saindo]);
  return { exibida, saindo, animar: trocou && !semMovimento() };
}

export default function App() {
  const rota = useRota();
  const aba = rota.split("/")[0];
  const { exibida, saindo, animar } = useTroca(rota);

  return (
    <div className="min-h-dvh p-3 sm:p-6">
      <div
        className={`mx-auto flex min-h-[calc(100dvh-1.5rem)] flex-col transition-[max-width] duration-300 ease-out motion-reduce:transition-none sm:min-h-[calc(100dvh-3rem)] ${
          larguraDa(exibida)
        }`}
      >
        <nav className="flex">
          {abas.map(({ id, nome }) => (
            <a
              key={id}
              href={`#${id}`}
              aria-current={aba === id ? "page" : undefined}
              className={`-ml-1 border-4 border-b-0 border-mint px-2 py-1 first:ml-0 sm:px-4 focus-visible:outline-none ${
                aba === id ? "bg-mint text-ink" : "hover:bg-mint/15 focus-visible:bg-mint/15"
              }`}
            >
              {nome}
            </a>
          ))}
        </nav>
        <main
          className={`flex flex-1 flex-col items-center border-4 border-mint px-5 py-10 ${
            exibida === "links" ? "justify-center" : "justify-start"
          }`}
        >
          {
            /* A key remonta o wrapper a cada troca, reiniciando a animação de entrada.
              No celular a entrada é só fade; a partir de sm o conteúdo também sobe um pouco. */
          }
          <div
            key={exibida}
            className={`flex w-full flex-col items-center transition-opacity duration-[120ms] ease-in ${
              saindo ? "opacity-0" : ""
            } ${
              animar && !saindo
                ? "animate-[aparecer_260ms_ease-out_80ms_both] sm:animate-[entrar_260ms_ease-out_80ms_both]"
                : ""
            }`}
          >
            {exibida === "links"
              ? <Links />
              : exibida === "programacao"
              ? <Programacao />
              : <Outros tela={exibida.split("/")[1]} />}
          </div>
        </main>
      </div>
    </div>
  );
}

function Links() {
  const agora = useAgora();
  return (
    <>
      <img src={wisp} alt="wisp, o mascote do ignis_iso" className="size-36 sm:size-44" />

      <h1 className="mt-2 text-3xl font-bold">
        {">./"}ignis_iso
        <span className="ml-0.5 animate-[blink_1s_steps(1)_infinite]">|</span>
      </h1>
      <p className="mt-2 text-center text-xs opacity-50">
        <i>era pra ser .iso mas nenhuma plataforma deixa</i>
      </p>
      <p className="mt-2 text-center text-sm opacity-70">
        confere meus links e a programação
      </p>

      <ul className="mt-10 flex w-full flex-col gap-4">
        {links.map(({ label, href, icon }) => (
          <li key={label}>
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 border-2 border-mint px-5 py-3 text-lg transition-colors hover:bg-mint hover:text-ink focus-visible:bg-mint focus-visible:text-ink focus-visible:outline-none"
            >
              <span aria-hidden className="w-6 shrink-0 text-center text-xl">{icon}</span>
              <span>{label}</span>
            </a>
          </li>
        ))}
      </ul>

      <p className="mt-8 text-center text-sm opacity-70">
        <ProximaTransmissao agora={agora} />
      </p>
    </>
  );
}

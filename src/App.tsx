import { links } from "./links.ts";

const wisp = `${import.meta.env.BASE_URL}wisp.png`;

export default function App() {
  return (
    <div className="min-h-dvh p-3 sm:p-6">
      <main className="mx-auto flex min-h-[calc(100dvh-1.5rem)] max-w-md flex-col items-center justify-center border-4 border-mint px-5 py-10 sm:min-h-[calc(100dvh-3rem)]">
        <img src={wisp} alt="wisp, o mascote do ignis_iso" className="size-36 sm:size-44" />

        <h1 className="mt-2 text-3xl font-bold">
          {"|>"}ignis_iso
          <span className="ml-0.5 animate-[blink_1s_steps(1)_infinite]">|</span>
        </h1>
        <p className="mt-2 text-center text-sm opacity-70">
          eu gosto de overwatch, warframe e da minha esposa
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
          lives de segunda a sexta de noite e sábado à qualquer momento kk
        </p>
      </main>
    </div>
  );
}

# ignis_iso · links

landing page de links do ignis_iso. deno + react + typescript + tailwind css, publicada no github pages.

## rodar

```sh
deno install
deno task dev      # servidor local
deno task build    # gera o site estático em dist/
```

os links ficam em `src/links.ts`. os ícones são glifos da jetbrains mono nerd font
(códigos em https://www.nerdfonts.com/cheat-sheet).

## deploy

o workflow `.github/workflows/deploy.yml` publica no pages a cada push na `main`.
no repositório, em settings → pages, escolha "github actions" como source.

a fonte jetbrains mono nerd font é distribuída sob a sil open font license (`public/fonts/OFL.txt`).

// Roda antes do build: se src/schedule.ts tiver algo inválido, o deploy para aqui.
import { validar } from "../src/programacao.ts";

const erros = validar();
if (erros.length > 0) {
  console.error("src/schedule.ts tem problemas:\n" + erros.map((e) => `  - ${e}`).join("\n"));
  Deno.exit(1);
}
console.log("src/schedule.ts ok");

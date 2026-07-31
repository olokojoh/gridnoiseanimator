import { rm } from "node:fs/promises";
import { resolve } from "node:path";
import { build } from "esbuild";

const pagesOutput = resolve("dist/client");

await rm(resolve(pagesOutput, "_worker"), { recursive: true, force: true });
await build({
  entryPoints: [resolve("dist/server/index.js")],
  outfile: resolve(pagesOutput, "_worker.js"),
  bundle: true,
  format: "esm",
  platform: "browser",
  target: "es2022",
  external: ["node:*"],
  logLevel: "silent",
});

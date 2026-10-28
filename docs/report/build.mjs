/**
 * Gera docs/RELATORIO_TECNICO_SAITE.pdf a partir de docs/report/relatorio.html.
 *
 *   cd frontend && node ../docs/report/build.mjs
 *
 * Injeta dados reais: commits do branch (git log), resultados de docs/avaliacao/*.json,
 * capturas de docs/screenshots e a data de geração. Usa o Playwright/Chromium do frontend.
 */
import { execSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const docs = path.resolve(here, "..");
const root = path.resolve(docs, "..");
const require = createRequire(path.join(root, "frontend", "package.json"));
const { chromium } = require("playwright");

const escape = (text) =>
  String(text).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

const date = new Date().toLocaleString("pt-BR", { dateStyle: "long", timeStyle: "short", timeZone: "UTC" }) + " (UTC)";

const log = execSync('git log --reverse --format="%h|%s" ec858e81..HEAD', { cwd: root, encoding: "utf8" })
  .trim()
  .split("\n")
  .filter(Boolean)
  .map((line) => line.split("|"));
const commits = log.map(([hash, subject]) => `<tr><td><code>${hash}</code></td><td>${escape(subject)}</td></tr>`).join("");

const order = ["qwen2.5_0.5b", "qwen2.5_1.5b", "qwen2.5_7b"];
const evals = readdirSync(path.join(docs, "avaliacao"))
  .filter((name) => name.endsWith(".json"))
  .map((name) => JSON.parse(readFileSync(path.join(docs, "avaliacao", name), "utf8")).summary)
  .sort((a, b) => order.indexOf(a.chat_model.replace(":", "_")) - order.indexOf(b.chat_model.replace(":", "_")));
const pct = (value) => (value === null || value === undefined ? "—" : `${Math.round(value * 100)}%`);
const evalRows = evals
  .map(
    (s) => `<tr><td>${s.chat_model}</td><td>${s.embed_model}</td><td>${pct(s.retrieval_hit_rate)}</td><td>${pct(s.faithfulness_fact_rate)}</td>
<td>${pct(s.citation_rate)}</td><td>${pct(s.citation_precision)}</td><td>${pct(s.no_evidence_admitted_rate)}</td><td>${s.latency_p50_s} s</td></tr>`,
  )
  .join("");

let html = readFileSync(path.join(here, "relatorio.html"), "utf8")
  .replaceAll("{{DATE}}", date)
  .replace("{{COMMITS}}", commits)
  .replace("{{COMMIT_COUNT}}", String(log.length))
  .replace("{{EVAL_ROWS}}", evalRows)
  .replace(/\{\{IMG:([\w-]+)\}\}/g, (_, name) => {
    const file = path.join(docs, "screenshots", `${name}.png`);
    if (!existsSync(file)) return "";
    return `data:image/png;base64,${readFileSync(file).toString("base64")}`;
  });

const browser = await chromium.launch();
const page = await browser.newPage();
await page.setContent(html, { waitUntil: "load" });
const output = path.join(docs, "RELATORIO_TECNICO_SAITE.pdf");
await page.pdf({
  path: output,
  format: "A4",
  printBackground: true,
  margin: { top: "16mm", bottom: "18mm", left: "16mm", right: "16mm" },
  displayHeaderFooter: true,
  headerTemplate: "<span></span>",
  footerTemplate:
    '<div style="width:100%;font-size:8px;color:#6b7789;padding:0 16mm;display:flex;justify-content:space-between;font-family:sans-serif"><span>S.A.I.T.E. — Relatório técnico</span><span class="pageNumber"></span></div>',
});
await browser.close();
console.log(`PDF gerado: ${output}`);

/**
 * Testes de interface ponta a ponta do S.A.I.T.E. (Playwright + axe-core).
 *
 * Pré-requisitos: backend em http://localhost:8000 configurado como em produção
 * (PostgreSQL, SAITE_ACCESS_PASSWORD, provedor de IA) e frontend em
 * http://localhost:3000 (`npm run start`).
 *
 *   SAITE_E2E_PASSWORD=... node e2e/run.mjs [--screens ../docs/screenshots]
 *
 * Usa o sistema real (sem mocks), exceto no cenário "backend offline", em que
 * as requisições ao backend são bloqueadas no navegador para exibir o estado de erro.
 */
import { createRequire } from "node:module";
import { mkdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
const axeSource = readFileSync(require.resolve("axe-core/axe.min.js"), "utf8");

const here = path.dirname(fileURLToPath(import.meta.url));
const BASE = process.env.SAITE_UI_URL || "http://localhost:3000";
const screensArg = process.argv.indexOf("--screens");
const SCREENS = screensArg > -1 ? path.resolve(process.argv[screensArg + 1]) : null;
if (SCREENS) mkdirSync(SCREENS, { recursive: true });

const PASSWORD = process.env.SAITE_E2E_PASSWORD || "";

/** Faz login se a tela de entrada aparecer (cada contexto do navegador = um dispositivo). */
async function loginIfNeeded(target) {
  const field = target.getByPlaceholder("Senha");
  const visible = await field.waitFor({ timeout: 8000 }).then(() => true, () => false);
  if (!visible) return false;
  await field.fill(PASSWORD);
  await target.getByRole("button", { name: "Entrar", exact: true }).click();
  await field.waitFor({ state: "detached", timeout: 15000 });
  return true;
}

const results = [];
async function step(name, fn) {
  const started = Date.now();
  try {
    const note = await fn();
    results.push({ name, ok: true, ms: Date.now() - started, note });
    console.log(`✓ ${name}${note ? ` — ${note}` : ""}`);
  } catch (error) {
    // Captura da tela no momento da falha, para diagnóstico.
    await page.screenshot({ path: path.join(SCREENS || here, `falha-${results.length + 1}.png`) }).catch(() => {});
    results.push({ name, ok: false, ms: Date.now() - started, note: error.message.split("\n")[0] });
    console.log(`✗ ${name} — ${error.message.split("\n")[0]}`);
  }
}

async function shot(page, name) {
  await page.waitForTimeout(400); // captura depois das animações de entrada
  if (SCREENS) await page.screenshot({ path: path.join(SCREENS, `${name}.png`) });
}

async function axe(page) {
  // Espera as animações de entrada terminarem: com opacidade parcial o contraste medido é menor.
  await page.waitForTimeout(600);
  await page.addScriptTag({ content: axeSource });
  const { violations } = await page.evaluate(() =>
    window.axe.run(document, { runOnly: ["wcag2a", "wcag2aa"], resultTypes: ["violations"] }),
  );
  return violations.filter((v) => ["serious", "critical"].includes(v.impact));
}

async function setTheme(page, theme) {
  await page.evaluate((value) => localStorage.setItem("saite-theme", value), theme);
  await page.reload();
}

const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: "pt-BR" });
const page = await context.newPage();
const consoleErrors = [];
page.on("console", (message) => message.type() === "error" && consoleErrors.push(message.text()));

await step("Login: senha errada é recusada e a correta libera o app", async () => {
  await page.goto(BASE);
  await page.getByPlaceholder("Senha").waitFor({ timeout: 60000 });
  await shot(page, "00-login");
  await page.getByPlaceholder("Senha").fill("senha-errada");
  await page.getByRole("button", { name: "Entrar", exact: true }).click();
  await page.getByRole("alert").filter({ hasText: "Senha incorreta" }).waitFor();
  await loginIfNeeded(page);
  return "sessão criada";
});

await step("Tela inicial mostra estado real da IA", async () => {
  await setTheme(page, "dark");
  await page.getByRole("heading", { name: "Como posso ajudar?" }).waitFor();
  const model = await page.locator("aside").getByText(/qwen|llama|mistral|gemma|phi|gemini/i).first().textContent();
  await shot(page, "01-inicio-escuro");
  await setTheme(page, "light");
  await page.getByRole("heading", { name: "Como posso ajudar?" }).waitFor();
  await shot(page, "02-inicio-claro");
  await setTheme(page, "dark");
  return `modelo exibido: ${model}`;
});

await step("Acessibilidade (axe, WCAG A/AA) — tela inicial nos dois temas", async () => {
  const found = [];
  for (const theme of ["dark", "light"]) {
    await setTheme(page, theme);
    await page.getByRole("status", { name: "Carregando conversas" }).waitFor({ state: "detached" });
    found.push(...(await axe(page)).map((v) => `${theme}: ${v.id} (${v.nodes.length})`));
  }
  await setTheme(page, "dark");
  if (found.length) throw new Error(found.join(", "));
  return "0 violações sérias/críticas (escuro e claro)";
});

let conversationUrl = "";
await step("Chat: envia mensagem, recebe resposta em streaming e persiste", async () => {
  await page.getByLabel("Mensagem para a IA").fill("Responda em uma frase: o que é um assistente pessoal?");
  await page.keyboard.press("Enter");
  await page.waitForURL(/\?c=/);
  await page.getByRole("button", { name: "Parar geração" }).waitFor({ timeout: 10000 });
  await page.getByRole("button", { name: "Enviar mensagem" }).waitFor({ timeout: 120000 });
  conversationUrl = page.url();
  const answer = await page.locator(".animate-fade-up").last().innerText();
  await shot(page, "03-chat-resposta");
  await page.reload();
  await page.getByText("o que é um assistente pessoal?").last().waitFor();
  const violations = await axe(page);
  if (violations.length) throw new Error(`axe na conversa: ${violations.map((v) => v.id).join(", ")}`);
  return `resposta: ${answer.slice(0, 60).replace(/\n/g, " ")}…`;
});

await step("Chat: a conversa aparece no histórico da barra lateral", async () => {
  const id = new URL(conversationUrl).searchParams.get("c");
  await page.locator(`aside a[href="/?c=${id}"]`).waitFor();
});

await step("Aprender: upload real é processado e indexado", async () => {
  await page.goto(`${BASE}/aprender`);
  const corpus = path.resolve(here, "../../backend/eval/corpus/robo_zeta.md");
  await page.locator('input[type="file"]').setInputFiles(corpus);
  await page.getByText("Indexado", { exact: true }).first().waitFor({ timeout: 120000 });
  await page.getByLabel("Pergunta de teste").fill("quanto tempo dura a bateria?");
  await page.getByRole("button", { name: "Buscar" }).click();
  await page.locator("ol li").filter({ hasText: "Seção: Bateria" }).first().waitFor();
  await shot(page, "04-aprender");
  const violations = await axe(page);
  if (violations.length) throw new Error(`axe: ${violations.map((v) => v.id).join(", ")}`);
  return "robo_zeta.md indexado; busca retornou a seção Bateria; axe sem violações";
});

await step("Chat com RAG: resposta mostra as fontes do documento", async () => {
  await page.goto(BASE);
  await page.getByLabel("Mensagem para a IA").fill("Quanto tempo dura a bateria do robô Zeta?");
  await page.keyboard.press("Enter");
  await page.getByRole("button", { name: "Enviar mensagem" }).waitFor({ timeout: 120000 });
  const sources = page.getByRole("button", { name: /fonte\(s\) citada\(s\)|trecho\(s\) consultado\(s\)/ }).last();
  await sources.click();
  await page.getByText("robo_zeta.md").first().waitFor();
  await shot(page, "05-chat-fontes");
  const text = await page.locator(".animate-fade-up").filter({ hasText: "14" }).count();
  return text ? "resposta contém '14' e lista robo_zeta.md como fonte" : "fonte listada (modelo não repetiu o número)";
});

await step("Projetos: cria projeto e abre o detalhe", async () => {
  await page.goto(`${BASE}/projetos`);
  await page.getByRole("button", { name: /Novo projeto|Criar projeto/ }).first().click();
  await page.getByLabel("Nome").fill("Reforma da casa");
  await page.getByLabel("Instruções para a IA neste projeto").fill("Responda com listas de tarefas.");
  await page.getByRole("button", { name: "Criar", exact: true }).click();
  await page.getByRole("heading", { name: "Reforma da casa" }).waitFor();
  await page.getByText("Conhecimento do projeto").waitFor();
  await shot(page, "06-projeto");
  const violations = await axe(page);
  if (violations.length) throw new Error(`axe: ${violations.map((v) => v.id).join(", ")}`);
});

await step("Histórico: busca por conteúdo da mensagem", async () => {
  await page.goto(`${BASE}/historico`);
  await page.getByLabel("Pesquisar no histórico").fill("bateria");
  await page.getByText(/bateria do robô Zeta/).first().waitFor();
  await shot(page, "07-historico");
});

await step("Computador: indisponibilidade na nuvem é informada (sem dados falsos)", async () => {
  await page.goto(`${BASE}/configuracoes#agente`);
  await page.getByText("Acesso ao computador: em breve").waitFor();
  await page.goto(BASE);
  await page.getByRole("button", { name: "Anexar e ferramentas" }).click();
  const disabled = await page.getByRole("menuitemcheckbox", { name: /Usar computador/ }).isDisabled();
  await page.keyboard.press("Escape");
  if (!disabled) throw new Error("'Usar computador' deveria estar desativado");
});

await step("Sincronização: outro dispositivo vê a mesma conversa", async () => {
  const other = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const second = await other.newPage();
  await second.goto(`${BASE}/historico`);
  await loginIfNeeded(second);
  await second.getByText(/bateria do robô Zeta/).first().waitFor({ timeout: 20000 });
  await second.getByText(/bateria do robô Zeta/).first().click();
  await second.getByText(/14 horas/).first().waitFor();
  await other.close();
  return "histórico e mensagens iguais no segundo dispositivo";
});

await step("Sessão: sair deste dispositivo volta para o login", async () => {
  const other = await browser.newContext();
  const temp = await other.newPage();
  await temp.goto(`${BASE}/configuracoes`);
  await loginIfNeeded(temp);
  await temp.getByRole("button", { name: "Sair deste dispositivo" }).click();
  await temp.getByPlaceholder("Senha").waitFor();
  await other.close();
});

await step("Estado de erro: backend offline é informado (sem simular respostas)", async () => {
  const offline = await context.newPage();
  await offline.route("http://localhost:8000/**", (route) => route.abort());
  await offline.goto(BASE);
  await offline.getByText("Servidor indisponível").waitFor({ timeout: 30000 });
  const disabled = await offline.getByLabel("Mensagem para a IA").isDisabled();
  await offline.screenshot({ path: SCREENS ? path.join(SCREENS, "10-backend-offline.png") : undefined });
  await offline.close();
  if (!disabled) throw new Error("campo de mensagem deveria ficar desativado");
});

await step("Responsivo (390×844): gaveta de navegação e chat", async () => {
  const mobile = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  const phone = await mobile.newPage();
  await phone.goto(conversationUrl);
  await loginIfNeeded(phone);
  await phone.getByText("o que é um assistente pessoal?").last().waitFor();
  const overflow = await phone.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  if (SCREENS) await phone.screenshot({ path: path.join(SCREENS, "11-mobile-chat.png") });
  await phone.getByRole("button", { name: "Abrir menu" }).click();
  await phone.getByRole("link", { name: "Aprender" }).waitFor();
  if (SCREENS) await phone.screenshot({ path: path.join(SCREENS, "12-mobile-menu.png") });
  await mobile.close();
  if (overflow) throw new Error("há rolagem horizontal no mobile");
  return "sem rolagem horizontal";
});

await step("Movimento reduzido: animações desativadas", async () => {
  const reduced = await browser.newContext({ reducedMotion: "reduce" });
  const calm = await reduced.newPage();
  await calm.goto(BASE);
  await loginIfNeeded(calm);
  const duration = await calm.evaluate(() => {
    const element = document.querySelector(".animate-fade-up");
    return element ? getComputedStyle(element).animationDuration : "0s";
  });
  await reduced.close();
  if (!["0.001s", "1ms", "0s"].includes(duration)) throw new Error(`duração ${duration}`);
  return `duração efetiva ${duration}`;
});

await browser.close();

const relevantErrors = consoleErrors.filter((text) => !text.includes("ERR_FAILED"));
console.log(`\nErros de console: ${relevantErrors.length}`);
relevantErrors.slice(0, 5).forEach((text) => console.log("  ", text.slice(0, 200)));
const failed = results.filter((result) => !result.ok);
console.log(`\n${results.length - failed.length}/${results.length} cenários aprovados`);
console.log(JSON.stringify(results));
process.exit(failed.length ? 1 : 0);

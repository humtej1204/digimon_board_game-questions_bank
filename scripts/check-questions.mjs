import { DEMO_LIMIT_PER_LEVEL, FILTER_GROUPS, LEVELS, QUESTIONS } from "../js/data.js";

const MINIMUM = 6;
const IDEAL = 10;
const enforce = process.argv.includes("--enforce");
const selectedGroupLabel = process.argv.includes("--general")
  ? "Temas generales"
  : process.argv.includes("--anime")
    ? "Anime"
    : process.argv.includes("--literature")
      ? "Manga, cómics y novelas"
      : process.argv.includes("--games")
        ? "Juegos con historia"
        : null;
const filters = FILTER_GROUPS.flatMap((group) => group.filters);
const reportFilters = selectedGroupLabel
  ? FILTER_GROUPS.find((group) => group.label === selectedGroupLabel).filters
  : filters;
const EDITORIAL_TRIVIA = /\b(?:capitulos?|episodios?|volumen(?:es)?|tomos?|revistas?|publicacion(?:es)?)\b|\b(?:quien|que autor)\s+(?:escribio|dibujo|ilustro|publico)\b/;
const validTags = new Set(filters.map((filter) => filter.id));
const coverage = new Map(filters.map((filter) => [filter.id, Array(LEVELS.length).fill(0)]));
const seenQuestions = new Map();
const problems = [];
let total = 0;

function normalize(value) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

for (const { value: level } of LEVELS) {
  const questions = QUESTIONS[level] ?? [];
  if (questions.length < DEMO_LIMIT_PER_LEVEL) {
    problems.push(`Nivel ${level}: faltan preguntas para completar las ${DEMO_LIMIT_PER_LEVEL} demo.`);
  }
  for (const [index, item] of questions.entries()) {
    total++;
    const location = `nivel ${level}, pregunta ${index + 1}`;
    if (typeof item.question !== "string" || !item.question.trim()) problems.push(`${location}: pregunta vacía.`);
    if (typeof item.answer !== "string" || !item.answer.trim()) problems.push(`${location}: respuesta vacía.`);
    if (!Array.isArray(item.tags) || item.tags.length === 0) problems.push(`${location}: sin etiquetas.`);

    if (typeof item.question === "string") {
      const key = normalize(item.question);
      if (EDITORIAL_TRIVIA.test(key)) {
        problems.push(`${location}: pregunta sobre capítulos, episodios, tomos o datos editoriales.`);
      }
      if (seenQuestions.has(key)) problems.push(`${location}: repite la pregunta de ${seenQuestions.get(key)}.`);
      else seenQuestions.set(key, location);
    }

    const tags = new Set(item.tags ?? []);
    if (tags.size !== (item.tags?.length ?? 0)) problems.push(`${location}: etiquetas duplicadas.`);
    for (const tag of tags) {
      if (!validTags.has(tag)) problems.push(`${location}: etiqueta desconocida «${tag}».`);
      else coverage.get(tag)[level - 1]++;
    }
  }
}

let belowMinimum = 0;
let missingAssignments = 0;
console.log(`Banco: ${total} preguntas. Meta: ${MINIMUM} por filtro y nivel; ideal: ${IDEAL}.`);
console.log("Filtro".padEnd(35) + " N1  N2  N3  N4  N5");
for (const filter of reportFilters) {
  const counts = coverage.get(filter.id);
  belowMinimum += counts.filter((count) => count < MINIMUM).length;
  missingAssignments += counts.reduce((sum, count) => sum + Math.max(0, MINIMUM - count), 0);
  const values = counts.map((count) => String(count).padStart(3)).join(" ");
  console.log(filter.id.padEnd(35) + values);
}
console.log(`Combinaciones bajo el mínimo: ${belowMinimum}/${reportFilters.length * LEVELS.length}. Asignaciones pendientes: ${missingAssignments}.`);

if (problems.length) {
  console.error(problems.join("\n"));
  process.exitCode = 1;
} else if (enforce && belowMinimum > 0) {
  console.error("El banco todavía no alcanza el mínimo en todos los filtros y niveles.");
  process.exitCode = 1;
}

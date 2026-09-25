// Las preguntas son ejemplos; conserva las reglas de acceso al crear el banco definitivo.
// Todo archivo publicado en GitHub Pages es público, incluidos estos códigos.
export const CODE_TIME_ZONE = "America/Bogota";
export const MASTER_CODE = "HARUISTHEBEST";
export const DEMO_LIMIT_PER_LEVEL = 10;
export const ACCESS_NAMES = {
  demo: ["NYRM", "CHINEFILO", "MALDORICK", "DIGIELEGIDOS", "DIGIGAMERS"],
  full: ["HARU", "WESTON", "BRENDA", "DIGIMONBOARDGAME"],
};

export function getDateStamp(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: CODE_TIME_ZONE,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  return `${values.day}${values.month}${values.year}`;
}

export function makeDailyCode(name, date = new Date()) {
  const stamp = getDateStamp(date);
  return `${stamp}${name}${[...stamp].reverse().join("")}`;
}

export function getAccessTier(rawCode, date = new Date()) {
  const code = rawCode.trim().toUpperCase();
  if (code === MASTER_CODE) return "master";

  for (const [tier, names] of Object.entries(ACCESS_NAMES)) {
    if (names.some((name) => code === makeDailyCode(name, date))) return tier;
  }
  return null;
}

export const LEVELS = [
  { value: 1, label: "MUY FÁCIL" },
  { value: 2, label: "FÁCIL" },
  { value: 3, label: "NORMAL" },
  { value: 4, label: "DIFÍCIL" },
  { value: 5, label: "MUY DIFÍCIL" },
];

// IDs estables: las preguntas conservan sus etiquetas aunque cambie el texto visible.
// Las películas comparten la serie; todos los Digimon World comparten un filtro.
export const FILTER_GROUPS = [
  {
    label: "Anime",
    filters: [
      { id: "anime-adventure", label: "Adventure (1999), tri. y Kizuna" },
      { id: "anime-adventure-02", label: "Adventure 02 y The Beginning" },
      { id: "anime-tamers", label: "Tamers" },
      { id: "anime-frontier", label: "Frontier" },
      { id: "anime-savers", label: "Savers / Data Squad" },
      { id: "anime-xros-wars", label: "Xros Wars / Fusion" },
      { id: "anime-hunters", label: "Xros Wars: Hunters" },
      { id: "anime-app-monsters", label: "Universe: App Monsters" },
      { id: "anime-adventure-2020", label: "Adventure: (2020)" },
      { id: "anime-ghost-game", label: "Ghost Game" },
      { id: "anime-beatbreak", label: "Beatbreak" },
    ],
  },
  {
    label: "Juegos con historia",
    filters: [
      { id: "game-time-stranger", label: "Story: Time Stranger" },
      { id: "game-cyber-sleuth", label: "Story: Cyber Sleuth" },
      { id: "game-hackers-memory", label: "Story: Hacker's Memory" },
      { id: "game-survive", label: "Survive" },
      { id: "game-adventure-psp", label: "Adventure (PSP)" },
      { id: "game-world", label: "Digimon World (toda la familia)" },
      { id: "game-lost-evolution", label: "Story: Lost Evolution" },
      { id: "game-story-ds", label: "Story (DS)" },
      { id: "game-dawn-dusk", label: "Story: Dawn / Dusk" },
      { id: "game-super-xros-wars", label: "Story: Super Xros Wars" },
      { id: "game-ryo-wonderswan", label: "Saga de Ryo (WonderSwan)" },
      { id: "game-rearise", label: "ReArise" },
    ],
  },
  {
    label: "Manga, cómics y novelas",
    filters: [
      { id: "literature-v-tamer", label: "Adventure V-Tamer 01" },
      { id: "literature-next", label: "Next" },
      { id: "literature-xros-wars", label: "Xros Wars (manga)" },
      { id: "literature-dreamers", label: "Dreamers" },
      { id: "literature-seekers", label: "Seekers (novela)" },
      { id: "literature-liberator-comic", label: "Liberator (webcómic)" },
      { id: "literature-liberator-novel", label: "Liberator (novela)" },
      { id: "literature-chronicle", label: "Chronicle / Chronicle X" },
      { id: "literature-redigitize-encode", label: "Re:Digitize Encode" },
    ],
  },
  {
    label: "Temas generales",
    filters: [
      { id: "topic-evolution", label: "Evolución y niveles" },
      { id: "topic-special-evolution", label: "Evoluciones especiales" },
      { id: "topic-attributes", label: "Atributos, tipos y familias" },
      { id: "topic-life-cycle", label: "Ciclo de vida y Digitamas" },
      { id: "topic-abilities", label: "Técnicas y habilidades" },
      { id: "topic-groups", label: "Grupos y facciones" },
      { id: "topic-royal-knights", label: "Royal Knights" },
      { id: "topic-demon-lords", label: "Seven Great Demon Lords" },
      { id: "topic-olympus", label: "Olympus XII" },
      { id: "topic-holy-beasts-deva", label: "Four Holy Beasts y Deva" },
      { id: "topic-legendary-warriors", label: "Ten Legendary Warriors" },
      { id: "topic-artifacts", label: "Artefactos y dispositivos" },
      { id: "topic-crests", label: "Emblemas" },
      { id: "topic-digimentals", label: "Digimentals" },
      { id: "topic-digispirits", label: "DigiSpirits" },
      { id: "topic-digivices", label: "Digivices" },
      { id: "topic-x-antibody", label: "Anticuerpo X y X-Evolution" },
      { id: "topic-digital-world", label: "Mundo Digital y lugares" },
      { id: "topic-other-worlds", label: "Otros mundos y dimensiones" },
      { id: "topic-lore", label: "Historia y mitología" },
    ],
  },
];

export const QUESTIONS = {
  1: [
    { question: "¿Cómo se llaman las criaturas digitales del juego?", answer: "Digimon.", detail: "Son las criaturas que acompañan a los Tamers.", tags: ["prototype-board-game"] },
    { question: "¿Qué representa el icono de corazón?", answer: "Vida.", detail: "El corazón identifica la estadística de Vida.", tags: ["prototype-board-game"] },
  ],
  2: [
    { question: "¿Qué representa el icono de rayo?", answer: "Energía.", detail: "El rayo identifica la estadística de Energía.", tags: ["prototype-board-game"] },
    { question: "¿Cómo se llama la moneda del juego?", answer: "Digi-Coin.", detail: "Es una de las fichas de recurso del juego.", tags: ["prototype-board-game"] },
  ],
  3: [
    { question: "¿Qué objeto permite realizar una evolución Armor?", answer: "Un Digimental.", detail: "Los Digimentals permiten activar la evolución Armor.", tags: ["anime-adventure-02", "topic-special-evolution", "topic-artifacts", "topic-digimentals"] },
    { question: "¿Qué objeto está asociado a un rasgo de un elegido?", answer: "Un Emblema.", detail: "Cada Emblema representa un rasgo distinto.", tags: ["anime-adventure", "topic-artifacts", "topic-crests"] },
  ],
  4: [
    { question: "¿Qué objeto permite una evolución Spirit?", answer: "Un DigiSpirit.", detail: "En el juego hay DigiSpirits de tipo Humano y Bestia.", tags: ["anime-frontier", "topic-special-evolution", "topic-artifacts", "topic-digispirits"] },
    { question: "¿Cuáles son los dos tipos de DigiSpirit?", answer: "Humano y Bestia.", detail: "Son las dos formas representadas en las cartas.", tags: ["anime-frontier", "topic-special-evolution", "topic-artifacts", "topic-digispirits"] },
  ],
  5: [
    { question: "En el triángulo de atributos, ¿cuál vence a Virus?", answer: "Vacuna.", detail: "Vacuna tiene ventaja frente a Virus.", tags: ["topic-attributes"] },
    { question: "En el triángulo de atributos, ¿cuál vence a Vacuna?", answer: "Datos.", detail: "Datos tiene ventaja frente a Vacuna.", tags: ["topic-attributes"] },
  ],
};

// Las primeras diez preguntas de cada nivel forman el banco demo.
export function getQuestionsForLevel(level, tier, selectedTags = new Set()) {
  const questions = QUESTIONS[level] ?? [];
  const accessible = tier === "demo"
    ? questions.slice(0, DEMO_LIMIT_PER_LEVEL)
    : (tier === "full" || tier === "master" ? questions : []);
  if (selectedTags.size === 0) return accessible;
  return accessible.filter((question) => question.tags?.some((tag) => selectedTags.has(tag)));
}

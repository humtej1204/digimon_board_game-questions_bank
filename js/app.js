import { LEVELS, QUESTIONS, VALID_CODES } from "./data.js";

const $ = (selector) => document.querySelector(selector);
const views = {
  access: $("#access-view"),
  levels: $("#levels-view"),
  game: $("#game-view"),
};
const card = $("#playing-card");
const front = $("#card-front");
const back = $("#card-back");
const codeInput = $("#game-code");
const codeError = $("#code-error");
const levelMenu = $("#level-menu");
const levelToggle = $("#level-toggle");
const nextButton = $("#next-question");
const flipButton = $("#flip-card");

const state = {
  level: null,
  questionIndex: null,
  remaining: new Map(),
  flipped: false,
  pendingQuestion: null,
};

function shuffle(items) {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[randomIndex]] = [copy[randomIndex], copy[index]];
  }
  return copy;
}

function drawQuestion(level) {
  const questions = QUESTIONS[level] ?? [];
  if (questions.length === 0) return null;

  let remaining = state.remaining.get(level) ?? [];
  if (remaining.length === 0) {
    remaining = shuffle(questions.map((_, index) => index));
    if (remaining.length > 1 && remaining.at(-1) === state.questionIndex && level === state.level) {
      [remaining[0], remaining[remaining.length - 1]] = [remaining[remaining.length - 1], remaining[0]];
    }
  }
  const index = remaining.pop();
  state.remaining.set(level, remaining);
  return index;
}

function clearPendingQuestion() {
  if (state.pendingQuestion !== null) window.clearTimeout(state.pendingQuestion);
  state.pendingQuestion = null;
  nextButton.disabled = false;
}

function closeLevelMenu() {
  levelMenu.hidden = true;
  levelToggle.setAttribute("aria-expanded", "false");
}

function showView(name) {
  clearPendingQuestion();
  closeLevelMenu();
  for (const [viewName, element] of Object.entries(views)) element.hidden = viewName !== name;
  $("#home-button").hidden = name === "access";
  if (name === "levels") {
    document.querySelectorAll(".level-card").forEach((element) => {
      element.classList.toggle("selected", Number(element.dataset.level) === state.level);
    });
  }
  window.scrollTo({ top: 0, behavior: "instant" });
  if (name === "access") codeInput.focus();
}

function renderLevels() {
  const list = $("#level-list");
  list.replaceChildren();
  levelMenu.replaceChildren();

  for (const level of LEVELS) {
    const button = document.createElement("button");
    button.className = "level-card";
    button.type = "button";
    button.dataset.level = String(level.value);
    button.setAttribute("aria-label", `Nivel ${level.value}, ${level.label.toLowerCase()}`);

    if (level.value === 3) {
      const recommended = document.createElement("em");
      recommended.textContent = "RECOMENDADO";
      button.append(recommended);
    }

    const stars = document.createElement("span");
    stars.className = "stars";
    stars.setAttribute("aria-hidden", "true");
    for (let index = 0; index < level.value; index += 1) {
      const star = document.createElement("img");
      star.src = "./assets/star.png";
      star.alt = "";
      stars.append(star);
    }
    const number = document.createElement("strong");
    number.textContent = `NIVEL ${level.value}`;
    const caption = document.createElement("small");
    caption.textContent = level.label;
    button.append(stars, number, caption);
    button.addEventListener("click", () => selectLevel(level.value));
    list.append(button);

    const option = document.createElement("button");
    option.type = "button";
    option.dataset.level = String(level.value);
    const optionLabel = document.createElement("span");
    optionLabel.textContent = "★".repeat(level.value);
    option.append(`NIVEL ${level.value}`, optionLabel);
    option.addEventListener("click", () => selectLevel(level.value));
    levelMenu.append(option);
  }
}

function renderQuestion() {
  const level = state.level;
  const question = QUESTIONS[level]?.[state.questionIndex];
  if (!question) return;

  $("#question-text").textContent = question.question;
  $("#answer-text").textContent = question.answer;
  $("#answer-detail").textContent = question.detail ?? "";
  $("#current-level").textContent = `NIVEL ${level}`;
  $("#current-stars").textContent = "★".repeat(level);
  document.querySelectorAll(".card-level").forEach((element) => { element.textContent = `NIVEL ${level}`; });
  document.querySelectorAll(".card-stars").forEach((element) => { element.textContent = Array(level).fill("★").join(" "); });
  document.querySelectorAll(".level-card").forEach((element) => {
    element.classList.toggle("selected", Number(element.dataset.level) === level);
  });
  levelMenu.querySelectorAll("button").forEach((element) => {
    element.setAttribute("aria-current", String(Number(element.dataset.level) === level));
  });
}

function setFlipped(flipped) {
  state.flipped = flipped;
  card.classList.toggle("is-flipped", flipped);
  card.setAttribute("aria-label", flipped ? "Carta de respuesta" : "Carta de pregunta");
  front.setAttribute("aria-hidden", String(flipped));
  back.setAttribute("aria-hidden", String(!flipped));
  flipButton.setAttribute("aria-pressed", String(flipped));
  $("#flip-label").textContent = flipped ? "VER PREGUNTA" : "VER RESPUESTA";
  $("#flip-icon").src = flipped ? "./assets/reset.png" : "./assets/chevrons-white.png";
  $("#game-help").textContent = flipped
    ? "Haz clic en VER PREGUNTA para volver al frente de la carta."
    : "La pregunta se elige al azar dentro del nivel seleccionado.";
}

function selectLevel(level) {
  if (!LEVELS.some((item) => item.value === level) || !(QUESTIONS[level]?.length > 0)) return;
  clearPendingQuestion();
  setFlipped(false);
  state.level = level;
  state.questionIndex = drawQuestion(level);
  renderQuestion();
  showView("game");
}

function nextQuestion() {
  if (state.level === null || nextButton.disabled) return;
  const nextIndex = drawQuestion(state.level);
  if (nextIndex === null) return;

  if (state.flipped) {
    setFlipped(false);
    nextButton.disabled = true;
    const delay = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 350;
    state.pendingQuestion = window.setTimeout(() => {
      state.questionIndex = nextIndex;
      renderQuestion();
      clearPendingQuestion();
    }, delay);
  } else {
    state.questionIndex = nextIndex;
    renderQuestion();
  }
}

function goHome() {
  clearPendingQuestion();
  state.level = null;
  state.questionIndex = null;
  state.remaining.clear();
  setFlipped(false);
  codeInput.value = "";
  codeInput.removeAttribute("aria-invalid");
  codeError.hidden = true;
  showView("access");
}

$("#access-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const code = codeInput.value.trim().toUpperCase();
  if (!VALID_CODES.includes(code)) {
    codeInput.setAttribute("aria-invalid", "true");
    codeError.hidden = false;
    codeInput.focus();
    return;
  }
  codeInput.removeAttribute("aria-invalid");
  codeError.hidden = true;
  showView("levels");
});

codeInput.addEventListener("input", () => {
  codeInput.removeAttribute("aria-invalid");
  codeError.hidden = true;
});

levelToggle.addEventListener("click", () => {
  const expanded = levelToggle.getAttribute("aria-expanded") === "true";
  levelMenu.hidden = expanded;
  levelToggle.setAttribute("aria-expanded", String(!expanded));
});

document.addEventListener("click", (event) => {
  if (!event.target.closest(".level-picker")) closeLevelMenu();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !levelMenu.hidden) {
    closeLevelMenu();
    levelToggle.focus();
  }
});

nextButton.addEventListener("click", nextQuestion);
flipButton.addEventListener("click", () => setFlipped(!state.flipped));
$("#change-level-button").addEventListener("click", () => { setFlipped(false); showView("levels"); });
$("#home-button").addEventListener("click", goHome);
$("#brand-home").addEventListener("click", goHome);

renderLevels();
setFlipped(false);

import { FILTER_GROUPS, LEVELS, getAccessTier, getDateStamp, getQuestionsForLevel } from "./data.js";

const $ = (selector) => document.querySelector(selector);
const views = {
  access: $("#access-view"),
  levels: $("#levels-view"),
  game: $("#game-view"),
};
const card = $("#playing-card");
const loadingCard = $("#card-loading");
const front = $("#card-front");
const back = $("#card-back");
const codeInput = $("#game-code");
const codeError = $("#code-error");
const levelMenu = $("#level-menu");
const levelToggle = $("#level-toggle");
const nextButton = $("#next-question");
const flipButton = $("#flip-card");
const filterGroups = $("#filter-groups");
const filterEmpty = $("#filter-empty");
const filterDialog = $("#filter-dialog");
const filterCategories = [];
const QUESTION_LOADING_MS = 1000;
const LOGIN_STORAGE_KEY = "isLogued";
const SESSION_STORAGE_KEY = "questionsBankSession";

const state = {
  accessTier: null,
  accessDate: null,
  view: "access",
  level: null,
  questionIndex: null,
  remaining: new Map(),
  selectedTags: new Set(),
  flipped: false,
  pendingQuestion: null,
};

function saveSession() {
  if (!state.accessTier || state.view === "access") return;
  try {
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify({
      tier: state.accessTier,
      accessDate: state.accessDate,
      view: state.view,
      level: state.level,
      selectedTags: [...state.selectedTags],
      questionIndex: state.questionIndex,
      remaining: [...state.remaining],
    }));
    localStorage.setItem(LOGIN_STORAGE_KEY, "true");
  } catch {
    // La página sigue funcionando si el navegador bloquea el almacenamiento.
  }
}

function clearStoredSession() {
  try {
    localStorage.setItem(LOGIN_STORAGE_KEY, "false");
    localStorage.removeItem(SESSION_STORAGE_KEY);
  } catch {
    // El cierre de sesión en memoria funciona aunque el almacenamiento falle.
  }
}

function restoreSession() {
  let saved;
  try {
    if (localStorage.getItem(LOGIN_STORAGE_KEY) !== "true") {
      localStorage.setItem(LOGIN_STORAGE_KEY, "false");
      return;
    }
    saved = JSON.parse(localStorage.getItem(SESSION_STORAGE_KEY) ?? "null");
  } catch {
    clearStoredSession();
    return;
  }

  const validTier = ["demo", "full", "master"].includes(saved?.tier);
  const validView = ["levels", "game"].includes(saved?.view);
  const validLevel = saved?.level === null || LEVELS.some((item) => item.value === saved?.level);
  const validDate = saved?.tier === "master" || saved?.accessDate === getDateStamp();
  if (!validTier || !validView || !validLevel || !validDate || (saved.view === "game" && saved.level === null)) {
    clearStoredSession();
    return;
  }

  state.accessTier = saved.tier;
  state.accessDate = saved.accessDate ?? null;
  state.level = saved.level;
  const validTags = new Set(FILTER_GROUPS.flatMap((group) => group.filters.map((filter) => filter.id)));
  state.selectedTags = new Set(
    Array.isArray(saved.selectedTags) ? saved.selectedTags.filter((tag) => validTags.has(tag)) : [],
  );
  for (const category of filterCategories) {
    for (const input of category.inputs) input.checked = state.selectedTags.has(input.value);
  }
  syncCategoryCheckboxes();
  renderFilterStatus();

  state.remaining.clear();
  if (Array.isArray(saved.remaining)) {
    for (const entry of saved.remaining) {
      if (!Array.isArray(entry) || entry.length !== 2) continue;
      const [level, indices] = entry;
      if (!LEVELS.some((item) => item.value === level) || !Array.isArray(indices)) continue;
      const count = getQuestionsForLevel(level, state.accessTier, state.selectedTags).length;
      if (indices.every((index) => Number.isInteger(index) && index >= 0 && index < count)) {
        state.remaining.set(level, [...new Set(indices)]);
      }
    }
  }
  const questionCount = state.level === null
    ? 0
    : getQuestionsForLevel(state.level, state.accessTier, state.selectedTags).length;
  state.questionIndex = Number.isInteger(saved.questionIndex)
    && saved.questionIndex >= 0
    && saved.questionIndex < questionCount
    ? saved.questionIndex
    : null;

  $("#mode-tag").textContent = state.accessTier === "demo" ? "MODO DEMO" : "MODO PREGUNTAS";
  $("#levels-help").textContent = state.accessTier === "demo"
    ? "Acceso demo: hasta 10 preguntas por nivel."
    : "Podrás cambiar el nivel en cualquier momento.";
  showView(saved.view);
  if (saved.view === "game") startQuestionLoading();
}

function shuffle(items) {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[randomIndex]] = [copy[randomIndex], copy[index]];
  }
  return copy;
}

function drawQuestion(level) {
  const questions = getQuestionsForLevel(level, state.accessTier, state.selectedTags);
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
  loadingCard.hidden = true;
  card.classList.remove("is-loading");
  card.removeAttribute("aria-busy");
  front.setAttribute("aria-hidden", String(state.flipped));
  back.setAttribute("aria-hidden", String(!state.flipped));
  nextButton.disabled = false;
  flipButton.disabled = false;
}

function closeLevelMenu() {
  levelMenu.hidden = true;
  levelToggle.setAttribute("aria-expanded", "false");
}

function showView(name) {
  clearPendingQuestion();
  state.view = name;
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
  saveSession();
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

function renderFilterStatus() {
  const count = state.selectedTags.size;
  $("#filter-count").textContent = count === 0 ? "TODAS" : `${count} ${count === 1 ? "ACTIVO" : "ACTIVOS"}`;
  $("#clear-filters").hidden = count === 0;
}

function updateFilteredQuestion() {
  state.remaining.clear();
  state.questionIndex = null;
  if (state.level !== null) startQuestionLoading();
  else clearPendingQuestion();
  syncCategoryCheckboxes();
  renderFilterStatus();
  saveSession();
}

function clearFilters() {
  if (state.selectedTags.size === 0) return;
  state.selectedTags.clear();
  filterGroups.querySelectorAll('input[type="checkbox"]').forEach((input) => {
    input.checked = false;
  });
  updateFilteredQuestion();
}

function syncCategoryCheckboxes() {
  for (const category of filterCategories) {
    const selected = category.inputs.filter((input) => input.checked).length;
    category.selectAll.checked = selected === category.inputs.length;
    category.selectAll.indeterminate = selected > 0 && selected < category.inputs.length;
  }
}

function renderFilters() {
  for (const group of FILTER_GROUPS) {
    const section = document.createElement("section");
    section.className = "filter-group";
    section.setAttribute("role", "group");
    section.setAttribute("aria-label", group.label);

    const heading = document.createElement("div");
    heading.className = "filter-category-heading";
    const categoryLabel = document.createElement("label");
    categoryLabel.className = "filter-category-label";
    const selectAll = document.createElement("input");
    selectAll.type = "checkbox";
    selectAll.setAttribute("aria-label", `Seleccionar todos los filtros de ${group.label}`);
    const categoryName = document.createElement("strong");
    categoryName.textContent = group.label;
    const selectAllHint = document.createElement("small");
    selectAllHint.textContent = "MARCAR TODOS";
    categoryLabel.append(selectAll, categoryName, selectAllHint);
    heading.append(categoryLabel);

    const options = document.createElement("div");
    options.className = "filter-options";
    const inputs = [];

    for (const filter of group.filters) {
      const label = document.createElement("label");
      label.className = "filter-option";
      const input = document.createElement("input");
      input.type = "checkbox";
      input.value = filter.id;
      input.addEventListener("change", () => {
        if (input.checked) state.selectedTags.add(filter.id);
        else state.selectedTags.delete(filter.id);
        updateFilteredQuestion();
      });
      const name = document.createElement("span");
      name.textContent = filter.label;
      label.append(input, name);
      options.append(label);
      inputs.push(input);
    }

    selectAll.addEventListener("change", () => {
      for (const input of inputs) {
        input.checked = selectAll.checked;
        if (input.checked) state.selectedTags.add(input.value);
        else state.selectedTags.delete(input.value);
      }
      updateFilteredQuestion();
    });

    section.append(heading, options);
    filterGroups.append(section);
    filterCategories.push({ selectAll, inputs });
  }
  syncCategoryCheckboxes();
  renderFilterStatus();
}

function renderQuestion() {
  const level = state.level;
  const questions = getQuestionsForLevel(level, state.accessTier, state.selectedTags);
  const question = questions[state.questionIndex];
  const hasQuestion = Boolean(question);
  filterEmpty.hidden = hasQuestion;
  $(".flip-stage").hidden = !hasQuestion;
  $(".outside-actions").hidden = !hasQuestion;
  $("#clear-empty-filters").hidden = state.selectedTags.size === 0;
  filterEmpty.querySelector("p").textContent = state.selectedTags.size === 0
    ? "Todavía no hay preguntas en este nivel."
    : "No hay preguntas de este nivel con los filtros elegidos.";

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

  if (!question) {
    $("#game-help").textContent = "Cambia el nivel o ajusta los filtros para continuar.";
    return;
  }
  $("#question-text").textContent = question.question;
  $("#answer-text").textContent = question.answer;
  $("#answer-detail").textContent = question.detail ?? "";
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
    : state.selectedTags.size > 0
      ? "La pregunta se elige al azar entre las etiquetas marcadas de este nivel."
      : "La pregunta se elige al azar dentro del nivel seleccionado.";
}

function startQuestionLoading() {
  if (state.level === null) return;
  clearPendingQuestion();
  setFlipped(false);
  $("#current-level").textContent = `NIVEL ${state.level}`;
  $("#current-stars").textContent = "★".repeat(state.level);
  filterEmpty.hidden = true;
  $(".flip-stage").hidden = false;
  $(".outside-actions").hidden = true;
  loadingCard.hidden = false;
  card.classList.add("is-loading");
  card.setAttribute("aria-busy", "true");
  front.setAttribute("aria-hidden", "true");
  back.setAttribute("aria-hidden", "true");
  nextButton.disabled = true;
  flipButton.disabled = true;
  $("#game-help").textContent = "Preparando una nueva pregunta...";

  state.pendingQuestion = window.setTimeout(() => {
    state.pendingQuestion = null;
    state.questionIndex = drawQuestion(state.level);
    renderQuestion();
    clearPendingQuestion();
    saveSession();
  }, QUESTION_LOADING_MS);
  saveSession();
}

function selectLevel(level) {
  if (!state.accessTier || !LEVELS.some((item) => item.value === level)) return;
  if (state.level !== level) state.questionIndex = null;
  state.level = level;
  showView("game");
  startQuestionLoading();
}

function nextQuestion() {
  if (state.level === null || state.pendingQuestion !== null) return;
  startQuestionLoading();
}

function goHome() {
  clearPendingQuestion();
  clearStoredSession();
  state.accessTier = null;
  state.accessDate = null;
  $("#mode-tag").textContent = "MODO PREGUNTAS";
  $("#levels-help").textContent = "Podrás cambiar el nivel en cualquier momento.";
  state.level = null;
  state.questionIndex = null;
  state.remaining.clear();
  state.selectedTags.clear();
  filterGroups.querySelectorAll('input[type="checkbox"]').forEach((input) => {
    input.checked = false;
  });
  renderFilterStatus();
  setFlipped(false);
  codeInput.value = "";
  codeInput.removeAttribute("aria-invalid");
  codeError.hidden = true;
  showView("access");
}

$("#access-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const tier = getAccessTier(codeInput.value);
  if (!tier) {
    codeInput.setAttribute("aria-invalid", "true");
    codeError.hidden = false;
    codeInput.focus();
    return;
  }
  state.accessTier = tier;
  state.accessDate = tier === "master" ? null : getDateStamp();
  $("#mode-tag").textContent = tier === "demo" ? "MODO DEMO" : "MODO PREGUNTAS";
  $("#levels-help").textContent = tier === "demo" ? "Acceso demo: hasta 10 preguntas por nivel." : "Podrás cambiar el nivel en cualquier momento.";
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

$("#open-filters").addEventListener("click", () => {
  if (!filterDialog.open) filterDialog.showModal();
});
$("#close-filters").addEventListener("click", () => filterDialog.close());
$("#done-filters").addEventListener("click", () => filterDialog.close());
filterDialog.addEventListener("click", (event) => {
  if (event.target === filterDialog) filterDialog.close();
});
filterDialog.addEventListener("close", () => $("#open-filters").focus());

$("#clear-filters").addEventListener("click", clearFilters);
$("#clear-empty-filters").addEventListener("click", clearFilters);
nextButton.addEventListener("click", nextQuestion);
flipButton.addEventListener("click", () => setFlipped(!state.flipped));
$("#change-level-button").addEventListener("click", () => { setFlipped(false); showView("levels"); });
$("#home-button").addEventListener("click", goHome);
$("#brand-home").addEventListener("click", goHome);

renderLevels();
renderFilters();
setFlipped(false);
restoreSession();

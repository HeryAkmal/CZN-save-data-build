const { startingDeck: STARTING_DECK, presets } = CHAR;
const neutralCards = Object.fromEntries(
  Object.entries(NEUTRAL).map(([id, c]) => [id, { ...c, neutral: true }]),
);
const cardDB = { ...neutralCards, ...CHAR.cardDB };
const $ = (id) => document.getElementById(id);

document.title = `${CHAR.name} / Combat Archive`;
$("char-name").textContent = CHAR.name;
$("build-name").textContent = CHAR.name.toUpperCase();

const shell = document.querySelector(".app-shell");
const panel = document.getElementById("stats-panel");
const sideBtn = document.getElementById("toggle-side");
const statsBtn = document.getElementById("toggle-stats");

const sideChars = [
  { id: "beryl", name: "Beryl" },
  { id: "veronica", name: "Veronica" },
  { id: "kayron", name: "Kayron" },
  { id: "mei-lin", name: "Mei Lin" },
  { id: "tiphera", name: "Tiphera" },
  { id: "mika", name: "Mika" },
];

$("side-characters").innerHTML = sideChars
  .map(
    (
      c,
    ) => `<a class="character${c.id === CHAR.id ? " selected" : ""}" href="${c.id}.html">
      <img src="assets/char-card/${c.id}.webp" alt="" onerror="this.style.visibility='hidden'" />
      <span class="label">${c.name}</span></a>`,
  )
  .join("");

const LIMITS = { cards: 40, points: 180, dupes: 3, removed: 5 };
const DUP_COST = [0, 0, 40, 40];
const DIVINE_COST = 20;
const REMOVE_STARTING_COST = 20;
const NEUTRAL_COST = 20;

const cardGrid = document.getElementById("card-grid");
const presetSel = document.getElementById("preset");
const presetDesc = document.getElementById("preset-desc");

const hl = (t) => t.replace(/(\d+(?:\.\d+)?%?)/g, '<b class="num">$1</b>');
const fmt = (t, epi) =>
  (epi ? hl(t) : t).replace(/\{dv\}/g, '<i class="dv"></i>');

function signHTML(e, c = {}) {
  const kind = c.kind || e.kind || "epiphany";
  const file =
    c.sign || e.sign || (kind === "divine" ? "epiphany-divine" : "epiphany");
  return `<span class="epi-sign ${kind}"><img src="assets/card-effect/${file}.png" alt="" onerror="this.parentNode.classList.add('no-img');this.remove()" /></span>`;
}

function tagList(base, e, c) {
  let t = c.tags ?? e?.tags ?? base.tags ?? [];
  t = [...t, ...(e?.addTags || []), ...(c.addTags || [])];
  if (c.dup) t.push("Duplicated");
  return [...new Set(t.flatMap((x) => x.split("/").map((s) => s.trim())))];
}

function cardHTML(c) {
  const base = cardDB[c.id];
  const e = c.epi ? base.epiphanies?.[c.epi] : null;
  if (c.epi && !e)
    console.warn(`Unknown epiphany "${c.epi}" on card "${c.id}"`);
  const v = e ? { ...base, ...e } : base;
  let costCls = "";
  if (typeof v.cost !== "number") costCls = " na";
  else if (typeof base.cost === "number")
    costCls = v.cost > base.cost ? " up" : v.cost < base.cost ? " down" : "";
  const tags = tagList(base, e, c);
  return `
<article class="card selected-card${e ? " epi" : ""}">
<img class="card-art" src="${base.neutral ? "assets/neutral" : `assets/${CHAR.id}`}/${c.id}.webp" alt="${base.name}" />
<div class="top-overlay">
<div class="cost${costCls}">${v.cost}</div>
<div class="card-heading">
    <strong>${base.name}</strong>
    <span><img src="assets/card-type/${v.icon}.jpeg" alt="" /> ${v.type}</span>
</div>
</div>
${e ? signHTML(e, c) : ""}
<div class="bottom-overlay">
${tags.length ? `<p class="tag">[ ${tags.join(" / ")} ]</p>` : ""}
<div class="divider"></div>
<p>${fmt(v.text, e)}</p>
</div>
</article>`;
}

//STATS
function calcStats(cards) {
  let points = 0,
    removed = 0;
  const kept = {};
  cards
    .filter((c) => !c.dup)
    .forEach((c) => (kept[c.id] = (kept[c.id] || 0) + 1));

  STARTING_DECK.forEach((id) => {
    if (kept[id] > 0) kept[id]--;
    else {
      removed++;
      if (cardDB[id].starting) points += REMOVE_STARTING_COST;
    }
  });

  const dupes = cards.filter((c) => c.dup).length;
  for (let i = 0; i < dupes; i++)
    points += DUP_COST[Math.min(i, DUP_COST.length - 1)];

  cards.forEach((c) => {
    const e = cardDB[c.id].epiphanies?.[c.epi];
    if (e && (c.kind || e.kind) === "divine") points += DIVINE_COST;
  });
  cards.forEach((c) => {
    const base = cardDB[c.id];
    if (!c.dup && base.neutral) points += base.points ?? NEUTRAL_COST;
  });
  return { total: cards.length, points, dupes, removed };
}

function renderStats(s) {
  const set = (id, val, max) => {
    const el = $(id);
    el.querySelector("strong").textContent = `${val} / ${max}`;
    el.classList.toggle("over", val > max);
  };
  set("stat-cards", s.total, LIMITS.cards);
  set("stat-points", s.points, LIMITS.points);
  set("stat-dupes", s.dupes, LIMITS.dupes);
  set("stat-removed", s.removed, LIMITS.removed);

  const ok =
    s.total >= 1 &&
    s.total <= LIMITS.cards &&
    s.points <= LIMITS.points &&
    s.dupes <= LIMITS.dupes &&
    s.removed <= LIMITS.removed;
  $("status-valid").classList.toggle("invalid", !ok);
  $("status-valid").querySelector(".v-text").textContent = ok
    ? "Valid"
    : "Invalid";
  $("status-points").textContent = `${s.points} / ${LIMITS.points} pt`;
  $("status-cards").textContent = `${s.total} / ${LIMITS.cards} cards`;
  $("build-count").textContent = `${s.total} cards`;
}

function normalize(cards) {
  const start = {};
  STARTING_DECK.forEach((id) => (start[id] = (start[id] || 0) + 1));
  const seen = {};
  return cards.map((c) => {
    if (c.dup || cardDB[c.id].neutral) return c;
    const allowed = start[c.id] || 1;
    seen[c.id] = (seen[c.id] || 0) + 1;
    return seen[c.id] > allowed ? { ...c, dup: true } : c;
  });
}

function loadPreset(key) {
  const p = presets[key] || presets.default;
  const cards = normalize(
    p.cards.map((c) => (typeof c === "string" ? { id: c } : c)),
  );
  cardGrid.innerHTML = cards.map(cardHTML).join("");
  presetDesc.textContent = p.desc;
  renderStats(calcStats(cards));
}

presetSel.innerHTML = Object.entries(presets)
  .map(([k, p]) => `<option value="${k}">${p.label}</option>`)
  .join("");

presetSel.addEventListener("change", () => loadPreset(presetSel.value));
loadPreset(presetSel.value);

function setSide(collapsed) {
  shell.classList.toggle("side-collapsed", collapsed);
  sideBtn.setAttribute("aria-expanded", String(!collapsed));
  sideBtn.setAttribute(
    "aria-label",
    collapsed ? "Expand navigation" : "Collapse navigation",
  );
}

function setStats(collapsed) {
  panel.classList.toggle("collapsed", collapsed);
  statsBtn.setAttribute("aria-expanded", String(!collapsed));
  statsBtn.setAttribute(
    "aria-label",
    collapsed ? "Expand build panel" : "Collapse build panel",
  );
  statsBtn.textContent = collapsed ? "«" : "»";
}

sideBtn.addEventListener("click", () =>
  setSide(!shell.classList.contains("side-collapsed")),
);
statsBtn.addEventListener("click", () =>
  setStats(!panel.classList.contains("collapsed")),
);

setSide(window.innerWidth < 1100);
setStats(window.innerWidth < 1300);

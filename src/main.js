import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import "./style.css";
import { PROJECTS, TIERS, TYPE_LABEL, TODAY, COVERAGE } from "./data.js";
import { MEDIA, photosFor } from "./media.js";
import { openImages, openPdf } from "./viewer.js";

const REGIONS = ["West", "North", "North-East", "East", "Central"].filter((r) => PROJECTS.some((p) => p.region === r));
const KIND_LABEL = { bto: "HDB BTO", condo: "Condo", ec: "EC" };
const KINDS = ["bto", "condo", "ec"].filter((k) => PROJECTS.some((p) => p.kind === k));
const isPrivate = (p) => p.kind !== "bto";
const unitWord = (p) => (isPrivate(p) ? "units" : "flats");
const ORDER = { now: 0, dec: 1, q1: 2, jun: 3 };
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Singapore framing. VIEW is what "All of Singapore" fits; the map springs back
// when dragged so its edges leave Singapore (or its centre leaves CENTER_BOX when tilted).
const SG_VIEW = [[103.6, 1.215], [104.045, 1.475]];
const CENTER_BOX = { w: 103.64, s: 1.255, e: 104.0, n: 1.445 };
const HARD_LIMIT = [[103.2, 0.75], [104.45, 1.95]]; // only while the map first loads; lockToSingapore() then tightens it
const LABEL_ZOOM = 14; // project name labels always on from here
const ROAD_LABEL_ZOOM = 13.5; // base-map road and transit names appear from here
const SMALL_PIN_ZOOM = 10.3; // below this (phones, zoomed out) pins shrink so they overlap less

const BRONZE = "#a8813f";
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const isPhone = () => window.matchMedia("(max-width: 760px)").matches;
const canHover = window.matchMedia("(hover: hover)").matches;

const $ = (id) => document.getElementById(id);
const fmt = (n) => n.toLocaleString("en-SG");
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const byId = Object.fromEntries(PROJECTS.map((p) => [p.id, p]));
const bigUnits = (p) => (p.mix ? (p.mix["4R"] || 0) + (p.mix["5R"] || 0) : 0);
const topDate = (p) => { const [y, m] = p.top.split("-").map(Number); return new Date(y, m - 1, 1); };
const topLabel = (p) => { if (p.topText) return p.topText; const d = topDate(p); return `${MONTHS[d.getMonth()]} ${d.getFullYear()}`; };
const monthsAway = (p) => Math.round((topDate(p) - new Date()) / (1000 * 60 * 60 * 24 * 30.44)); // from the real date, so it stays right
// Data older than this many days gets a "may be out of date" warning.
const STALE_DAYS = 45;
const SHORT_TYPE = { "2RF": "2-rm Flexi", "3R": "3-room", "4R": "4-room", "5R": "5-room" };
const status = (p) => {
  if (p.tier === "now") return p.topObtained ? "TOP obtained" : isPrivate(p) ? "Due about now" : "Collecting now";
  return `Keys ~${topLabel(p)}`;
};
const whenText = (p) => {
  if (p.tier === "now") return !isPrivate(p) ? "Keys already rolling out" : p.topObtained ? "Keys being handed over now" : "TOP expected about now, not yet confirmed";
  const n = monthsAway(p);
  if (n <= 0) return "Estimated date has passed. Keys are likely being handed over";
  return `About ${n} month${n === 1 ? "" : "s"} away`;
};

const state = { kind: "all", month: "all", region: "all", type: "", q: "", sel: null, radius: true, collapsed: false };

// Months the data covers, from the first handovers to the end of the coverage window.
const ym = (y, m) => `${y}-${String(m).padStart(2, "0")}`;
const ymLabel = (v) => { const [y, m] = v.split("-").map(Number); return `${MONTHS[m - 1]} ${y}`; };
const MONTH_LIST = (() => {
  const out = [];
  let [y, m] = [2026, 9];
  const end = COVERAGE.reduce((a, c) => (c.untilYM > a ? c.untilYM : a), "0000-00");
  while (ym(y, m) <= end) { out.push(ym(y, m)); m += 1; if (m > 12) { m = 1; y += 1; } }
  return out;
})();
// Each project's key window: one month for HDB, a span for a quarter or half-year estimate.
const NOW_UNTIL = "2026-11"; // projects already handing over count as collecting through this month
const winOf = (p) => {
  const from = p.topFrom || p.top;
  const to = p.topTo || p.top;
  return [from, p.tier === "now" && to < NOW_UNTIL ? NOW_UNTIL : to];
};
const matchesMonth = (p, month) => {
  if (month === "all") return true;
  if (month === "now") return p.tier === "now";
  if (month.startsWith("tier:")) return p.tier === month.slice(5);
  const [a, b] = winOf(p);
  return a <= month && month <= b;
};

/* ---------------- Filtering ---------------- */
function matchesQuery(p, q) {
  if (!q) return true;
  const hay = `${p.name} ${p.town} ${p.street} ${p.region} ${p.developer || ""} ${KIND_LABEL[p.kind]}`.toLowerCase();
  return q.toLowerCase().split(/\s+/).filter(Boolean).every((w) => hay.includes(w));
}
// Every filter except the month, so the month list can show how many projects each month has.
const baseList = () =>
  PROJECTS.filter((p) =>
    (state.kind === "all" || p.kind === state.kind || (state.kind === "private" && isPrivate(p))) &&
    (state.region === "all" || p.region === state.region) &&
    (!state.type || p.types.includes(state.type)) &&
    matchesQuery(p, state.q));
const visible = () => baseList().filter((p) => matchesMonth(p, state.month));
// Same order as the list: by tier, then biggest first.
const ordered = () => visible().sort((a, b) => ORDER[a.tier] - ORDER[b.tier] || b.units - a.units);
const activeFilterCount = () => [state.kind !== "all", state.month !== "all", state.region !== "all", !!state.type].filter(Boolean).length;
const filtersActive = () => state.kind !== "all" || state.month !== "all" || state.region !== "all" || !!state.type || !!state.q;

function radioButtons(container, options, key, className) {
  container.innerHTML = "";
  options.forEach((o) => {
    const b = document.createElement("button");
    b.type = "button";
    if (className) b.className = className;
    b.setAttribute("role", "radio");
    b.dataset.value = o.value;
    if (o.title) b.title = o.title;
    b.innerHTML = o.html;
    b.addEventListener("click", () => { state[key] = o.value; update(); });
    container.appendChild(b);
  });
}
function syncRadios(container, value) {
  container.querySelectorAll("[role=radio]").forEach((b) => b.setAttribute("aria-checked", String(b.dataset.value === value)));
}

function buildFilters() {
  $("fKind").style.setProperty("--n", KINDS.length + 1);
  radioButtons($("fKind"), [{ value: "all", html: "All" }, ...KINDS.map((k) => ({ value: k, html: KIND_LABEL[k] }))], "kind");
  $("fMonth").addEventListener("change", (e) => { state.month = e.target.value; update(); });
  $("filtBtn").addEventListener("click", () => {
    const open = !$("controls").classList.contains("show");
    $("controls").classList.toggle("show", open);
    $("filtBtn").setAttribute("aria-expanded", String(open));
  });
  radioButtons($("fRegion"), [{ value: "all", html: "All areas" }, ...REGIONS.map((r) => ({ value: r, html: r }))], "region", "chip");
  $("fType").addEventListener("change", (e) => { state.type = e.target.value; update(); });
  $("q").addEventListener("input", (e) => { state.q = e.target.value.trim(); update(); });
  $("q").addEventListener("keydown", (e) => {
    if (e.key === "Escape") { e.target.value = ""; state.q = ""; update(); e.target.blur(); }
    if (e.key === "Enter") { const first = ordered()[0]; if (first) { select(first.id); e.target.blur(); } }
  });
  $("reset").addEventListener("click", resetFilters);
}
function resetFilters() {
  Object.assign(state, { kind: "all", month: "all", region: "all", type: "", q: "" });
  $("q").value = "";
  $("fType").value = "";
  $("fMonth").value = "all";
  update();
}

function renderMonthSelect() {
  const sel = $("fMonth");
  const base = baseList();
  const count = (v) => base.filter((p) => matchesMonth(p, v)).length;
  const opt = (v, text) => {
    const n = v === "all" ? base.length : count(v);
    const off = n === 0 && v !== state.month;
    return `<option value="${v}"${v === state.month ? " selected" : ""}${off ? " disabled" : ""}>${text} (${n})</option>`;
  };
  const years = [...new Set(MONTH_LIST.map((v) => v.slice(0, 4)))];
  sel.innerHTML =
    opt("all", "Any time") +
    `<optgroup label="Periods">${opt("now", "Keys out now")}${opt("tier:dec", "Rest of 2026")}${opt("tier:q1", "Jan–Mar 2027")}${opt("tier:jun", "Apr–Jun 2027")}</optgroup>` +
    years.map((y) => `<optgroup label="${y}">${MONTH_LIST.filter((v) => v.startsWith(y)).map((v) => opt(v, ymLabel(v))).join("")}</optgroup>`).join("");
  sel.classList.toggle("on", state.month !== "all");
}

function renderCoverage() {
  $("coverage").innerHTML = COVERAGE.map((c) =>
    `<div><span class="k">${c.label}</span><span>keys due up to <b>${c.until}</b></span></div>`).join("") +
    `<div class="chk">Dates checked ${COVERAGE[0].checked}</div>` +
    ((new Date() - TODAY) / 864e5 > STALE_DAYS ? `<div class="stale">These dates may be out of date. Please confirm before spending.</div>` : "");
  $("colophonNote").textContent = `Data covers keys due up to ${COVERAGE[0].until}`;
}

// The map key doubles as a filter: click a pin type or a key colour, click again to clear.
const tierValue = (t) => (t === "now" ? "now" : `tier:${t}`);
function syncLegend() {
  const lg = $("legend");
  lg.querySelectorAll("[data-kind]").forEach((b) => b.setAttribute("aria-pressed", String(state.kind === b.dataset.kind)));
  lg.querySelectorAll("[data-tier]").forEach((b) => b.setAttribute("aria-pressed", String(state.month === tierValue(b.dataset.tier))));
  lg.classList.toggle("has-kind", !!lg.querySelector('[data-kind][aria-pressed="true"]'));
  lg.classList.toggle("has-tier", !!lg.querySelector('[data-tier][aria-pressed="true"]'));
}
$("legend").addEventListener("click", (e) => {
  const b = e.target.closest("button");
  if (!b) return;
  if (b.dataset.kind) state.kind = state.kind === b.dataset.kind ? "all" : b.dataset.kind;
  if (b.dataset.tier) { const v = tierValue(b.dataset.tier); state.month = state.month === v ? "all" : v; }
  update();
});

/* ---------------- List ---------------- */
function highlight(text, q) {
  const safe = esc(text);
  if (!q) return safe;
  const words = q.split(/\s+/).filter(Boolean).map((w) => esc(w).replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  if (!words.length) return safe;
  return safe.replace(new RegExp(`(${words.join("|")})`, "ig"), "<mark>$1</mark>");
}

function renderGroups(vis) {
  const wrap = $("groups");
  wrap.innerHTML = "";
  if (!vis.length) {
    wrap.innerHTML = `<div class="empty">No projects found.<br><small>Try another search, or clear the filters to see all ${PROJECTS.length}.</small><br><button type="button" id="emptyReset">Clear filters and search</button></div>`;
    $("emptyReset").addEventListener("click", resetFilters);
    return;
  }
  TIERS.forEach((t) => {
    const items = vis.filter((p) => p.tier === t.id).sort((a, b) => b.units - a.units);
    if (!items.length) return;
    const g = document.createElement("section");
    const total = items.reduce((a, p) => a + p.units, 0);
    g.innerHTML = `<div class="ghead"><span class="dot ${t.id}"></span>${t.label}<span class="gtot">${fmt(total)} homes</span></div>${t.id === "now" || t.id === "jun" ? `<p class="gsub">${t.sub}</p>` : ""}`;
    items.forEach((p) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "row" + (p.id === state.sel ? " sel" : "");
      b.dataset.id = p.id;
      const tag = isPrivate(p) ? `<span class="tag">${KIND_LABEL[p.kind]}</span>` : "";
      b.innerHTML = `<span class="nm">${highlight(p.name, state.q)}${tag}</span><span class="u">${fmt(p.units)}<small>${unitWord(p)}</small></span><span class="sub">${highlight(p.town, state.q)} · ${esc(p.region)}</span>`;
      b.addEventListener("click", () => select(p.id));
      b.addEventListener("mouseenter", () => hoverProject(p.id, true));
      b.addEventListener("mouseleave", () => hoverProject(p.id, false));
      g.appendChild(b);
    });
    wrap.appendChild(g);
  });
}

function renderTotals(vis) {
  $("sProj").innerHTML = vis.length === PROJECTS.length
    ? `<b>${vis.length}</b> projects`
    : `Showing <b>${vis.length}</b> of ${PROJECTS.length} projects`;
  $("sUnits").textContent = fmt(vis.reduce((a, p) => a + p.units, 0));
  $("sBig").textContent = fmt(vis.reduce((a, p) => a + bigUnits(p), 0));
}

/* ---------------- Detail card ---------------- */
// WhatsApp share: a short line about the project plus a link that opens the map on it.
// Pictures and floor plans come from media.js and open in the in-page viewer.
const hostOf = (u) => {
  const h = new URL(u, location.href).hostname.replace(/^www\./, "");
  return h.includes("digitaloceanspaces") ? "btohq.com" : h.includes("sanity.io") ? "terra-hill.sg" : h;
};
const mediaItems = (p) => {
  const m = MEDIA[p.id];
  if (!m) return [];
  return [...photosFor(p.id).map((ph) => ({ label: ph.caption, src: ph.src })), ...m.plans];
};
const ARROW_L = '<svg viewBox="0 0 16 16"><path d="M10 4l-4 4 4 4"/></svg>';
const ARROW_R = '<svg viewBox="0 0 16 16"><path d="M6 4l4 4-4 4"/></svg>';
function mediaTop(p) {
  const photos = photosFor(p.id);
  if (!photos.length) return "";
  const many = photos.length > 1;
  return `<div class="gallery">
      <div class="gtrack">${photos.map((ph, i) => `
        <button class="gslide" type="button" data-act="photo" data-i="${i}" aria-label="View photo ${i + 1} of ${photos.length}">
          <img src="${esc(ph.src)}" alt="${esc(p.name)}: ${esc(ph.caption)}" loading="${i === 0 ? "eager" : "lazy"}" referrerpolicy="no-referrer" data-cap="${esc(ph.caption)} · ${esc(hostOf(ph.src))}">
        </button>`).join("")}</div>
      <span class="credit"></span>
      ${many ? `<span class="gcount"></span>
      <button class="gnav prev" type="button" data-act="gprev" aria-label="Previous photo">${ARROW_L}</button>
      <button class="gnav next" type="button" data-act="gnext" aria-label="Next photo">${ARROW_R}</button>` : ""}
    </div>`;
}
// Keep the caption, counter and arrows in step with the photo showing.
function syncGallery(g) {
  const track = g.querySelector(".gtrack");
  const slides = [...track.children];
  if (!slides.length) { g.remove(); return; }
  const raw = track.clientWidth ? Math.round(track.scrollLeft / track.clientWidth) : 0;
  const i = Math.max(0, Math.min(slides.length - 1, raw || 0));
  g.querySelector(".credit").textContent = slides[i].querySelector("img").dataset.cap;
  const c = g.querySelector(".gcount");
  if (c) c.textContent = `${i + 1} / ${slides.length}`;
  const prev = g.querySelector(".gnav.prev"), next = g.querySelector(".gnav.next");
  if (prev) prev.disabled = i === 0;
  if (next) next.disabled = i === slides.length - 1;
  if (slides.length < 2) g.querySelectorAll(".gnav, .gcount").forEach((x) => x.remove());
}
function mediaPlans(p) {
  const m = MEDIA[p.id];
  if (!m) return "";
  if (m.brochure) {
    return `<div class="plansec"><div class="mixhead">Floor plans</div>
      <button class="brochure" type="button" data-act="brochure">
        <span class="bi" aria-hidden="true"><svg viewBox="0 0 16 16"><path d="M4 2.5h5l3 3v8H4z"/><path d="M9 2.5v3h3M6 9h4M6 11.5h4"/></svg></span>
        <span>HDB sales brochure<small>Layouts for every flat type, opens here</small></span>
      </button></div>`;
  }
  if (!m.plans.length) return "";
  return `<div class="plansec"><div class="mixhead">Floor plans <span class="hint">Tap to enlarge</span></div>
    <div class="plans">${m.plans.map((pl, i) => `
      <button class="plan" type="button" data-act="plan" data-i="${i}">
        <span class="pimg"><img src="${esc(pl.src)}" alt="${esc(pl.label)} floor plan" loading="lazy" referrerpolicy="no-referrer"></span>
        <span class="plbl">${esc(pl.label)}</span>
      </button>`).join("")}</div></div>`;
}
const projectLink = (p) => `${location.origin}${location.pathname}#${p.id}`;
const waLink = (p) => {
  const when = p.tier === "now" ? whenText(p) : `Keys due ${topLabel(p)}`;
  const text = `${p.name} (${KIND_LABEL[p.kind]}, ${p.town}): ${when}. ${fmt(p.units)} ${unitWord(p)}.\n${projectLink(p)}`;
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
};
const ICON = {
  up: '<svg viewBox="0 0 16 16"><path d="M4 10l4-4 4 4"/></svg>',
  down: '<svg viewBox="0 0 16 16"><path d="M4 6l4 4 4-4"/></svg>',
  min: '<svg viewBox="0 0 16 16"><path d="M4 8h8"/></svg>',
  max: '<svg viewBox="0 0 16 16"><rect x="3.5" y="3.5" width="9" height="9" rx="1.5"/></svg>',
  close: '<svg viewBox="0 0 16 16"><path d="M4.5 4.5l7 7M11.5 4.5l-7 7"/></svg>',
};

function renderDetail() {
  const card = $("detail");
  const p = byId[state.sel];
  if (!p) { card.hidden = true; card.innerHTML = ""; return; }
  const list = ordered();
  const idx = list.findIndex((x) => x.id === p.id);
  let mix;
  if (isPrivate(p)) {
    mix = `<p class="nomix">${p.unitMix ? esc(p.unitMix) : "Unit mix not published."}</p>`;
  } else if (p.mix) {
    const max = Math.max(...Object.values(p.mix));
    mix = ["2RF", "3R", "4R", "5R"].filter((k) => p.mix[k] != null).map((k) => `
      <div class="mixrow"><span>${SHORT_TYPE[k]}</span>
        <span class="track"><span class="fill" style="width:${((p.mix[k] / max) * 100).toFixed(1)}%"></span></span>
        <span class="n">${fmt(p.mix[k])}</span></div>`).join("");
  } else {
    mix = `<p class="nomix">HDB didn't publish the split. Offered: ${p.types.map((k) => TYPE_LABEL[k]).join(", ")}.</p>`;
  }
  card.classList.toggle("collapsed", state.collapsed);
  card.innerHTML = `
    <div class="dbar">
      <span class="pill"><span class="dot ${p.tier}"></span><span class="pt">${status(p)}</span></span>
      <button class="ibtn" type="button" data-act="prev" aria-label="Previous project" title="Previous (↑)" ${idx <= 0 ? "disabled" : ""}>${ICON.up}</button>
      <button class="ibtn" type="button" data-act="next" aria-label="Next project" title="Next (↓)" ${idx < 0 || idx >= list.length - 1 ? "disabled" : ""}>${ICON.down}</button>
      <button class="ibtn" type="button" data-act="collapse" aria-expanded="${!state.collapsed}" aria-label="${state.collapsed ? "Expand" : "Collapse"} card" title="${state.collapsed ? "Expand" : "Collapse"}">${state.collapsed ? ICON.max : ICON.min}</button>
      <button class="ibtn" type="button" data-act="close" aria-label="Close" title="Close (Esc)">${ICON.close}</button>
    </div>
    <h3></h3>
    <p class="when">${whenText(p)}${idx >= 0 ? ` <span class="dcount">· ${idx + 1} of ${list.length}</span>` : ""}</p>
    <div class="dbody">
      ${mediaTop(p)}
      <dl class="kv">
        <dt>Type</dt><dd>${isPrivate(p) ? `${KIND_LABEL[p.kind]}${p.tenure ? ` · ${esc(p.tenure)}` : ""}` : `HDB BTO · launched ${esc(p.launch)}`}</dd>
        ${p.developer ? `<dt>Developer</dt><dd>${esc(p.developer)}</dd>` : ""}
        <dt>Area</dt><dd class="f-town"></dd>
        <dt>Location</dt><dd class="f-st"></dd>
        <dt>${p.topObtained ? "TOP" : "Est. TOP"}</dt><dd>${topLabel(p)}${p.topObtained ? ` <span class="muted">· obtained</span>` : ""}</dd>
        <dt>${isPrivate(p) ? "Units" : "Flats"}</dt><dd>${fmt(p.units)}${p.mix && bigUnits(p) ? ` <span class="muted">· ${fmt(bigUnits(p))} are 4–5 room</span>` : ""}</dd>
        ${p.source ? `<dt>Source</dt><dd><a href="${esc(p.source)}" target="_blank" rel="noopener">${esc(new URL(p.source).hostname.replace(/^www\./, ""))}</a></dd>` : ""}
      </dl>
      <button class="switch" type="button" role="switch" aria-checked="${state.radius}" data-act="radius">
        <span>Show 1 km area<small>For location-targeted ads</small></span>
        <span class="track-sw" aria-hidden="true"></span>
      </button>
      <div class="note"><b>Targeting note.</b> <span class="f-note"></span>
        ${p.lowConfidence ? `<div class="warn">${isPrivate(p) ? "Sources disagree on this date. Confirm before spending." : "Date not confirmed by a recent source."}</div>` : ""}
      </div>
      <div class="mixhead">${isPrivate(p) ? "Unit mix" : "Flat mix"}</div>
      <div class="mix">${mix}</div>
      ${mediaPlans(p)}
      <div class="actions">
        <a class="btn primary" href="https://www.google.com/maps/search/?api=1&query=${p.lat},${p.lng}" target="_blank" rel="noopener">Google Maps</a>
        <button class="btn ghost" type="button" data-act="copy">Copy location</button>
        <a class="btn ghost" style="grid-column: 1 / -1" href="${waLink(p)}" target="_blank" rel="noopener">Share on WhatsApp</a>
      </div>
    </div>`;
  card.querySelector("h3").textContent = p.name;
  card.querySelector(".f-town").textContent = `${p.town} (${p.region})`;
  card.querySelector(".f-st").textContent = p.street;
  card.querySelector(".f-note").textContent = p.note;
  // A picture that fails to load is removed instead of showing a broken image.
  card.querySelectorAll(".plan img").forEach((img) => img.addEventListener("error", () => {
    img.closest(".plan")?.remove();
    if (!card.querySelector(".plan, .brochure")) card.querySelector(".plansec")?.remove();
  }));
  const gal = card.querySelector(".gallery");
  if (gal) {
    gal.querySelectorAll("img").forEach((img) => img.addEventListener("error", () => {
      img.closest(".gslide")?.remove();
      gal.querySelectorAll(".gslide").forEach((b, k) => { b.dataset.i = k; });
      syncGallery(gal);
    }));
    gal.querySelector(".gtrack").addEventListener("scroll", () => syncGallery(gal), { passive: true });
    syncGallery(gal);
  }
  card.hidden = false;
}

$("detail").addEventListener("click", (e) => {
  const act = e.target.closest("[data-act]")?.dataset.act;
  const p = byId[state.sel];
  if (!act || !p) return;
  if (act === "prev") step(-1);
  if (act === "next") step(1);
  if (act === "close") select(null);
  if (act === "collapse") { state.collapsed = !state.collapsed; renderDetail(); }
  if (act === "radius") { state.radius = !state.radius; renderDetail(); updateRing(); }
  if (act === "photo") {
    const src = e.target.closest(".gslide")?.querySelector("img")?.getAttribute("src");
    const items = mediaItems(p);
    openImages(p.name, items, Math.max(0, items.findIndex((x) => x.src === src)));
  }
  if (act === "gprev" || act === "gnext") {
    const t = e.target.closest(".gallery").querySelector(".gtrack");
    t.scrollBy({ left: (act === "gnext" ? 1 : -1) * t.clientWidth, behavior: "smooth" });
  }
  if (act === "plan") {
    const items = mediaItems(p);
    const src = MEDIA[p.id].plans[Number(e.target.closest("[data-i]").dataset.i)].src;
    openImages(p.name, items, Math.max(0, items.findIndex((x) => x.src === src)));
  }
  if (act === "brochure") openPdf(p.name, MEDIA[p.id].brochure, MEDIA[p.id].brochureSrc);
  if (act === "copy") copy(`${p.name}, ${p.street} (${p.lat.toFixed(5)}, ${p.lng.toFixed(5)})`, "Location copied");
});

function step(dir) {
  const list = ordered();
  if (!list.length) return;
  const i = list.findIndex((x) => x.id === state.sel);
  const next = i < 0 ? (dir > 0 ? 0 : list.length - 1) : i + dir;
  if (next < 0 || next >= list.length) return;
  select(list[next].id);
}

/* ---------------- Menu, clipboard, toast ---------------- */
const menu = $("menu");
const moreBtn = $("moreBtn");
function setMenu(open) { menu.hidden = !open; moreBtn.setAttribute("aria-expanded", String(open)); }
moreBtn.addEventListener("click", (e) => { e.stopPropagation(); setMenu(menu.hidden); });
document.addEventListener("click", (e) => { if (!menu.hidden && !menu.contains(e.target)) setMenu(false); });

let toastTimer;
function toast(msg) {
  const t = $("toast");
  t.textContent = msg;
  t.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => (t.hidden = true), 2200);
}
async function copy(text, okMsg) {
  try { await navigator.clipboard.writeText(text); toast(okMsg); }
  catch {
    const ta = document.createElement("textarea");
    ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0";
    document.body.appendChild(ta); ta.select();
    try { document.execCommand("copy"); toast(okMsg); } catch { toast("The browser blocked copying"); }
    ta.remove();
  }
}
$("copyBtn").addEventListener("click", () => {
  setMenu(false);
  const rows = [["Project", "Type", "Developer", "Area", "Region", "Est. completion", "Homes", "Known 4/5-room HDB", "Flat / unit types", "Location", "Lat", "Lng", "Source"]];
  ordered().forEach((p) =>
    rows.push([p.name, KIND_LABEL[p.kind], p.developer || "HDB", p.town, p.region, p.tier === "now" ? (p.topObtained ? `TOP ${topLabel(p)}` : "Keys out now") : topLabel(p), p.units, p.mix ? bigUnits(p) : "", isPrivate(p) ? p.unitMix || "" : p.types.map((k) => TYPE_LABEL[k]).join(", "), p.street, p.lat, p.lng, p.source || ""]));
  copy(rows.map((r) => r.join("\t")).join("\n"), `Copied ${rows.length - 1} projects. Paste into a sheet.`);
});

/* ---------------- R+R pins ---------------- */
function pinSVG(uid, dark) {
  const stops = dark ? ["#3a3632", "#2a2724", "#1c1a18"] : ["#ffffff", "#fcfaf6", "#f0e9dd"];
  // Same construction as the showroom pin on the Rezt+Relax site footer.
  return `<svg viewBox="0 0 52 72" aria-hidden="true" focusable="false">
    <defs><linearGradient id="g-${uid}" x1="26" y1="3.2" x2="26" y2="68.6" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="${stops[0]}"/><stop offset="0.58" stop-color="${stops[1]}"/><stop offset="1" stop-color="${stops[2]}"/>
    </linearGradient></defs>
    <path d="M26 3.2 C14.6 3.2 5.4 12.6 5.4 24.2 C5.4 38.6 26 68.6 26 68.6 C26 68.6 46.6 38.6 46.6 24.2 C46.6 12.6 37.4 3.2 26 3.2 Z" fill="url(#g-${uid})" stroke="rgb(176,136,60)" stroke-width="2.1" stroke-linejoin="round"/>
    <path d="M26 3.2 C14.6 3.2 5.4 12.6 5.4 24.2 C5.4 38.6 26 68.6 26 68.6 C26 68.6 46.6 38.6 46.6 24.2 C46.6 12.6 37.4 3.2 26 3.2 Z" transform="translate(26 24.2) scale(0.875) translate(-26 -24.2)" fill="none" stroke="rgb(176,136,60)" stroke-opacity="0.42" stroke-width="1.5" stroke-linejoin="round"/>
    <image href="/mark-r-gold.png" x="16.7" y="9.8" width="18.6" height="28.2" preserveAspectRatio="xMidYMid meet"/>
  </svg>`;
}

const markers = {}; // project id -> { el, m }
function buildMarkers() {
  PROJECTS.forEach((p, i) => {
    const el = document.createElement("div");
    el.className = "rr-marker" + (p.tier === "now" ? " is-live" : "") + (p.tier === "jun" ? " is-later" : "") + (isPrivate(p) ? " is-private" : "");
    el.setAttribute("role", "button");
    el.setAttribute("tabindex", "0");
    el.setAttribute("aria-label", `${p.name}, ${KIND_LABEL[p.kind]}, ${fmt(p.units)} ${unitWord(p)}, ${p.tier === "now" ? "keys out now" : "estimated " + topLabel(p)}`);
    el.innerHTML = `
      <div class="rr-pin">
        <span class="rr-pin__glow"></span>
        <span class="rr-pin__ping"></span><span class="rr-pin__ping rr-pin__ping--b"></span><span class="rr-pin__ping rr-pin__ping--c"></span>
        ${pinSVG(i, isPrivate(p))}
        <span class="rr-ring ${p.tier}"></span>
      </div>
      <div class="rr-label"><b></b><span><span class="dot ${p.tier}"></span><span class="lt"></span></span></div>`;
    el.querySelector(".rr-label b").textContent = p.name;
    el.querySelector(".rr-label .lt").textContent = `${KIND_LABEL[p.kind]} · ${fmt(p.units)} ${unitWord(p)} · ${p.tier === "now" ? "keys out now" : "est. " + topLabel(p)}`;
    el.addEventListener("click", (e) => { e.stopPropagation(); select(p.id); });
    el.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); select(p.id); } });
    el.addEventListener("mouseenter", () => document.querySelector(`.row[data-id="${p.id}"]`)?.classList.add("hl"));
    el.addEventListener("mouseleave", () => document.querySelector(`.row[data-id="${p.id}"]`)?.classList.remove("hl"));
    const m = new mapboxgl.Marker({ element: el, anchor: "bottom" }).setLngLat([p.lng, p.lat]);
    markers[p.id] = { el, m };
  });
}

function renderMarkerStates() {
  Object.entries(markers).forEach(([id, { el }]) => el.classList.toggle("is-sel", id === state.sel));
}

/* ---------------- Clusters ---------------- */
// A clustered GeoJSON source decides what is on screen; we mirror it with HTML markers.
const clusterCache = {}; // "c<id>" -> { el, m, ids:Set }
let onScreen = {}; // key -> mapboxgl.Marker

const toGeoJSON = (list) => ({
  type: "FeatureCollection",
  features: list.map((p) => ({ type: "Feature", geometry: { type: "Point", coordinates: [p.lng, p.lat] }, properties: { id: p.id, units: p.units } })),
});

function callSrc(method, ...args) {
  // mapbox-gl 3 supports callbacks; guard for a promise-returning variant too.
  return new Promise((resolve) => {
    const src = map.getSource("pc");
    const r = src[method](...args, (err, val) => resolve(err ? null : val));
    if (r && typeof r.then === "function") r.then(resolve, () => resolve(null));
  });
}

function clusterEl(props, coords) {
  const el = document.createElement("div");
  el.className = "rr-cluster";
  el.setAttribute("role", "button");
  el.setAttribute("tabindex", "0");
  el.setAttribute("aria-label", `${props.point_count} projects, ${fmt(props.units)} flats. Zoom in`);
  el.innerHTML = `<span class="rr-cluster__ball">${props.point_count}</span><span class="rr-cluster__sub">${fmt(props.units)} flats</span>`;
  const zoomIn = async () => {
    const z = await callSrc("getClusterExpansionZoom", props.cluster_id);
    map.easeTo({ center: coords, zoom: Math.min((z ?? map.getZoom() + 2) + 0.3, 16), duration: reduceMotion ? 0 : 650 });
  };
  el.addEventListener("click", (e) => { e.stopPropagation(); zoomIn(); });
  el.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); zoomIn(); } });
  return el;
}

function refreshMarkers() {
  if (!map || !map.getSource("pc") || !map.isSourceLoaded("pc")) return;
  const next = {};
  for (const f of map.querySourceFeatures("pc")) {
    const props = f.properties;
    if (props.cluster) {
      const key = "c" + props.cluster_id;
      if (next[key]) continue;
      let entry = clusterCache[key];
      if (!entry) {
        const coords = f.geometry.coordinates;
        const el = clusterEl(props, coords);
        entry = clusterCache[key] = { el, m: new mapboxgl.Marker({ element: el, anchor: "center" }).setLngLat(coords), ids: new Set() };
        callSrc("getClusterLeaves", props.cluster_id, Infinity, 0).then((leaves) => {
          entry.ids = new Set((leaves || []).map((l) => l.properties.id));
        });
      }
      next[key] = entry.m;
    } else if (markers[props.id]) {
      next["p" + props.id] = markers[props.id].m;
    }
  }
  // The selected pin always shows, even if its neighbours would cluster it.
  if (state.sel && markers[state.sel] && !next["p" + state.sel] && visible().some((p) => p.id === state.sel)) {
    next["p" + state.sel] = markers[state.sel].m;
  }
  for (const k in next) if (onScreen[k] !== next[k]) next[k].addTo(map);
  for (const k in onScreen) if (!next[k]) onScreen[k].remove();
  onScreen = next;
}

function setClusterData(vis) {
  if (!map || !map.getSource("pc")) return;
  // Cluster ids are reassigned when the data changes, so drop the old bubbles.
  for (const k in clusterCache) { clusterCache[k].m.remove(); delete clusterCache[k]; }
  for (const k in onScreen) if (k.startsWith("c")) delete onScreen[k];
  map.getSource("pc").setData(toGeoJSON(vis));
}

/* ---------------- Hover between list and map ---------------- */
let hoverTimer;
function hoverProject(id, on) {
  markers[id]?.el.classList.toggle("is-hover", on);
  Object.values(clusterCache).forEach((c) => c.el.classList.toggle("is-hover", on && c.ids.has(id)));
  clearTimeout(hoverTimer);
  if (!on || !map || state.sel || !canHover) return; // don't drag the map away from an open project
  hoverTimer = setTimeout(() => {
    if (state.sel) return;
    const p = byId[id];
    const pt = map.project([p.lng, p.lat]);
    const pad = mapPadding();
    const { width, height } = map.getContainer().getBoundingClientRect();
    const off = pt.x < pad.left || pt.x > width - pad.right || pt.y < pad.top + 50 || pt.y > height - pad.bottom;
    if (off) map.easeTo({ center: [p.lng, p.lat], duration: reduceMotion ? 0 : 650 });
  }, 400);
}

/* ---------------- Map ---------------- */
let map = null;

function circlePolygon(lng, lat, meters, steps = 96) {
  const coords = [];
  const dLat = meters / 111320;
  const dLng = meters / (111320 * Math.cos((lat * Math.PI) / 180));
  for (let i = 0; i <= steps; i++) {
    const a = (i / steps) * Math.PI * 2;
    coords.push([lng + dLng * Math.cos(a), lat + dLat * Math.sin(a)]);
  }
  return { type: "Feature", geometry: { type: "Polygon", coordinates: [coords] }, properties: {} };
}

function mapPadding() {
  if (isPhone()) {
    // Keep pins clear of whatever covers the bottom of the screen: the card, or the list sheet.
    const card = $("detail");
    const cover = !card.hidden ? card.getBoundingClientRect().height : $("side").getBoundingClientRect().height;
    const bottom = Math.min(window.innerHeight * 0.7, cover + 16);
    return { top: 64, bottom, left: 24, right: 24 };
  }
  // Keep the selected pin clear of the card on the right.
  const cardW = $("detail").hidden ? 0 : $("detail").getBoundingClientRect().width + 40;
  return { top: 64, bottom: 40, left: 40, right: Math.max(40, cardW) };
}

// Lock the map to Singapore: no zooming out past the "All of Singapore" view, and no panning
// beyond what that view shows. Recomputed for the screen size, so phones still see the whole island.
function lockToSingapore() {
  if (!map) return;
  const pad = isPhone()
    ? { top: 64, bottom: $("side").getBoundingClientRect().height + 16, left: 24, right: 24 }
    : { top: 64, bottom: 40, left: 40, right: 40 };
  const cam = map.cameraForBounds(SG_VIEW, { padding: pad });
  if (!cam) return;
  const c = mapboxgl.LngLat.convert(cam.center);
  const { width, height } = map.getContainer().getBoundingClientRect();
  const degPerPx = 360 / (512 * Math.pow(2, cam.zoom));
  const hx = (width * degPerPx) / 2;
  const hy = (height * degPerPx) / 2;
  map.setMinZoom(null);
  map.setMaxBounds([[c.lng - hx, c.lat - hy], [c.lng + hx, c.lat + hy]]);
  map.setMinZoom(cam.zoom);
}

function overview(animate = true) {
  if (!map) return;
  map.fitBounds(SG_VIEW, { padding: mapPadding(), pitch: 0, bearing: 0, duration: animate && !reduceMotion ? 1300 : 0 });
}

const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi);
function bounceBack(e) {
  if (!map || e?.bounce) return;
  const c = map.getCenter();
  let dLng = 0;
  let dLat = 0;
  if (map.getPitch() > 10) {
    dLng = clamp(c.lng, CENTER_BOX.w, CENTER_BOX.e) - c.lng;
    dLat = clamp(c.lat, CENTER_BOX.s, CENTER_BOX.n) - c.lat;
  } else {
    const b = map.getBounds();
    const [[w, s], [east, n]] = SG_VIEW;
    const halfW = (b.getEast() - b.getWest()) / 2;
    const halfH = (b.getNorth() - b.getSouth()) / 2;
    const midLng = (b.getEast() + b.getWest()) / 2;
    const midLat = (b.getNorth() + b.getSouth()) / 2;
    const wantLng = halfW * 2 >= east - w ? (w + east) / 2 : clamp(midLng, w + halfW, east - halfW);
    const wantLat = halfH * 2 >= n - s ? (s + n) / 2 : clamp(midLat, s + halfH, n - halfH);
    dLng = wantLng - midLng;
    dLat = wantLat - midLat;
  }
  if (Math.abs(dLng) < 1e-5 && Math.abs(dLat) < 1e-5) return;
  map.easeTo(
    { center: [c.lng + dLng, c.lat + dLat], duration: reduceMotion ? 0 : 700, easing: (t) => 1 + 2.2 * Math.pow(t - 1, 3) + 1.2 * Math.pow(t - 1, 2) },
    { bounce: true },
  );
}

let roadLabelsOn = null;
function syncBaseLabels() {
  const want = map.getZoom() >= ROAD_LABEL_ZOOM;
  if (want === roadLabelsOn) return;
  roadLabelsOn = want;
  try {
    map.setConfigProperty("basemap", "showRoadLabels", want);
    map.setConfigProperty("basemap", "showTransitLabels", want);
  } catch { /* style without these options */ }
}

// Map or satellite photos. Place names are our own Singapore-only layer, so the base map's are off.
const MAP_STYLE = "mapbox://styles/mapbox/standard";
const SAT_STYLE = "mapbox://styles/mapbox/standard-satellite";
const MAP_BASEMAP = { lightPreset: "day", theme: "faded", showPointOfInterestLabels: false, showTransitLabels: false, showRoadLabels: false, showPlaceLabels: false };
const SAT_BASEMAP = { lightPreset: "day", showPointOfInterestLabels: false, showTransitLabels: false, showRoadLabels: false, showPlaceLabels: false };
let satellite = false;
function setSatellite(on) {
  if (!map || on === satellite) return;
  satellite = on;
  map.setStyle(on ? SAT_STYLE : MAP_STYLE, { diff: false, config: { basemap: on ? SAT_BASEMAP : MAP_BASEMAP } });
  $("btnSat").setAttribute("aria-pressed", String(on));
  $("btnSat").querySelector(".lbl").textContent = on ? "Map view" : "Satellite";
}

function initMap(token) {
  mapboxgl.accessToken = token;
  map = new mapboxgl.Map({
    container: "map",
    style: MAP_STYLE,
    config: { basemap: MAP_BASEMAP },
    bounds: SG_VIEW,
    fitBoundsOptions: { padding: mapPadding() },
    maxBounds: HARD_LIMIT,
    antialias: true,
  });
  map.keyboard.disable(); // arrow keys step through projects instead
  // North always up and flat: no rotating or tilting by hand.
  map.dragRotate.disable();
  map.touchZoomRotate.disableRotation();
  map.touchPitch.disable();
  map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), "bottom-right");

  map.once("load", () => {
    map.getContainer().classList.toggle("pins-small", map.getZoom() < SMALL_PIN_ZOOM);
    lockToSingapore();
    const ld = $("loading");
    ld.classList.add("done");
    setTimeout(() => (ld.hidden = true), 450);
  });

  map.on("style.load", () => {
    roadLabelsOn = null;
    try { map.setConfigProperty("basemap", "showPlaceLabels", false); map.setConfigProperty("basemap", "showPointOfInterestLabels", false); } catch { /* style without these options */ }
    syncBaseLabels();
    if (map.getSource("countries")) return; // our layers are already on this style

    // Fade everything outside Singapore so Johor and the Riau islands recede.
    map.addSource("countries", { type: "vector", url: "mapbox://mapbox.country-boundaries-v1" });
    map.addLayer({
      id: "not-sg",
      type: "fill",
      source: "countries",
      "source-layer": "country_boundaries",
      slot: "top",
      filter: ["all", ["!=", ["get", "iso_3166_1"], "SG"], ["match", ["get", "worldview"], ["all", "US"], true, false]],
      paint: { "fill-color": satellite ? "#15303f" : "#b5eafc", "fill-opacity": 1, "fill-emissive-strength": 1 },
    });
    // Place names for Singapore only, so no Malaysian or Indonesian towns are named.
    map.addSource("streets", { type: "vector", url: "mapbox://mapbox.mapbox-streets-v8" });
    // Busier areas get named first; smaller neighbourhoods appear as you zoom in.
    [[0, 3, 0], [4, 4, 12.5], [5, 99, 13.8]].forEach(([lo, hi, minzoom], i) => map.addLayer({
      id: `sg-places-${i}`,
      type: "symbol",
      source: "streets",
      "source-layer": "place_label",
      slot: "top",
      minzoom,
      filter: ["all", ["==", ["get", "iso_3166_1"], "SG"], ["==", ["get", "class"], "settlement_subdivision"], [">=", ["get", "filterrank"], lo], ["<=", ["get", "filterrank"], hi]],
      layout: {
        "text-field": ["coalesce", ["get", "name_en"], ["get", "name"]],
        "text-size": ["interpolate", ["linear"], ["zoom"], 10, 10.5, 14, 13],
        "text-transform": "uppercase",
        "text-letter-spacing": 0.08,
        "text-max-width": 7,
        "symbol-sort-key": ["get", "symbolrank"],
      },
      paint: satellite
        ? { "text-color": "#ffffff", "text-halo-color": "rgba(0,0,0,0.75)", "text-halo-width": 1.4, "text-emissive-strength": 1 }
        : { "text-color": "#6f6a62", "text-halo-color": "rgba(255,255,255,0.9)", "text-halo-width": 1.2, "text-emissive-strength": 1 },
    }));

    map.addSource("ring", { type: "geojson", data: { type: "FeatureCollection", features: [] } });
    map.addLayer({ id: "ring-fill", type: "fill", source: "ring", slot: "top", paint: { "fill-color": BRONZE, "fill-opacity": 0.1, "fill-emissive-strength": 1 } });
    map.addLayer({ id: "ring-line", type: "line", source: "ring", slot: "top", paint: { "line-color": BRONZE, "line-width": 1.6, "line-dasharray": [3, 2], "line-emissive-strength": 1 } });

    map.addSource("pc", {
      type: "geojson",
      data: toGeoJSON(visible()),
      cluster: false, // every project gets its own pin
    });
    // Invisible layer so the source gets tiled and querySourceFeatures returns data.
    map.addLayer({ id: "pc-hit", type: "circle", source: "pc", slot: "top", paint: { "circle-radius": 1, "circle-opacity": 0 } });
    updateRing();
  });

  map.on("render", refreshMarkers);
  map.on("resize", lockToSingapore);
  map.on("moveend", bounceBack);
  map.on("zoom", () => {
    map.getContainer().classList.toggle("labels-on", map.getZoom() >= LABEL_ZOOM);
    map.getContainer().classList.toggle("pins-small", map.getZoom() < SMALL_PIN_ZOOM);
    syncBaseLabels();
  });
  map.on("click", () => { if (state.sel) select(null); });
  map.on("error", (e) => {
    if (/401|403|token/i.test(String(e?.error?.message || ""))) { $("notoken").hidden = false; $("loading").hidden = true; }
  });
  window.__btoMap = map; // handy for debugging in the console
}

function updateRing() {
  if (!map || !map.getSource("ring")) return;
  const p = byId[state.sel];
  map.getSource("ring").setData({ type: "FeatureCollection", features: p && state.radius ? [circlePolygon(p.lng, p.lat, 1000)] : [] });
}

/* ---------------- Selection ---------------- */
function select(id) {
  if (id && !byId[id]) id = null;
  if (id !== state.sel && id) state.collapsed = false;
  state.sel = id;
  history.replaceState(null, "", id ? "#" + id : location.pathname + location.search);
  if (id) setSheet(false);
  document.body.classList.toggle("has-card", !!id);
  update({ keepClusters: true });
  const row = id && document.querySelector(`.row[data-id="${id}"]`);
  if (row) row.scrollIntoView({ block: "nearest", behavior: reduceMotion ? "auto" : "smooth" });
  if (!map) return;
  if (id) {
    const p = byId[id];
    map.flyTo({ center: [p.lng, p.lat], zoom: 15.3, pitch: 50, bearing: 0, padding: mapPadding(), duration: reduceMotion ? 0 : 1800, essential: true });
  } else {
    overview();
  }
}

let lastVisKey = null;
function update(opts = {}) {
  // Flat size only applies to HDB, so it shows (and filters) only when HDB BTO is picked.
  if (state.kind !== "bto" && state.type) { state.type = ""; $("fType").value = ""; }
  $("fldType").hidden = state.kind !== "bto";
  const vis = visible();
  // A filter or search that hides the open project closes it and zooms back out.
  if (state.sel && !vis.some((p) => p.id === state.sel)) {
    state.sel = null;
    history.replaceState(null, "", location.pathname + location.search);
    document.body.classList.remove("has-card");
    if (map) requestAnimationFrame(() => overview());
  }
  syncRadios($("fKind"), state.kind);
  if (state.kind === "private") $("fKind").querySelectorAll('[data-value="condo"],[data-value="ec"]').forEach((b) => b.setAttribute("aria-checked", "true"));
  syncLegend();
  renderMonthSelect();
  syncRadios($("fRegion"), state.region);
  $("fType").classList.toggle("on", !!state.type);
  $("reset").hidden = !filtersActive();
  const nf = activeFilterCount();
  $("filtBtn").textContent = nf ? `Filters · ${nf} on` : "Filters";
  renderTotals(vis);
  renderGroups(vis);
  renderMarkerStates();
  renderDetail();
  updateRing();
  const key = vis.map((p) => p.id).join(",");
  if (key !== lastVisKey || !opts.keepClusters) { lastVisKey = key; setClusterData(vis); }
  if (map) map.triggerRepaint();
}

/* ---------------- Keyboard ---------------- */
document.addEventListener("keydown", (e) => {
  const typing = /^(INPUT|SELECT|TEXTAREA)$/.test(e.target.tagName);
  if (e.key === "Escape") {
    if (!menu.hidden) { setMenu(false); moreBtn.focus(); return; }
    if (!typing && state.sel) select(null);
    return;
  }
  if (typing || e.metaKey || e.ctrlKey || e.altKey) return;
  if (e.key === "ArrowDown" || e.key === "ArrowRight") { e.preventDefault(); step(1); }
  if (e.key === "ArrowUp" || e.key === "ArrowLeft") { e.preventDefault(); step(-1); }
  if (e.key === "/") { e.preventDefault(); $("q").focus(); }
});

/* ---------------- Tools ---------------- */
$("btnOverview").addEventListener("click", () => select(null));
$("btnSat").addEventListener("click", () => setSatellite(!satellite));
// Phone: the list is a bottom sheet that peeks up from the bottom and opens to almost full height.
function setSheet(open) {
  $("side").classList.toggle("open", open);
  $("sheetBtn").textContent = open ? "Show map" : "Show list";
  $("sheetBtn").setAttribute("aria-expanded", String(open));
}
$("grab").addEventListener("click", () => setSheet(!$("side").classList.contains("open")));
$("sheetBtn").addEventListener("click", () => setSheet(!$("side").classList.contains("open")));

/* ---------------- Boot ---------------- */
buildFilters();
renderCoverage();
buildMarkers();
update();

const token = import.meta.env.VITE_MAPBOX_TOKEN;
if (!token) {
  $("notoken").hidden = false;
  $("loading").hidden = true;
} else {
  initMap(token);
  const fromHash = decodeURIComponent(location.hash.slice(1));
  if (byId[fromHash]) map.once("load", () => select(fromHash));
}

// Full-screen viewer for building pictures, floor plans and HDB brochures (PDF).
// PDFs are drawn page by page with pdf.js, loaded only when someone opens one.

let root, body, titleEl, countEl, prevBtn, nextBtn, extLink, captionEl;
let items = [];
let idx = 0;
let pdfJob = 0;
let lastFocus = null;

const X = '<svg viewBox="0 0 16 16"><path d="M4.5 4.5l7 7M11.5 4.5l-7 7"/></svg>';
const L = '<svg viewBox="0 0 16 16"><path d="M10 4l-4 4 4 4"/></svg>';
const R = '<svg viewBox="0 0 16 16"><path d="M6 4l4 4-4 4"/></svg>';

function build() {
  if (root) return;
  root = document.createElement("div");
  root.className = "viewer";
  root.hidden = true;
  root.setAttribute("role", "dialog");
  root.setAttribute("aria-modal", "true");
  root.innerHTML = `
    <div class="vbar">
      <div class="vtitle"><b></b><span class="vcount"></span></div>
      <a class="vlink" target="_blank" rel="noopener noreferrer">Open original</a>
      <button class="ibtn vclose" type="button" aria-label="Close" title="Close (Esc)">${X}</button>
    </div>
    <div class="vbody"></div>
    <div class="vfoot">
      <button class="ibtn vprev" type="button" aria-label="Previous">${L}</button>
      <span class="vcap"></span>
      <button class="ibtn vnext" type="button" aria-label="Next">${R}</button>
    </div>`;
  document.body.appendChild(root);
  body = root.querySelector(".vbody");
  titleEl = root.querySelector(".vtitle b");
  countEl = root.querySelector(".vcount");
  prevBtn = root.querySelector(".vprev");
  nextBtn = root.querySelector(".vnext");
  extLink = root.querySelector(".vlink");
  captionEl = root.querySelector(".vcap");
  root.querySelector(".vclose").addEventListener("click", closeViewer);
  prevBtn.addEventListener("click", () => go(-1));
  nextBtn.addEventListener("click", () => go(1));
  // Click on the dark area around an image closes the viewer.
  body.addEventListener("click", (e) => { if (e.target === body && items.length) closeViewer(); });
  // Swipe between pictures on phones.
  let sx = null;
  body.addEventListener("touchstart", (e) => { sx = e.touches.length === 1 ? e.touches[0].clientX : null; }, { passive: true });
  body.addEventListener("touchend", (e) => {
    if (sx == null || !items.length || body.querySelector("img.zoom")) return;
    const dx = e.changedTouches[0].clientX - sx;
    if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
    sx = null;
  });
  document.addEventListener("keydown", (e) => {
    if (root.hidden) return;
    if (e.key === "Escape") { e.stopImmediatePropagation(); e.preventDefault(); closeViewer(); }
    else if (items.length && (e.key === "ArrowRight" || e.key === "ArrowLeft")) {
      e.stopImmediatePropagation(); e.preventDefault(); go(e.key === "ArrowRight" ? 1 : -1);
    } else if (e.key === "ArrowUp" || e.key === "ArrowDown") e.stopImmediatePropagation();
  }, true);
}

function show(title) {
  build();
  lastFocus = document.activeElement;
  titleEl.textContent = title;
  root.hidden = false;
  document.documentElement.classList.add("viewer-open");
  root.querySelector(".vclose").focus();
}

export function closeViewer() {
  if (!root || root.hidden) return;
  pdfJob++;
  root.hidden = true;
  body.innerHTML = "";
  items = [];
  document.documentElement.classList.remove("viewer-open");
  if (lastFocus && lastFocus.focus) lastFocus.focus();
}

function go(d) {
  if (!items.length) return;
  idx = (idx + d + items.length) % items.length;
  renderImage();
}

function renderImage() {
  const it = items[idx];
  countEl.textContent = items.length > 1 ? `${idx + 1} of ${items.length}` : "";
  captionEl.textContent = it.label || "";
  extLink.href = it.src;
  extLink.hidden = false;
  prevBtn.hidden = nextBtn.hidden = items.length < 2;
  root.querySelector(".vfoot").hidden = items.length < 2 && !it.label;
  body.className = "vbody img";
  body.innerHTML = `<div class="vspin">Loading…</div>`;
  const img = new Image();
  img.referrerPolicy = "no-referrer";
  img.alt = it.label || "";
  img.title = "Tap to zoom";
  img.onload = () => { body.innerHTML = ""; body.appendChild(img); };
  img.onerror = () => { body.innerHTML = `<div class="vspin">This picture didn't load. Try “Open original”.</div>`; };
  img.addEventListener("click", () => {
    img.classList.toggle("zoom");
    if (img.classList.contains("zoom")) body.scrollTo({ left: (img.scrollWidth - body.clientWidth) / 2, top: 0 });
  });
  img.src = it.src;
}

export function openImages(title, list, start = 0) {
  if (!list.length) return;
  show(title);
  items = list;
  idx = start;
  renderImage();
}

export async function openPdf(title, url, original) {
  show(title);
  items = [];
  const job = ++pdfJob;
  countEl.textContent = "HDB sales brochure";
  extLink.href = original || url;
  extLink.hidden = false;
  root.querySelector(".vfoot").hidden = true;
  body.className = "vbody pdf";
  body.innerHTML = `<div class="vspin">Loading brochure… <small>Floor plans are in the later pages.</small></div>`;
  try {
    const pdfjs = await import("pdfjs-dist");
    const worker = (await import("pdfjs-dist/build/pdf.worker.min.mjs?url")).default;
    pdfjs.GlobalWorkerOptions.workerSrc = worker;
    const doc = await pdfjs.getDocument({ url, disableAutoFetch: true }).promise;
    if (job !== pdfJob) return;
    countEl.textContent = `HDB sales brochure · ${doc.numPages} pages`;
    const first = await doc.getPage(1);
    const vp1 = first.getViewport({ scale: 1 });
    body.innerHTML = `<p class="vhint">Floor plans are in the later pages. Scroll down.<span class="vjump"></span></p>`;
    const io = new IntersectionObserver((entries) => {
      for (const en of entries) {
        if (!en.isIntersecting) continue;
        io.unobserve(en.target);
        drawPage(doc, Number(en.target.dataset.n), en.target, job);
      }
    }, { root: body, rootMargin: "800px 0px" });
    for (let n = 1; n <= doc.numPages; n++) {
      const box = document.createElement("div");
      box.className = "vpage";
      box.dataset.n = n;
      box.style.aspectRatio = `${vp1.width} / ${vp1.height}`;
      box.innerHTML = `<span>Page ${n}</span>`;
      body.appendChild(box);
      io.observe(box);
    }
    findPlanPages(doc, job);
  } catch (err) {
    if (job !== pdfJob) return;
    console.warn("Brochure failed to load", err);
    body.innerHTML = `<div class="vspin">The brochure couldn't load here.<br><a href="${original || url}" target="_blank" rel="noopener noreferrer">Open the PDF instead</a></div>`;
  }
}

// Look through the brochure text for unit layout pages ("floor area") and add shortcuts to them.
async function findPlanPages(doc, job) {
  const hits = [];
  for (let n = 1; n <= doc.numPages; n++) {
    if (job !== pdfJob) return;
    try {
      const page = await doc.getPage(n);
      const tc = await page.getTextContent();
      const text = tc.items.map((t) => t.str).join(" ");
      if (/floor\s*area|unit\s*layout|typical\s*floor\s*plan/i.test(text)) hits.push(n);
    } catch (_) { /* skip page */ }
  }
  if (job !== pdfJob || !hits.length) return;
  const slot = body.querySelector(".vjump");
  if (!slot) return;
  slot.innerHTML = `<br>Jump to floor plans: ${hits.map((n) => `<button type="button" data-p="${n}">p.${n}</button>`).join("")}`;
  body.querySelector(".vhint").textContent = "";
  body.querySelector(".vhint").appendChild(slot);
  slot.addEventListener("click", (e) => {
    const n = e.target.closest("[data-p]")?.dataset.p;
    if (n) body.querySelector(`.vpage[data-n="${n}"]`)?.scrollIntoView({ block: "start" });
  });
}

async function drawPage(doc, n, box, job) {
  try {
    const page = await doc.getPage(n);
    if (job !== pdfJob) return;
    const base = page.getViewport({ scale: 1 });
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const scale = (box.clientWidth / base.width) * dpr;
    const vp = page.getViewport({ scale });
    const canvas = document.createElement("canvas");
    canvas.width = Math.floor(vp.width);
    canvas.height = Math.floor(vp.height);
    box.style.aspectRatio = `${base.width} / ${base.height}`;
    await page.render({ canvas, canvasContext: canvas.getContext("2d"), viewport: vp }).promise;
    if (job !== pdfJob) return;
    box.innerHTML = "";
    box.appendChild(canvas);
  } catch (err) {
    box.innerHTML = `<span>Page ${n} didn't load</span>`;
  }
}


// Signal Stories — engine + categories (static hosting friendly)

const APP = {
  appName: "Signal Stories",
  storageKey: "signalStories.save.v1",

  categories: [
    { id: "horror",  title: "🟥 Horror",  subtitle: "Dark, tense, scary" },
    { id: "mystery", title: "🟨 Mystery", subtitle: "Clues, secrets, twists" },
    { id: "romance", title: "💙 Romance", subtitle: "Love, drama, choices" },
  ],

  // episode files must define: window.episode1, window.episode2, ...
  episodes: [
    { id: 1, title: "The Locked Signal — Ep 1", dataVar: "episode1", isFree: true,  categoryId: "horror" },
    { id: 2, title: "The Visitor — Ep 2",      dataVar: "episode2", isFree: false, categoryId: "horror" },
    { id: 3, title: "The Envelope — Ep 3",     dataVar: "episode3", isFree: false, categoryId: "horror" },
    { id: 4, title: "The Camera — Ep 4",       dataVar: "episode4", isFree: false, categoryId: "horror" },
    { id: 5, title: "The Signal — Ep 5",       dataVar: "episode5", isFree: false, categoryId: "horror" },
    { id: 6, title: "The Rooftop — Ep 6",      dataVar: "episode6", isFree: false, categoryId: "horror" },
    { id: 7, title: "The Operator — Ep 7",     dataVar: "episode7", isFree: false, categoryId: "horror" },
    { id: 8, title: "The Truth — Ep 8",        dataVar: "episode8", isFree: false, categoryId: "horror" },
    
    { id: 101, title: "Late Night Messages — Ep1", dataVar: "romance1_ep1", isFree: true, categoryId: "romance" },
{ id: 102, title: "Late Night Messages — Ep2", dataVar: "romance1_ep2", isFree: false, categoryId: "romance" },
{ id: 103, title: "Late Night Messages — Ep3", dataVar: "romance1_ep3", isFree: false, categoryId: "romance" },

  ],
};



// ---------- State ----------
let state = loadState() || {
  unlockedEpisodeIds: [1],  // Episode 1 free
  currentEpisodeId: null,
  currentSceneId: null,
  history: []               // stack of {episodeId, sceneId}
};

// ---------- DOM helpers ----------
const root = document.getElementById("app");

function render(html) {
  root.innerHTML = html;
}

function escapeHtml(s) {
  return String(s ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

// ---------- Storage ----------
function saveState() {
  try { localStorage.setItem(APP.storageKey, JSON.stringify(state)); } catch (_) {}
}
function loadState() {
  try {
    const raw = localStorage.getItem(APP.storageKey);
    return raw ? JSON.parse(raw) : null;
  } catch (_) { return null; }
}

// ---------- Episode helpers ----------
function getEpisodeMeta(episodeId) {
  return APP.episodes.find(e => e.id === episodeId) || null;
}

function getEpisodeData(episodeId) {
  const meta = getEpisodeMeta(episodeId);
  if (!meta) return null;
  return window[meta.dataVar] || null; // requires window.episodeN
}

function isUnlocked(episodeId) {
  const meta = getEpisodeMeta(episodeId);
  if (!meta) return false;
  if (meta.isFree) return true;
  return state.unlockedEpisodeIds.includes(episodeId);
}

// ---------- Screens ----------
function showCategories() {
  const cont = (state.currentEpisodeId && state.currentSceneId)
    ? `
      <div class="section">
        <h2>Continue</h2>
        <div class="card">
          <h3>${escapeHtml(getEpisodeMeta(state.currentEpisodeId)?.title || "Story")}</h3>
          <p>Scene: ${escapeHtml(state.currentSceneId)}</p>
          <button class="choice" id="continueBtn">Continue</button>
        </div>
      </div>
    `
    : "";

  const cards = APP.categories.map(cat => `
    <div class="card">
      <h3>${escapeHtml(cat.title)}</h3>
      <p>${escapeHtml(cat.subtitle || "")}</p>
      <button class="choice" data-cat="${cat.id}">Open</button>
    </div>
  `).join("");

  render(`
    <div class="header">
      <h1>${escapeHtml(APP.appName)}</h1>
      <button class="lang" id="resetBtn">Reset</button>
    </div>

    ${cont}

    <div class="section">
      <h2>Categories</h2>
      ${cards}
    </div>

    <div class="footer">Choose a category to start</div>
  `);

  const continueBtn = document.getElementById("continueBtn");
  if (continueBtn) {
    continueBtn.addEventListener("click", () =>
      goTo(state.currentEpisodeId, state.currentSceneId, false)
    );
  }

  document.getElementById("resetBtn").addEventListener("click", () => {
    state = { unlockedEpisodeIds: [1], currentEpisodeId: null, currentSceneId: null, history: [] };
    saveState();
    showCategories();
  });

  root.querySelectorAll("button[data-cat]").forEach(b => {
    b.addEventListener("click", () => showCategory(b.getAttribute("data-cat")));
  });
}

function showCategory(categoryId) {
  const cat = APP.categories.find(c => c.id === categoryId);
  const eps = APP.episodes.filter(e => e.categoryId === categoryId);

  const list = eps.map(ep => {
    const locked = !isUnlocked(ep.id);
    const badge = locked
      ? `<span class="badge locked">Locked</span>`
      : `<span class="badge free">${ep.isFree ? "Free" : "Unlocked"}</span>`;

    const action = locked
      ? `<button class="choice" data-ep="${ep.id}" data-action="unlock">Unlock</button>`
      : `<button class="choice" data-ep="${ep.id}" data-action="play">Play</button>`;

    return `
      <div class="card">
        <h3>${escapeHtml(ep.title)}</h3>
        <p>${locked ? "Purchase/unlock to continue." : "Tap to play."}</p>
        ${badge}
        ${action}
      </div>
    `;
  }).join("");

  render(`
    <div class="header">
      <h1>${escapeHtml(cat?.title || "Category")}</h1>
      <button class="lang" id="backCats">Back</button>
    </div>

    <div class="section">
      <h2>Episodes</h2>
      ${list || `<div class="card"><p>No episodes yet.</p></div>`}
    </div>
  `);

  document.getElementById("backCats").addEventListener("click", showCategories);

  root.querySelectorAll("button[data-action]").forEach(b => {
    b.addEventListener("click", () => {
      const epId = Number(b.getAttribute("data-ep"));
      const action = b.getAttribute("data-action");
      if (action === "play") startEpisode(epId);
      if (action === "unlock") showUnlock(epId);
    });
  });
}

function showUnlock(episodeId) {
  const meta = getEpisodeMeta(episodeId);
  render(`
    <div class="header">
      <h1>${escapeHtml(meta?.title || "Locked")}</h1>
      <button class="lang" id="backBtn">Back</button>
    </div>

    <div class="section">
      <div class="card">
        <p><strong>This episode is locked.</strong></p>
        <p>For now, “Unlock now” simulates a purchase. Later you can replace this with Gumroad/Stripe.</p>
        <button class="choice" id="unlockNow">Unlock now</button>
      </div>
    </div>
  `);

  document.getElementById("backBtn").addEventListener("click", showCategories);

  document.getElementById("unlockNow").addEventListener("click", () => {
    if (!state.unlockedEpisodeIds.includes(episodeId)) {
      state.unlockedEpisodeIds.push(episodeId);
      saveState();
    }
    startEpisode(episodeId);
  });
}

// ---------- Game flow ----------
function startEpisode(episodeId) {
  if (!isUnlocked(episodeId)) return showUnlock(episodeId);

  const data = getEpisodeData(episodeId);
  if (!data) {
    render(`
      <div class="section">
        <div class="card">
          <p><strong>Episode data not loaded.</strong> Check your script tags in index.html.</p>
          <p>Expected: <code>window.${escapeHtml(getEpisodeMeta(episodeId)?.dataVar || "episodeN")}</code> to exist.</p>
          <button class="choice" id="home">Back</button>
        </div>
      </div>
    `);
    document.getElementById("home").addEventListener("click", showCategories);
    return;
  }

  // Start scene key must be "start"
  goTo(episodeId, "start", true);
}

function goTo(episodeId, sceneId, pushHistory = true) {
  const data = getEpisodeData(episodeId);
  const scene = data?.[sceneId];

  if (!scene) {
    render(`
      <div class="section">
        <div class="card">
          <p>Scene not found: <strong>${escapeHtml(sceneId)}</strong></p>
          <button class="choice" id="home">Back</button>
        </div>
      </div>
    `);
    document.getElementById("home").addEventListener("click", showCategories);
    return;
  }

  if (pushHistory && state.currentEpisodeId && state.currentSceneId) {
    state.history.push({ episodeId: state.currentEpisodeId, sceneId: state.currentSceneId });
  }

  state.currentEpisodeId = episodeId;
  state.currentSceneId = sceneId;
  saveState();

  renderScene(episodeId, sceneId, scene);
}

function renderScene(episodeId, sceneId, scene) {
  const meta = getEpisodeMeta(episodeId);

  render(`
    <div class="header">
      <h1>${escapeHtml(meta?.title || "Story")}</h1>
      <button class="lang" id="homeBtn">Home</button>
    </div>

    <div class="section">
      <div class="card">
        <p>${escapeHtml(scene.text || "")}</p>
        <div id="choices"></div>

        <div style="margin-top:12px; display:flex; gap:10px;">
          <button class="choice" id="backBtn">Back</button>
        </div>
      </div>
    </div>
  `);

  document.getElementById("homeBtn").addEventListener("click", showCategories);

  document.getElementById("backBtn").addEventListener("click", () => {
    const prev = state.history.pop();
    saveState();
    if (!prev) return showCategories();
    goTo(prev.episodeId, prev.sceneId, false);
  });

  const choicesDiv = document.getElementById("choices");
  const choices = Array.isArray(scene.choices) ? scene.choices : [];

  if (choices.length === 0) {
    // End of episode: offer next episode
    const nextEpId = episodeId + 1;
    const nextMeta = getEpisodeMeta(nextEpId);
    if (nextMeta) {
      const locked = !isUnlocked(nextEpId);
      const btn = document.createElement("button");
      btn.className = "choice";
      btn.textContent = locked ? "Next Episode (Locked)" : "Next Episode";
      btn.addEventListener("click", () => locked ? showUnlock(nextEpId) : startEpisode(nextEpId));
      choicesDiv.appendChild(btn);
    } else {
      const btn = document.createElement("button");
      btn.className = "choice";
      btn.textContent = "Back to Categories";
      btn.addEventListener("click", showCategories);
      choicesDiv.appendChild(btn);
    }
    return;
  }

  choices.forEach(c => {
    const btn = document.createElement("button");
    btn.className = "choice";
    btn.textContent = String(c.text || "Continue");
    btn.addEventListener("click", () => {
      if (typeof c.next !== "string") return;
      goTo(episodeId, c.next, true);
    });
    choicesDiv.appendChild(btn);
  });
}

// Boot
showCategories();

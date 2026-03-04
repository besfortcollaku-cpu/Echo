// app.js (advanced engine)

const APP = {
  appName: "Signal Stories",
  // Register episodes here (must match the const names in episode files)
  episodes: [
    { id: 1, title: "The Locked Signal — Ep 1", dataVar: "episode1", isFree: true },
    { id: 2, title: "The Visitor — Ep 2", dataVar: "episode2", isFree: false },
    { id: 3, title: "The Envelope — Ep 3", dataVar: "episode3", isFree: false },
    { id: 4, title: "The Camera — Ep 4", dataVar: "episode4", isFree: false },
    { id: 5, title: "The Signal — Ep 5", dataVar: "episode5", isFree: false },
    { id: 6, title: "The Rooftop — Ep 6", dataVar: "episode6", isFree: false },
    { id: 7, title: "The Operator — Ep 7", dataVar: "episode7", isFree: false },
    { id: 8, title: "The Truth — Ep 8", dataVar: "episode8", isFree: false }
  ],
  storageKey: "signalStories.save.v1",
};

// --------- State ----------
let state = loadState() || {
  unlockedEpisodeIds: [1],     // free ep
  currentEpisodeId: null,
  currentSceneId: null,
  history: []                  // stack of {episodeId, sceneId}
};

function getEpisodeMeta(episodeId) {
  return APP.episodes.find(e => e.id === episodeId) || null;
}

function getEpisodeData(episodeId) {
  const meta = getEpisodeMeta(episodeId);
  if (!meta) return null;
  // episode files define globals: episode1, episode2, ...
  // access via window[meta.dataVar]
  return window[meta.dataVar] || null;
}

function saveState() {
  try {
    localStorage.setItem(APP.storageKey, JSON.stringify(state));
  } catch (_) {}
}

function loadState() {
  try {
    const raw = localStorage.getItem(APP.storageKey);
    return raw ? JSON.parse(raw) : null;
  } catch (_) {
    return null;
  }
}

function isUnlocked(episodeId) {
  const meta = getEpisodeMeta(episodeId);
  if (!meta) return false;
  if (meta.isFree) return true;
  return state.unlockedEpisodeIds.includes(episodeId);
}

// --------- UI ----------
const root = document.getElementById("app");

function render(html) {
  root.innerHTML = html;
}

function btn(text, onClick, extraClass = "") {
  const b = document.createElement("button");
  b.className = `choice ${extraClass}`.trim();
  b.textContent = text;
  b.addEventListener("click", onClick);
  return b;
}

function showHome() {
  const continueBlock = (state.currentEpisodeId && state.currentSceneId)
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

  const list = APP.episodes.map(ep => {
    const locked = !isUnlocked(ep.id);
    const badge = locked ? `<span class="badge locked">Locked</span>` : `<span class="badge free">${ep.isFree ? "Free" : "Unlocked"}</span>`;
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
      <h1>${escapeHtml(APP.appName)}</h1>
      <button class="lang" id="resetBtn">Reset</button>
    </div>

    ${continueBlock}

    <div class="section">
      <h2>Episodes</h2>
      ${list}
    </div>

    <div class="footer">Mobile-first interactive stories</div>
  `);

  // wire buttons
  const cont = document.getElementById("continueBtn");
  if (cont) cont.addEventListener("click", () => goTo(state.currentEpisodeId, state.currentSceneId, false));

  document.getElementById("resetBtn").addEventListener("click", () => {
    // keep episode 1 free unlocked
    state = { unlockedEpisodeIds: [1], currentEpisodeId: null, currentSceneId: null, history: [] };
    saveState();
    showHome();
  });

  root.querySelectorAll("button[data-action]").forEach(b => {
    b.addEventListener("click", () => {
      const epId = Number(b.getAttribute("data-ep"));
      const action = b.getAttribute("data-action");

      if (action === "play") {
        startEpisode(epId);
      } else if (action === "unlock") {
        showUnlock(epId);
      }
    });
  });
}

function showUnlock(episodeId) {
  const meta = getEpisodeMeta(episodeId);
  render(`
    <div class="section">
      <h2>Locked</h2>
      <div class="card">
        <h3>${escapeHtml(meta?.title || "Episode")}</h3>
        <p>This episode is locked.</p>
        <p><strong>Demo unlock:</strong> click “Unlock now” to simulate purchase.</p>
        <button class="choice" id="unlockNow">Unlock now</button>
        <button class="choice" id="backHome">Back</button>
      </div>
    </div>
  `);

  document.getElementById("unlockNow").addEventListener("click", () => {
    if (!state.unlockedEpisodeIds.includes(episodeId)) {
      state.unlockedEpisodeIds.push(episodeId);
      saveState();
    }
    startEpisode(episodeId);
  });

  document.getElementById("backHome").addEventListener("click", showHome);
}

function startEpisode(episodeId) {
  if (!isUnlocked(episodeId)) return showUnlock(episodeId);

  const data = getEpisodeData(episodeId);
  if (!data) {
    render(`<div class="card"><p>Episode data not loaded. Check your script tags in index.html.</p><button class="choice" id="home">Home</button></div>`);
    document.getElementById("home").addEventListener("click", showHome);
    return;
  }

  // default start scene key = "start"
  goTo(episodeId, "start", true);
}

function goTo(episodeId, sceneId, pushHistory = true) {
  const data = getEpisodeData(episodeId);
  const scene = data?.[sceneId];

  if (!scene) {
    render(`<div class="card"><p>Scene not found: ${escapeHtml(sceneId)}</p><button class="choice" id="home">Home</button></div>`);
    document.getElementById("home").addEventListener("click", showHome);
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

  // Use <p> with escape; keep it safe and simple.
  const textHtml = `<p>${escapeHtml(scene.text || "")}</p>`;

  render(`
    <div class="header">
      <h1>${escapeHtml(meta?.title || "Story")}</h1>
      <button class="lang" id="homeBtn">Home</button>
    </div>

    <div class="section">
      <div class="card">
        ${textHtml}
        <div id="choices"></div>
        <div style="margin-top:12px; display:flex; gap:10px;">
          <button class="choice" id="backBtn">Back</button>
        </div>
      </div>
    </div>
  `);

  document.getElementById("homeBtn").addEventListener("click", showHome);

  const backBtn = document.getElementById("backBtn");
  backBtn.addEventListener("click", () => {
    const prev = state.history.pop();
    saveState();
    if (!prev) return showHome();
    goTo(prev.episodeId, prev.sceneId, false);
  });

  const choicesDiv = document.getElementById("choices");
  const choices = Array.isArray(scene.choices) ? scene.choices : [];

  if (choices.length === 0) {
    // end-of-episode
    const nextEpId = episodeId + 1;
    const nextMeta = getEpisodeMeta(nextEpId);
    if (nextMeta) {
      const locked = !isUnlocked(nextEpId);
      const b = btn(locked ? "Next Episode (Locked)" : "Next Episode", () => {
        locked ? showUnlock(nextEpId) : startEpisode(nextEpId);
      });
      choicesDiv.appendChild(b);
    } else {
      const b = btn("The End — Home", showHome);
      choicesDiv.appendChild(b);
    }
    return;
  }

  choices.forEach(c => {
    const label = String(c.text || "Continue");
    const nextId = c.next; // scene id string
    const b = btn(label, () => {
      if (typeof nextId !== "string") {
        // safety
        render(`<div class="card"><p>Invalid choice target.</p><button class="choice" id="home">Home</button></div>`);
        document.getElementById("home").addEventListener("click", showHome);
        return;
      }
      goTo(episodeId, nextId, true);
    });
    choicesDiv.appendChild(b);
  });
}

// --------- Utils ----------
function escapeHtml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

// Boot
showHome();
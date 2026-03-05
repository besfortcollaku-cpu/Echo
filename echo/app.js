// app.js — Categories → Stories → Episodes + Ads unlock (static friendly)

const APP = {
  appName: "Signal Stories",
  storageKey: "signalStories.save.v2",

  categories: [
    { id: "horror", title: "🟥 Horror", subtitle: "Dark, tense, scary" },
    { id: "drama", title: "🟪 Drama", subtitle: "Relationships, choices, emotion" },
    { id: "thriller", title: "🟨 Thriller", subtitle: "Fast, dangerous, twists" },
    { id: "romance", title: "💙 Romance", subtitle: "Love, drama, choices" },
  ],

  // STORIES (you will add more later)
  stories: [
    {
      id: "locked-signal",
      categoryId: "horror",
      title: "The Locked Signal",
      description: "A red light you shouldn’t have noticed.",
      episodeCount: 8, // you can make it 10 later
      // monetization policy for this story
      freeEpisodes: 1,
    },
    {
      id: "late-night",
      categoryId: "romance",
      title: "Late Night Messages",
      description: "A wrong number that doesn’t feel wrong.",
      episodeCount: 3,
      freeEpisodes: 1,
    },
  ],

  // EPISODES: link to storyId + dataVar (global window variable)
  // Example: window.episode1, window.episode2 ... and romance episodes window.romance1_ep1 ...
  episodes: [
    // Horror story: Locked Signal (8 eps)
    { id: 1, storyId: "locked-signal", ep: 1, title: "Ep 1 — 2:17 AM", dataVar: "episode1", art: "img/horror/locked-signal/ep01.png" },
    { id: 2, storyId: "locked-signal", ep: 2, title: "Ep 2 — The Visitor", dataVar: "episode2", art: "img/horror/locked-signal/ep02.png" },
    { id: 3, storyId: "locked-signal", ep: 3, title: "Ep 3 — The Envelope", dataVar: "episode3", art: "img/horror/locked-signal/ep03.png" },
    { id: 4, storyId: "locked-signal", ep: 4, title: "Ep 4 — The Camera", dataVar: "episode4", art: "img/horror/locked-signal/ep04.png" },
    { id: 5, storyId: "locked-signal", ep: 5, title: "Ep 5 — The Signal", dataVar: "episode5", art: "img/horror/locked-signal/ep05.png" },
    { id: 6, storyId: "locked-signal", ep: 6, title: "Ep 6 — The Rooftop", dataVar: "episode6", art: "img/horror/locked-signal/ep06.png" },
    { id: 7, storyId: "locked-signal", ep: 7, title: "Ep 7 — The Operator", dataVar: "episode7", art: "img/horror/locked-signal/ep07.png" },
    { id: 8, storyId: "locked-signal", ep: 8, title: "Ep 8 — The Truth", dataVar: "episode8", art: "img/horror/locked-signal/ep08.png" },

    // Romance story: Late Night Messages (3 eps) (you already have this text from earlier message)
    { id: 101, storyId: "late-night", ep: 1, title: "Ep 1 — The Wrong Number", dataVar: "romance1_ep1", art: "img/romance/late-night/ep01.png" },
    { id: 102, storyId: "late-night", ep: 2, title: "Ep 2 — Coffee Invitation", dataVar: "romance1_ep2", art: "img/romance/late-night/ep02.png" },
    { id: 103, storyId: "late-night", ep: 3, title: "Ep 3 — First Date", dataVar: "romance1_ep3", art: "img/romance/late-night/ep03.png" },
  ],

  // Ad settings (UI now, real ads later)
  ads: {
    // show interstitial between episodes for free users (recommended)
    interstitialBetweenEpisodes: true,
    // rewarded ad unlock button (recommended)
    rewardedUnlockEnabled: true,
    // "fake ad" duration to simulate ad watching (seconds)
    fakeAdSeconds: 5,
  },
};

// ---------------- State ----------------
let state = loadState() || {
  // unlocking per story (max episode number unlocked)
  storyUnlocks: {
    "locked-signal": 1,
    "late-night": 1,
  },
  // last position
  currentStoryId: null,
  currentEpisodeId: null,
  currentSceneId: null,
  history: [], // stack for back
};

const root = document.getElementById("app");

function render(html) { root.innerHTML = html; }
function escapeHtml(s) {
  return String(s ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function saveState() {
  try { localStorage.setItem(APP.storageKey, JSON.stringify(state)); } catch (_) {}
}
function loadState() {
  try {
    const raw = localStorage.getItem(APP.storageKey);
    return raw ? JSON.parse(raw) : null;
  } catch (_) { return null; }
}

// ---------------- Data helpers ----------------
function getCategory(categoryId) {
  return APP.categories.find(c => c.id === categoryId) || null;
}
function getStory(storyId) {
  return APP.stories.find(s => s.id === storyId) || null;
}
function getEpisodesForStory(storyId) {
  return APP.episodes
    .filter(e => e.storyId === storyId)
    .sort((a, b) => a.ep - b.ep);
}
function getEpisodeById(episodeId) {
  return APP.episodes.find(e => e.id === episodeId) || null;
}
function getEpisodeDataByVar(dataVar) {
  return window[dataVar] || null;
}
function getUnlockedEpNumber(storyId) {
  return Number(state.storyUnlocks?.[storyId] ?? 1);
}
function isEpisodeUnlocked(storyId, epNumber) {
  return epNumber <= getUnlockedEpNumber(storyId);
}
function unlockNextEpisode(storyId, epNumberJustFinished) {
  const currentMax = getUnlockedEpNumber(storyId);
  const next = epNumberJustFinished + 1;
  if (next > currentMax) {
    state.storyUnlocks[storyId] = next;
    saveState();
  }
}

// ---------------- Screens ----------------
function showHomeCategories() {
  const cont = (state.currentStoryId && state.currentEpisodeId && state.currentSceneId)
    ? `
      <div class="section">
        <h2>Continue</h2>
        <div class="card">
          <h3>${escapeHtml(getStory(state.currentStoryId)?.title || "Story")}</h3>
          <p>${escapeHtml(getEpisodeById(state.currentEpisodeId)?.title || "")}</p>
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

    <div class="footer">Choose a category</div>
  `);

  const continueBtn = document.getElementById("continueBtn");
  if (continueBtn) {
    continueBtn.addEventListener("click", () => {
      // continue exactly where user was
      goToScene(state.currentStoryId, state.currentEpisodeId, state.currentSceneId, false);
    });
  }

  document.getElementById("resetBtn").addEventListener("click", () => {
    state = {
      storyUnlocks: { "locked-signal": 1, "late-night": 1 },
      currentStoryId: null,
      currentEpisodeId: null,
      currentSceneId: null,
      history: [],
    };
    saveState();
    showHomeCategories();
  });

  root.querySelectorAll("button[data-cat]").forEach(b => {
    b.addEventListener("click", () => showStories(b.getAttribute("data-cat")));
  });
}

function showStories(categoryId) {
  const cat = getCategory(categoryId);
  const stories = APP.stories.filter(s => s.categoryId === categoryId);

  const list = stories.map(st => `
    <div class="card">
      <h3>${escapeHtml(st.title)}</h3>
      <p>${escapeHtml(st.description || "")}</p>
      <p style="opacity:.7; font-size:.9rem;">Episodes: ${st.episodeCount}</p>
      <button class="choice" data-story="${st.id}">Open</button>
    </div>
  `).join("");

  render(`
    <div class="header">
      <h1>${escapeHtml(cat?.title || "Stories")}</h1>
      <button class="lang" id="backHome">Back</button>
    </div>

    <div class="section">
      <h2>Stories</h2>
      ${list || `<div class="card"><p>No stories yet.</p></div>`}
    </div>
  `);

  document.getElementById("backHome").addEventListener("click", showHomeCategories);

  root.querySelectorAll("button[data-story]").forEach(b => {
    b.addEventListener("click", () => showEpisodes(b.getAttribute("data-story")));
  });
}

function showEpisodes(storyId) {
  const story = getStory(storyId);
  const eps = getEpisodesForStory(storyId);
  const unlockedMax = getUnlockedEpNumber(storyId);

  const list = eps.map(ep => {
    const locked = !isEpisodeUnlocked(storyId, ep.ep);
    const badge = locked
      ? `<span class="badge locked">Locked</span>`
      : `<span class="badge free">${ep.ep === 1 ? "Free" : "Unlocked"}</span>`;

    const action = locked
      ? `
        <button class="choice" data-ep="${ep.id}" data-action="unlock">Watch Ad to Unlock</button>
        <button class="choice" data-ep="${ep.id}" data-action="buy">Buy Story</button>
      `
      : `<button class="choice" data-ep="${ep.id}" data-action="play">Play</button>`;

    return `
      <div class="card">
        <h3>${escapeHtml(ep.title)}</h3>
        <p style="opacity:.7;">Story progress: unlocked up to Ep ${unlockedMax}</p>
        ${badge}
        ${action}
      </div>
    `;
  }).join("");

  render(`
    <div class="header">
      <h1>${escapeHtml(story?.title || "Episodes")}</h1>
      <button class="lang" id="backStories">Back</button>
    </div>

    <div class="section">
      <h2>Episodes</h2>
      ${list || `<div class="card"><p>No episodes found.</p></div>`}
    </div>
  `);

  document.getElementById("backStories").addEventListener("click", () => showStories(story?.categoryId));

  root.querySelectorAll("button[data-action]").forEach(b => {
    b.addEventListener("click", () => {
      const epId = Number(b.getAttribute("data-ep"));
      const action = b.getAttribute("data-action");
      if (action === "play") startEpisode(storyId, epId);
      if (action === "unlock") showRewardedAdThenUnlock(storyId, epId);
      if (action === "buy") showBuyStory(storyId);
    });
  });
}

function showBuyStory(storyId) {
  const story = getStory(storyId);
  render(`
    <div class="header">
      <h1>${escapeHtml(story?.title || "Buy")}</h1>
      <button class="lang" id="backBtn">Back</button>
    </div>
    <div class="section">
      <div class="card">
        <p><strong>Buy Full Story</strong></p>
        <p>Replace this screen later with Gumroad/Stripe/PayPal link.</p>
        <button class="choice" id="demoBuy">Demo: Unlock All Episodes</button>
      </div>
    </div>
  `);

  document.getElementById("backBtn").addEventListener("click", () => showEpisodes(storyId));

  document.getElementById("demoBuy").addEventListener("click", () => {
    const eps = getEpisodesForStory(storyId);
    const maxEp = eps.length ? eps[eps.length - 1].ep : 1;
    state.storyUnlocks[storyId] = maxEp;
    saveState();
    showEpisodes(storyId);
  });
}

// ---------------- Ad flows (UI now, real network later) ----------------
function showInterstitialAd(next) {
  // Simple interstitial ad simulation
  render(`
    <div class="header">
      <h1>Advertisement</h1>
      <button class="lang" id="skipBtn">Skip</button>
    </div>
    <div class="section">
      <div class="card">
        <p>Ad is showing… (demo)</p>
        <p style="opacity:.7;">Later you can replace this with AdSense / network interstitial.</p>
        <p><strong id="timer"></strong></p>
      </div>
    </div>
  `);

  let t = APP.ads.fakeAdSeconds;
  const el = document.getElementById("timer");
  el.textContent = `Continuing in ${t}s…`;

  const interval = setInterval(() => {
    t -= 1;
    el.textContent = `Continuing in ${t}s…`;
    if (t <= 0) {
      clearInterval(interval);
      next();
    }
  }, 1000);

  document.getElementById("skipBtn").addEventListener("click", () => {
    clearInterval(interval);
    next();
  });
}

function showRewardedAdThenUnlock(storyId, episodeId) {
  const ep = getEpisodeById(episodeId);

  const artHtml = ep?.art ? `\n    <div class=\"art-wrap\"><img class=\"episode-art\" src=\"${ep.art}\" alt=\"\" onerror=\"this.style.display='none';\"></div>\n  ` : "";
  if (!ep) return showEpisodes(storyId);

  render(`
    <div class="header">
      <h1>Watch Ad</h1>
      <button class="lang" id="backBtn">Back</button>
    </div>
    <div class="section">
      <div class="card">
        <p><strong>Unlock ${escapeHtml(ep.title)}</strong></p>
        <p>Watch an ad to unlock this episode (demo).</p>
        <button class="choice" id="watchBtn">Watch Ad</button>
      </div>
    </div>
  `);

  document.getElementById("backBtn").addEventListener("click", () => showEpisodes(storyId));

  document.getElementById("watchBtn").addEventListener("click", () => {
    showInterstitialAd(() => {
      // Unlock up to this episode
      const currentMax = getUnlockedEpNumber(storyId);
      if (ep.ep > currentMax) {
        state.storyUnlocks[storyId] = ep.ep;
        saveState();
      }
      startEpisode(storyId, episodeId);
    });
  });
}

// ---------------- Game flow ----------------
function startEpisode(storyId, episodeId) {
  const ep = getEpisodeById(episodeId);

  const artHtml = ep?.art ? `\n    <div class=\"art-wrap\"><img class=\"episode-art\" src=\"${ep.art}\" alt=\"\" onerror=\"this.style.display='none';\"></div>\n  ` : "";
  if (!ep) return showEpisodes(storyId);

  // lock enforcement
  if (!isEpisodeUnlocked(storyId, ep.ep)) {
    return showRewardedAdThenUnlock(storyId, episodeId);
  }

  const data = getEpisodeDataByVar(ep.dataVar);
  if (!data) {
    render(`
      <div class="section">
        <div class="card">
          <p><strong>Episode data not loaded.</strong></p>
          <p>Expected: <code>window.${escapeHtml(ep.dataVar)}</code> to exist.</p>
          <button class="choice" id="back">Back</button>
        </div>
      </div>
    `);
    document.getElementById("back").addEventListener("click", () => showEpisodes(storyId));
    return;
  }

  // Start at "start"
  goToScene(storyId, episodeId, "start", true);
}

function goToScene(storyId, episodeId, sceneId, pushHistory = true) {
  const ep = getEpisodeById(episodeId);

  const artHtml = ep?.art ? `\n    <div class=\"art-wrap\"><img class=\"episode-art\" src=\"${ep.art}\" alt=\"\" onerror=\"this.style.display='none';\"></div>\n  ` : "";
  const data = getEpisodeDataByVar(ep.dataVar);
  const scene = data?.[sceneId];

  if (!scene) {
    render(`
      <div class="section">
        <div class="card">
          <p>Scene not found: <strong>${escapeHtml(sceneId)}</strong></p>
          <button class="choice" id="back">Back</button>
        </div>
      </div>
    `);
    document.getElementById("back").addEventListener("click", () => showEpisodes(storyId));
    return;
  }

  if (pushHistory && state.currentStoryId && state.currentEpisodeId && state.currentSceneId) {
    state.history.push({
      storyId: state.currentStoryId,
      episodeId: state.currentEpisodeId,
      sceneId: state.currentSceneId
    });
  }

  state.currentStoryId = storyId;
  state.currentEpisodeId = episodeId;
  state.currentSceneId = sceneId;
  saveState();

  renderScene(storyId, episodeId, sceneId, scene);
}

function renderScene(storyId, episodeId, sceneId, scene) {
  const story = getStory(storyId);
  const ep = getEpisodeById(episodeId);

  const artHtml = ep?.art ? `\n    <div class=\"art-wrap\"><img class=\"episode-art\" src=\"${ep.art}\" alt=\"\" onerror=\"this.style.display='none';\"></div>\n  ` : "";

  render(`
    <div class="header">
      <h1>${escapeHtml(story?.title || "Story")}</h1>
      <button class="lang" id="homeBtn">Home</button>
    </div>

    <div class="section">
      <div class="card">
<p style="opacity:.7; margin-top:0;">${escapeHtml(ep?.title || "")}</p>

<p>${escapeHtml(scene.text || "")}</p>

        <div id="choices"></div>

        <div style="margin-top:12px; display:flex; gap:10px;">
          <button class="choice" id="backBtn">Back</button>

        </div>
                  ${artHtml}

      </div>
    </div>
  `);

  document.getElementById("homeBtn").addEventListener("click", showHomeCategories);

  document.getElementById("backBtn").addEventListener("click", () => {
    const prev = state.history.pop();
    saveState();
    if (!prev) return showHomeCategories();
    goToScene(prev.storyId, prev.episodeId, prev.sceneId, false);
  });

  const choicesDiv = document.getElementById("choices");
  const choices = Array.isArray(scene.choices) ? scene.choices : [];

  // End of episode if no choices
  if (choices.length === 0) {
    // unlock next episode for free user ONLY after ad (your requirement = both)
    const eps = getEpisodesForStory(storyId);
    const maxEp = eps.length ? eps[eps.length - 1].ep : 1;

    if (ep.ep >= maxEp) {
      const done = document.createElement("button");
      done.className = "choice";
      done.textContent = "Story Finished — Back to Episodes";
      done.addEventListener("click", () => showEpisodes(storyId));
      choicesDiv.appendChild(done);
      return;
    }

    const nextEp = eps.find(x => x.ep === ep.ep + 1);
    const nextBtn = document.createElement("button");
    nextBtn.className = "choice";
    nextBtn.textContent = "Continue to Next Episode";
    nextBtn.addEventListener("click", () => {
      // Interstitial between episodes (demo)
      if (APP.ads.interstitialBetweenEpisodes) {
        showInterstitialAd(() => {
          // After interstitial, require rewarded to unlock next if locked
          startEpisode(storyId, nextEp.id);
        });
      } else {
        startEpisode(storyId, nextEp.id);
      }
    });
    choicesDiv.appendChild(nextBtn);

    return;
  }

  choices.forEach(c => {
    const btn = document.createElement("button");
    btn.className = "choice";
    btn.textContent = String(c.text || "Continue");
    btn.addEventListener("click", () => {
      if (typeof c.next !== "string") return;
      goToScene(storyId, episodeId, c.next, true);
    });
    choicesDiv.appendChild(btn);
  });
}

// Boot
showHomeCategories();
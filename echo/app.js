const APP = {
  appName: "Signal Stories",
  storageKey: "signalStories.save.v1",

  categories: [
    { id: "horror",  title: "🟥 Horror",  subtitle: "Dark, tense, scary" },
    { id: "mystery", title: "🟨 Mystery", subtitle: "Clues, secrets, twists" },
    { id: "romance", title: "💙 Romance", subtitle: "Love, drama, choices" },
  ],

  episodes: [
    { id: 1, title: "The Locked Signal — Ep 1", dataVar: "episode1", isFree: true,  categoryId: "horror" },
    { id: 2, title: "The Visitor — Ep 2",      dataVar: "episode2", isFree: false, categoryId: "horror" },
    { id: 3, title: "The Envelope — Ep 3",     dataVar: "episode3", isFree: false, categoryId: "horror" },
    { id: 4, title: "The Camera — Ep 4",       dataVar: "episode4", isFree: false, categoryId: "horror" },
    { id: 5, title: "The Signal — Ep 5",       dataVar: "episode5", isFree: false, categoryId: "horror" },
    { id: 6, title: "The Rooftop — Ep 6",      dataVar: "episode6", isFree: false, categoryId: "horror" },
    { id: 7, title: "The Operator — Ep 7",     dataVar: "episode7", isFree: false, categoryId: "horror" },
    { id: 8, title: "The Truth — Ep 8",        dataVar: "episode8", isFree: false, categoryId: "horror" },
  ],
};

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
    b.addEventListener("click", () => {
      const categoryId = b.getAttribute("data-cat");
      showCategory(categoryId);
    });
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
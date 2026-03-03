// Basic navigation between home and episode scenes
let currentScene = null;

// Show home screen
function showHome() {
    const app = document.getElementById("app");
    app.innerHTML = `
    <div class="header">
        <h1>Signal Stories</h1>
        <button class="lang">EN ▾</button>
    </div>

    <div class="section">
        <h2>Continue</h2>
        <div class="card">
            <h3>The Locked Signal</h3>
            <p>Episode 1</p>
            <span class="badge free">Continue</span>
            <button class="choice" onclick="startEpisode(episode1.start)">Play</button>
        </div>
    </div>

    <div class="section">
        <h2>Choose a Story</h2>
        <div class="card">
            <h3>🟥 Horror — The Locked Signal</h3>
            <p>Mysterious messages change everything.</p>
            <span class="badge free">Free Episode</span>
            <button class="choice" onclick="startEpisode(episode1.start)">Play</button>
        </div>
        <div class="card">
            <h3>💙 Romance — Late Night Messages</h3>
            <p>A stranger texts you every night.</p>
            <span class="badge locked">Locked</span>
        </div>
        <div class="card">
            <h3>🟨 Mystery — The Last Train</h3>
            <p>The train arrives. No one gets off.</p>
            <span class="badge locked">Locked</span>
        </div>
    </div>

    <div class="footer">
        New stories added weekly
    </div>
    `;
}

// Start a scene
function startEpisode(scene) {
    currentScene = scene;
    showScene(currentScene);
}

// Display a scene with choices
function showScene(scene) {
    const app = document.getElementById("app");
    app.innerHTML = `<p>${scene.text}</p>`;

    if (scene.choices) {
        scene.choices.forEach(c => {
            const btn = document.createElement("button");
            btn.className = "choice";
            btn.textContent = c.text;
            btn.onclick = () => showScene(c.next);
            app.appendChild(btn);
        });
    }
}

// Initialize home screen
showHome();
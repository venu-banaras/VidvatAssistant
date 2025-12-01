let selectedModel = null;

// -------- NAVIGATION HANDLING -------- //
function switchPanel(panel) {
    document.getElementById("panel-chat").classList.add("hidden");
    document.getElementById("panel-settings").classList.add("hidden");

    document.getElementById("panel-chat").classList.remove("visible");
    document.getElementById("panel-settings").classList.remove("visible");

    document.getElementById(panel).classList.remove("hidden");
    document.getElementById(panel).classList.add("visible");

    // update active class
    document.getElementById("btn-chat").classList.remove("active");
    document.getElementById("btn-settings").classList.remove("active");

    if (panel === "panel-chat") {
        document.getElementById("btn-chat").classList.add("active");
    } else {
        document.getElementById("btn-settings").classList.add("active");
    }
}

document.getElementById("btn-chat").onclick = () => switchPanel("panel-chat");
document.getElementById("btn-settings").onclick = () => switchPanel("panel-settings");


// -------- SETTINGS (Model selection) -------- //
async function loadModels() {
    const select = document.getElementById("model-select");

    try {
        const res = await fetch("http://localhost:8000/models");
        const data = await res.json();

        select.innerHTML = "";  // clear old options

        data.models.forEach(model => {
            const opt = document.createElement("option");
            opt.value = model;
            opt.textContent = model;
            select.appendChild(opt);
        });

    } catch (err) {
        console.error("Failed to load models:", err);
        select.innerHTML = "<option>Error loading models</option>";
    }
}

document.getElementById("apply-model").addEventListener("click", () => {
    const selected = document.getElementById("model-select").value;
    console.log("Selected model:", selected);

    // store model globally for chat use
    window.currentModel = selected;
});

loadModels();



// -------- CHAT -------- //
async function sendMessage() {
    const prompt = document.getElementById("prompt").value;
    const chatWindow = document.getElementById("chat-window");

    if (!prompt.trim()) return;

    chatWindow.innerHTML += `<div><b>You:</b> ${prompt}</div>`;

    const res = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ model: selectedModel, prompt })
    });

    const data = await res.json();

    chatWindow.innerHTML += `<div><b>AI:</b> ${data.response}</div>`;
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

document.getElementById("send").onclick = sendMessage;


// Initialize
loadModels();

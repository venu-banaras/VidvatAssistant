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
    const res = await fetch("http://localhost:8000/models");
    const data = await res.json();
    const select = document.getElementById("model-select");

    data.models.forEach(m => {
        let option = document.createElement("option");
        option.value = m;
        option.textContent = m;
        select.appendChild(option);
    });

    selectedModel = data.models[0];     // default
    select.value = selectedModel;
}

document.getElementById("save-settings").onclick = () => {
    selectedModel = document.getElementById("model-select").value;
    alert("Model set to: " + selectedModel);
    switchPanel("panel-chat");
};


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

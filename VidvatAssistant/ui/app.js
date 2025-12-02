let selectedModel = null;

// ---------- SETTINGS: Load fixed models ---------- //

const MODEL_LIST = ["qwen3-coder", "codegemma", "codestral"];

function loadModels() {
    const select = document.getElementById("model-select");
    select.innerHTML = "";

    MODEL_LIST.forEach(m => {
        const opt = document.createElement("option");
        opt.value = m;
        opt.textContent = m;
        select.appendChild(opt);
    });
}

document.getElementById("apply-model").onclick = async () => {
    const selected = document.getElementById("model-select").value;
    const statusBox = document.getElementById("model-status");

    // Show progress message
    statusBox.classList.remove("hidden");
    statusBox.textContent = `[KINDLY WAIT, LLMs are large sized] Downloading model "${selected}"...`;

    try {
        const res = await fetch("http://localhost:8000/set_model", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ model: selected })
        });

        const data = await res.json();

        if (data.detail) {
            statusBox.textContent = "Error: " + data.detail;
            return;
        }

        statusBox.textContent = `Model downloaded and applied: ${data.active_model} YAYY!!!`;
    }
    catch (err) {
        console.error(err);
        statusBox.textContent = "Download failed. Check backend.";
    }
};



// ---------- CHAT ---------- //

async function sendMessage() {
    const prompt = document.getElementById("prompt").value;
    if (!prompt.trim()) return;

    const chatWindow = document.getElementById("chat-window");
    chatWindow.innerHTML += `<div><b>You:</b> ${prompt}</div>`;

    try {
        const res = await fetch("http://localhost:8000/chat", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ prompt })
        });

        const data = await res.json();

        if (data.detail) {
            chatWindow.innerHTML += `<div><b>AI Error:</b> ${data.detail}</div>`;
        } else {
            chatWindow.innerHTML += `<div><b>AI:</b> ${data.response}</div>`;
        }
    }
    catch (err) {
        chatWindow.innerHTML += `<div><b>AI Error:</b> Backend not reachable.</div>`;
    }

    chatWindow.scrollTop = chatWindow.scrollHeight;
}

document.getElementById("send").onclick = sendMessage;


// Init
loadModels();

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


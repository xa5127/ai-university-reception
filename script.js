// script.js — fixed to match floating chat widget system

const chatWindow = document.getElementById("chat-window");
const chatInput = document.getElementById("chat-input");
const chatSend = document.getElementById("chat-send");

// Prevent running on pages without the widget
if (chatWindow && chatInput && chatSend) {

    function addMessage(sender, text) {
        const div = document.createElement("div");
        div.classList.add("message", sender);
        div.textContent = text;
        chatWindow.appendChild(div);
        chatWindow.scrollTop = chatWindow.scrollHeight;
    }

    async function sendMessage() {
        const text = chatInput.value.trim();
        if (!text) return;

        addMessage("user", text);
        chatInput.value = "";

        try {
            const res = await fetch("/ask", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ question: text })
            });

            const data = await res.json();
            addMessage("bot", data.answer || "Sorry, I don't know the answer.");
        } catch (err) {
            addMessage("bot", "⚠️ Error: Could not reach server.");
        }
    }

    chatSend.addEventListener("click", sendMessage);
    chatInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") sendMessage();
    });
}

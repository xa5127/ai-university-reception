let FAQ_DATA = [];

// ======================================================
// LOAD FAQ DATA (JSON FILE)
// ======================================================
fetch("data/faq-data.json")
  .then(res => res.json())
  .then(data => {
    FAQ_DATA = data;
    console.log("FAQ loaded:", FAQ_DATA);
  })
  .catch(err => {
    console.error("Failed to load FAQ data:", err);
  });

// ======================================================
// CHAT WIDGET — OPEN / CLOSE / SEND MESSAGES
// ======================================================

const chatButton = document.getElementById("chat-button");
const chatWidget = document.getElementById("chat-widget");
const chatClose = document.getElementById("chat-close");
const chatWindow = document.getElementById("chat-window");
const chatInput = document.getElementById("chat-input");
const chatSend = document.getElementById("chat-send");

if (chatButton && chatWidget && chatClose && chatWindow && chatInput && chatSend) {

  // OPEN CHAT
  chatButton.addEventListener("click", () => {
    chatWidget.classList.add("open");
    chatButton.style.display = "none";
    setTimeout(() => chatInput.focus(), 150);
  });

  // CLOSE CHAT
  chatClose.addEventListener("click", () => {
    chatWidget.classList.remove("open");
    setTimeout(() => {
      chatButton.style.display = "flex";
    }, 200);
  });

  // ADD MESSAGE BUBBLE
  function addMessage(sender, text) {
    const msg = document.createElement("div");
    msg.classList.add("message", sender);
    msg.textContent = text;
    chatWindow.appendChild(msg);
    chatWindow.scrollTop = chatWindow.scrollHeight;
  }

  // ======================================================
  // FIND BEST ANSWER FROM FAQ DATA
  // ======================================================
  function findBestAnswer(userInput) {
    if (!FAQ_DATA.length) return null;

    userInput = userInput.toLowerCase();

    let bestMatch = null;
    let score = 0;

    FAQ_DATA.forEach(entry => {
      let entryScore = 0;

      // Check question similarity
      if (entry.question.toLowerCase().includes(userInput)) {
        entryScore += 3;
      }

      // Check keywords
      entry.keywords.forEach(kw => {
        if (userInput.includes(kw.toLowerCase())) {
          entryScore += 2;
        }
      });

      // update best score
      if (entryScore > score) {
        score = entryScore;
        bestMatch = entry;
      }
    });

    return bestMatch;
  }

  // ======================================================
  // SEND MESSAGE
  // ======================================================
  async function sendMessage() {
    const text = chatInput.value.trim();
    if (!text) return;

    addMessage("user", text);
    chatInput.value = "";

    // Typing bubble
    const typingBubble = document.createElement("div");
    typingBubble.classList.add("message", "bot");
    typingBubble.textContent = "Typing...";
    chatWindow.appendChild(typingBubble);
    chatWindow.scrollTop = chatWindow.scrollHeight;

    setTimeout(() => {
      typingBubble.remove();

      const answer = findBestAnswer(text);

      if (answer) {
        addMessage("bot", answer.answer);
      } else {
        addMessage("bot", "Sorry, I don’t know that yet. Try asking another question!");
      }

    }, 600);
  }

  // LISTENERS
  chatSend.addEventListener("click", sendMessage);
  chatInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") sendMessage();
  });

}

// app.js – dark mode toggle + modal handling

document.addEventListener("DOMContentLoaded", () => {
  /* ===========================
     DARK MODE TOGGLE
  ============================ */
  const toggle = document.getElementById("theme-toggle");

  if (toggle) {
    // Load saved theme
    const saved = localStorage.getItem("theme");
    if (saved === "dark") {
      document.body.classList.add("dark");
      toggle.textContent = "☀️";
    } else {
      toggle.textContent = "🌙";
    }

    // Toggle on click
    toggle.addEventListener("click", () => {
      const isDark = document.body.classList.toggle("dark");
      toggle.textContent = isDark ? "☀️" : "🌙";
      localStorage.setItem("theme", isDark ? "dark" : "light");
    });
  }

  /* ===========================
     MODALS (dashboard cards)
  ============================ */
  const modalBg = document.getElementById("modal-bg");
  const modalBox = document.getElementById("modal-box");
  const modalContent = document.getElementById("modal-content");
  const modalClose = document.getElementById("modal-close");

  function closeModal() {
    if (modalBg) modalBg.classList.remove("show");
    if (modalBox) modalBox.classList.remove("show");
  }

  if (modalClose) {
    modalClose.addEventListener("click", closeModal);
  }
  if (modalBg) {
    // Click outside to close
    modalBg.addEventListener("click", closeModal);
  }

  // Make openModal available to HTML (onclick="openModal('about')")
  window.openModal = function (type) {
    if (!modalBg || !modalBox || !modalContent) return;

    const contentMap = {
      about: `
        <h2>About</h2>
        <p>The AI Reception helps students, staff, and visitors access university information quickly and easily.</p>
      `,
      lostfound: `
        <h2>Lost & Found</h2>
        <p>Report items you’ve lost or found around campus. This section will list important details soon.</p>
      `,
      coop: `
        <h2>COOP Training</h2>
        <p>COOP requirements, eligibility, and guidelines will be displayed here.</p>
      `,
      courseinfo: `
        <h2>Course Information</h2>
        <p>View course descriptions, prerequisites, and credit hours.</p>
      `,
      equalization: `
        <h2>Course Equalization</h2>
        <p>Information about transfer courses and equivalency rules.</p>
      `,
      navigation: `
        <h2>Campus Navigation</h2>
        <p>Maps and directions to key buildings and facilities on campus.</p>
      `
    };

    modalContent.innerHTML = contentMap[type] || "<h2>Info</h2><p>Details coming soon.</p>";
    modalBg.classList.add("show");
    modalBox.classList.add("show");
  };
});

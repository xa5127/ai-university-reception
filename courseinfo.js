// =========================
// COURSE INFO – MODAL VERSION (FINAL)
// =========================

document.addEventListener("DOMContentLoaded", () => {

    const searchInput = document.getElementById("course-search");
    const levelFilter = document.getElementById("level-filter");
    const prereqFilter = document.getElementById("prereq-filter");
    const rows = Array.from(document.querySelectorAll(".course-row"));
    const noResults = document.getElementById("no-results");

    // MODAL elements
    const modalBg = document.getElementById("course-modal-bg");
    const modalBox = document.getElementById("course-modal");
    const modalClose = document.getElementById("course-modal-close");
    const modalContent = document.getElementById("course-modal-content");

    // =========================
    // RENDER COURSE INTO MODAL
    // =========================
    function renderModal(row) {
        const { code, name, level, units, prereq, overview } = row.dataset;

        modalContent.innerHTML = `
            <h3>${code} – ${name}</h3>
            <p><strong>Level:</strong> ${level}</p>
            <p><strong>Units:</strong> ${units}</p>
            <p><strong>Prerequisite:</strong> ${prereq || "None"}</p>

            <hr>

            <p>${overview}</p>
        `;

        modalBg.classList.add("show");
    }

    // =========================
    // FILTER SYSTEM
    // =========================
    function applyFilters() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        const levelValue = levelFilter.value;
        const prereqValue = prereqFilter.value;

        let visibleCount = 0;

        rows.forEach(row => {
            const code = row.dataset.code.toLowerCase();
            const name = row.dataset.name.toLowerCase();
            const level = row.dataset.level;
            const hasPrereq = row.dataset.hasPrereq === "true";

            let matches =
                (!searchTerm || code.includes(searchTerm) || name.includes(searchTerm)) &&
                (!levelValue || level === levelValue) &&
                (prereqValue === "" ||
                    (prereqValue === "none" && !hasPrereq) ||
                    (prereqValue === "has" && hasPrereq));

            row.style.display = matches ? "" : "none";
            if (matches) visibleCount++;
        });

        noResults.style.display = visibleCount === 0 ? "block" : "none";
    }

    // Apply filters on input/select
    searchInput.addEventListener("input", applyFilters);
    levelFilter.addEventListener("change", applyFilters);
    prereqFilter.addEventListener("change", applyFilters);

    // =========================
    // VIEW BUTTON → OPEN MODAL
    // =========================
    document.addEventListener("click", (e) => {
        const btn = e.target.closest(".view-course-btn");
        if (!btn) return;

        const row = btn.closest(".course-row");
        renderModal(row);
    });

    // =========================
    // CLOSE MODAL
    // =========================
    modalClose.addEventListener("click", () => {
        modalBg.classList.remove("show");
    });

    modalBg.addEventListener("click", (e) => {
        if (e.target === modalBg) {
            modalBg.classList.remove("show");
        }
    });

    applyFilters();
});

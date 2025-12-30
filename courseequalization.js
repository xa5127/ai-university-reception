// courseequalization.js – front‑end wizard for manual equalization

document.addEventListener("DOMContentLoaded", () => {
  // === STEP ELEMENTS ===
  const stepIndicators = document.querySelectorAll(".eq-step-indicator");
  const stepPanels = document.querySelectorAll(".eq-step-panel");

  const btnNext1 = document.getElementById("eq-next-1");
  const btnPrev2 = document.getElementById("eq-prev-2");
  const btnNext2 = document.getElementById("eq-next-2");
  const btnPrev3 = document.getElementById("eq-prev-3");
  const btnEvaluate = document.getElementById("eq-evaluate");

  const errorBox = document.getElementById("eq-error");

  // === FORM FIELDS ===
  const prevInstitution = document.getElementById("prev-institution");
  const prevCode = document.getElementById("prev-code");
  const prevName = document.getElementById("prev-name");
  const prevCredits = document.getElementById("prev-credits");
  const prevGrade = document.getElementById("prev-grade");
  const prevTopics = document.getElementById("prev-topics");

  const ubtCourseSelect = document.getElementById("ubt-course");
  const ubtNotes = document.getElementById("ubt-notes");

  // === DECISION DISPLAY ===
  const decisionCard = document.getElementById("eq-decision-card");
  const decisionBadge = document.getElementById("eq-decision-badge");
  const decisionTitle = document.getElementById("eq-decision-title");
  const decisionReason = document.getElementById("eq-decision-reason");
  const summaryList = document.getElementById("eq-summary-list");

  let currentStep = 1;

  // === SAMPLE UBT COURSES (for dropdown) ===
  const ubtCourses = [
    { code: "BAIS101", name: "Introduction to Information Systems", credits: 3 },
    { code: "BAIS200", name: "Introduction to Programming", credits: 3 },
    { code: "BAIS210", name: "Database Management", credits: 3 },
    { code: "BAIS300", name: "Business Application Development", credits: 3 },
    { code: "BAIS305", name: "E‑Commerce", credits: 3 },
    { code: "BAIS310", name: "Web & Mobile App Development", credits: 3 },
    { code: "BAIS405", name: "System Analysis & Design", credits: 3 },
    { code: "BAIS415", name: "Data Mining & Analysis", credits: 3 },
    { code: "BUS470", name: "Research Methods", credits: 3 },
    { code: "BUS471", name: "Strategic Management", credits: 3 }
  ];

  // Fill dropdown
  if (ubtCourseSelect) {
    ubtCourses.forEach(course => {
      const opt = document.createElement("option");
      opt.value = course.code;
      opt.textContent = `${course.code} – ${course.name}`;
      ubtCourseSelect.appendChild(opt);
    });
  }

  // === STEP SWITCHING ===
  function goToStep(step) {
    currentStep = step;

    stepIndicators.forEach(ind => {
      const s = Number(ind.dataset.step);
      if (s === step) {
        ind.classList.add("active");
      } else {
        ind.classList.remove("active");
      }
    });

    stepPanels.forEach(panel => {
      const s = Number(panel.dataset.stepPanel);
      panel.classList.toggle("hidden", s !== step);
    });

    if (errorBox) errorBox.style.display = "none";
  }

  // Allow clicking on step headers (only backwards or current)
  stepIndicators.forEach(indicator => {
    indicator.addEventListener("click", () => {
      const targetStep = Number(indicator.dataset.step);
      if (targetStep <= currentStep) {
        goToStep(targetStep);
      }
    });
  });

  // === SIMPLE VALIDATION ===
  function hasStep1Data() {
    return (
      prevInstitution.value.trim() &&
      prevCode.value.trim() &&
      prevName.value.trim() &&
      prevCredits.value.trim() &&
      prevGrade.value.trim()
    );
  }

  function hasStep2Data() {
    return ubtCourseSelect.value.trim() !== "";
  }

  // === STEP BUTTONS ===
  if (btnNext1) {
    btnNext1.addEventListener("click", () => {
      if (!hasStep1Data()) {
        if (errorBox) {
          errorBox.textContent = "Please complete all required fields in Step 1.";
          errorBox.style.display = "block";
        }
        return;
      }
      goToStep(2);
    });
  }

  if (btnPrev2) {
    btnPrev2.addEventListener("click", () => goToStep(1));
  }

  if (btnNext2) {
    btnNext2.addEventListener("click", () => {
      if (!hasStep2Data()) {
        if (errorBox) {
          errorBox.textContent = "Please select a UBT course in Step 2.";
          errorBox.style.display = "block";
        }
        return;
      }
      goToStep(3);
    });
  }

  if (btnPrev3) {
    btnPrev3.addEventListener("click", () => goToStep(2));
  }

  // === EVALUATION LOGIC ===
  if (btnEvaluate) {
    btnEvaluate.addEventListener("click", () => {
      if (!hasStep1Data() || !hasStep2Data()) {
        if (errorBox) {
          errorBox.textContent = "Please complete Steps 1 and 2 before evaluating.";
          errorBox.style.display = "block";
        }
        return;
      }

      const prevCred = parseFloat(prevCredits.value) || 0;
      const grade = prevGrade.value;
      const topicsText = prevTopics.value || "";
      const wordCount = topicsText.trim() ? topicsText.trim().split(/\s+/).length : 0;

      const ubtCourse = ubtCourses.find(c => c.code === ubtCourseSelect.value);

      // Basic heuristic:
      // - Enough credits
      // - Reasonable word count of topics
      // - Grade C or above
      let decision = "Needs manual review";
      let badgeClass = "status-review";
      let reason =
        "Based on the provided information, the course may be similar but requires detailed review by the equalization committee.";

      const gradesOk = ["A+", "A", "B+", "B", "C+", "C"];

      if (ubtCourse) {
        if (prevCred >= ubtCourse.credits && wordCount >= 40 && gradesOk.includes(grade)) {
          decision = "Likely eligible for equalization";
          badgeClass = "status-yes";
          reason =
            "The course has similar or higher credit hours, enough listed topics, and a passing grade. It is likely to be accepted, subject to official approval.";
        } else if (prevCred >= ubtCourse.credits - 1 && wordCount >= 25 && gradesOk.includes(grade)) {
          decision = "Partially eligible / possible conditional equalization";
          badgeClass = "status-partial";
          reason =
            "The course is close in credits and content. The committee may accept it conditionally or ask for extra documents or an interview.";
        } else {
          decision = "Unlikely to be equalized";
          badgeClass = "status-no";
          reason =
            "There may be a shortage in credit hours, topics covered, or grade. It is unlikely to be accepted as a full equivalent.";
        }
      }

      // Update card
      decisionCard.classList.remove("status-yes", "status-no", "status-partial", "status-review");
      decisionCard.classList.add(badgeClass);
      decisionBadge.textContent = decision;
      decisionTitle.textContent = ubtCourse
        ? `Match: ${prevCode.value.toUpperCase()} → ${ubtCourse.code}`
        : "Match not found";
      decisionReason.textContent = reason;

      // Update summary
      summaryList.innerHTML = `
        <li><strong>Institution:</strong> ${prevInstitution.value || "-"}</li>
        <li><strong>Previous course:</strong> ${prevCode.value || "-"} – ${prevName.value || "-"}</li>
        <li><strong>Previous credits:</strong> ${prevCred || "-"}</li>
        <li><strong>Previous grade:</strong> ${grade || "-"}</li>
        <li><strong>UBT course:</strong> ${
          ubtCourse ? `${ubtCourse.code} – ${ubtCourse.name}` : "-"
        }</li>
        <li><strong>UBT advisor notes:</strong> ${ubtNotes.value || "None"}</li>
        <li><strong>Topics word count (approx):</strong> ${wordCount}</li>
      `;
    });
  }

  // Start at step 1
  goToStep(1);
});

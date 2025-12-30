// navigation.js – interactive campus map for CE Ground Floor

document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("location-search");
  const categoryFilter = document.getElementById("location-filter");
  const listEl = document.getElementById("location-list");
  const detailsEl = document.getElementById("location-details");
  const pins = Array.from(document.querySelectorAll(".map-pin"));

  // --- Data for each spot (id must match data-location on pins) ---
  const LOCATIONS = [
    {
      id: "auditorium",
      name: "Auditorium",
      category: "teaching",
      access: true,
      description:
        "Large auditorium used for orientations, events and big lectures.",
      directions:
        "From the main entrance, walk straight through the circular lobby then continue to the far right side of the building."
    },
    {
      id: "main-entrance",
      name: "Main Entrance",
      category: "service",
      access: true,
      description:
        "Primary entrance to the CE building, connected to the circular lobby.",
      directions:
        "You are here when you first enter the building from the front drop‑off area."
    },
    {
      id: "software-labs",
      name: "Software Labs Block",
      category: "lab",
      access: true,
      description:
        "Cluster of Software Labs used for programming and networking courses.",
      directions:
        "From the main entrance, go left around the circular lobby and continue down the corridor until you reach the software lab zone."
    },
    {
      id: "mech-lab",
      name: "Mechanical Lab",
      category: "lab",
      access: false,
      description:
        "Mechanical Engineering laboratory located at the top‑left side of the floor.",
      directions:
        "From the main entrance, move forward into the central corridor and keep left towards the far end of the building."
    },
    {
      id: "physics-labs",
      name: "Physics Labs",
      category: "lab",
      access: false,
      description:
        "Physics laboratories used for experiments and practical sessions.",
      directions:
        "From the main entrance, head forward to the central block and follow the corridor straight ahead towards the top‑center area."
    },
    {
      id: "chem-lab",
      name: "Chemistry Lab",
      category: "lab",
      access: false,
      description:
        "Chemistry laboratory located near the physics labs on the upper‑right.",
      directions:
        "From the circular lobby, walk forward and slightly right following signs for the Chemistry Lab."
    },
    {
      id: "conference-rooms",
      name: "Conference Rooms",
      category: "teaching",
      access: true,
      description:
        "Two conference rooms used for seminars, meetings and smaller events.",
      directions:
        "From the main entrance, walk straight ahead; the conference rooms are just before you reach the central corridor."
    },
    {
      id: "ramp-left",
      name: "Left Handicap Ramp",
      category: "access",
      access: true,
      description:
        "Accessible ramp on the left side of the main entrance zone.",
      directions:
        "From outside, approach the building on the left side of the main stairs and follow the green ramp."
    },
    {
      id: "ramp-right",
      name: "Right Handicap Ramp",
      category: "access",
      access: true,
      description:
        "Accessible ramp on the right side of the main entrance zone.",
      directions:
        "From outside, approach the building on the right side of the main stairs and follow the green ramp."
    },
    {
      id: "wc-left",
      name: "Handicap Toilet – Left Wing",
      category: "access",
      access: true,
      description:
        "Accessible restroom located near the labs on the left wing.",
      directions:
        "From the main entrance, go towards the left corridors and follow signage for the handicap toilet."
    },
    {
      id: "wc-right",
      name: "Handicap Toilet – Right Wing",
      category: "access",
      access: true,
      description:
        "Accessible restroom located near the labs on the right wing.",
      directions:
        "From the main entrance, go towards the right corridors and follow signage for the handicap toilet."
    }
  ];

  // --- Render list on the right ---
  function renderList(filterText = "", category = "") {
    const term = filterText.toLowerCase().trim();

    const filtered = LOCATIONS.filter(loc => {
      const matchTerm =
        !term ||
        loc.name.toLowerCase().includes(term) ||
        loc.description.toLowerCase().includes(term);
      const matchCat = !category || loc.category === category;
      return matchTerm && matchCat;
    });

    listEl.innerHTML = "";

    filtered.forEach(loc => {
      const li = document.createElement("li");
      li.dataset.locationId = loc.id;
      li.innerHTML = `
        <span>${loc.name}</span>
        <span class="tag">${
          loc.category === "lab"
            ? "Lab"
            : loc.category === "teaching"
            ? "Teaching"
            : loc.category === "service"
            ? "Service"
            : "Accessible"
        }</span>
      `;
      listEl.appendChild(li);
    });

    if (filtered.length === 0) {
      listEl.innerHTML =
        '<li><span style="color:var(--text-muted);">No matching places.</span></li>';
    }
  }

  // --- Show details card ---
  function showLocation(id) {
    const loc = LOCATIONS.find(l => l.id === id);
    if (!loc) return;

    // Highlight list
    Array.from(listEl.querySelectorAll("li")).forEach(li => {
      li.classList.toggle("active", li.dataset.locationId === id);
    });

    // Highlight pin
    pins.forEach(pin => {
      pin.classList.toggle("active", pin.dataset.location === id);
    });

    detailsEl.innerHTML = `
      <h3>${loc.name}</h3>
      <p><strong>Floor:</strong> CE Ground Floor</p>
      <p><strong>Category:</strong> ${
        loc.category === "lab"
          ? "Lab"
          : loc.category === "teaching"
          ? "Teaching / Hall"
          : loc.category === "service"
          ? "Service"
          : "Accessible Facility"
      }</p>
      <p><strong>Accessibility:</strong> ${
        loc.access ? "Accessible" : "Standard access"
      }</p>
      <hr>
      <p>${loc.description}</p>
      <p><strong>How to get there:</strong> ${loc.directions}</p>
    `;
  }

  // --- Events ---

  // Pins click
  pins.forEach(pin => {
    pin.addEventListener("click", () => {
      const id = pin.dataset.location;
      showLocation(id);
    });
  });

  // List click
  listEl.addEventListener("click", e => {
    const li = e.target.closest("li[data-location-id]");
    if (!li) return;
    showLocation(li.dataset.locationId);
  });

  // Search + category filter
  function updateFilter() {
    renderList(searchInput.value, categoryFilter.value);
  }

  searchInput.addEventListener("input", updateFilter);
  categoryFilter.addEventListener("change", updateFilter);

  // Initial render
  renderList();
});

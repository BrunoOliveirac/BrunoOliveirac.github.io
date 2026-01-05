const enTranslation = await fetch("./i18n/en.json").then((res) => res.json());
const esTranslation = await fetch("./i18n/es.json").then((res) => res.json());
const ptTranslation = await fetch("./i18n/pt.json").then((res) => res.json());

const skills = await fetch("./assets/mocks/skills.mock.json").then((res) =>
  res.json()
);

const projects = await fetch("./assets/mocks/projects.mock.json").then((res) =>
  res.json()
);

const resources = new Map(
  Object.entries({ pt: ptTranslation, en: enTranslation, es: esTranslation })
);

const projectColors = [
  "bg-blue-700/20",
  "bg-purple-700/20",
  "bg-emerald-700/20",
  "bg-yellow-700/20",
  "bg-red-700/20",
];

let currentLanguage = localStorage.getItem("language") || "pt";
if (!localStorage.getItem("language")) updateLanguageTexts();

// Progress Bar
let progress = 0;
const progressBarElement = document.getElementById("progress-bar");

// Update the progress bar from 0 to 100 in 10ms
const interval = setInterval(() => {
  progress++;
  progressBarElement.style.width = progress + "%";

  if (progress >= 100) clearInterval(interval);
}, 11); // 1100ms / 100 = 11ms

// Projects Section
const projectsContainerElement = document.getElementById("projects-container");

projects.forEach((project) => {
  const card = document.createElement("div");

  card.innerHTML = `
    <div class="gradient-border p-5 rounded-xl h-full">
      <h3 class="text-lg text-white font-semibold mb-3" data-i18n="${
        project.title
      }"></h3>

      <div class="flex flex-wrap gap-2 text-sm mb-3">
        ${project.types
          .map(
            (type, index) =>
              `<span class="rounded-full ${projectColors[index]} text-white px-3 py-1" data-i18n="${type}"></span>`
          )
          .join("")}
      </div>

      <p class="text-sm text-slate-300">${project.stack.join(" • ")}</p>
    </div>
  `;

  projectsContainerElement.appendChild(card);
});

// Set the page text and active class of navs and languages
updateLanguageTexts();
const languageItemElements = document.querySelectorAll(".language-item");
const bodyElement = document.querySelector("body");
const links = document.querySelectorAll(".nav-link");
const sectionElements = document.querySelectorAll("section");
setActiveSection();

// Loading Section Code
const languageElement = document.querySelector(`#${currentLanguage}`);
if (languageElement) languageElement.classList.add("active");

// Skills Section
const skillsContainerElement = document.getElementById("skills-container");

skills.forEach((skill) => {
  const card = document.createElement("div");

  card.innerHTML = `
    <div>
      <div class="bg-[#2B2B2B] rounded-xl w-[118px] p-6 mb-3">
        <img class="mx-auto" src="/assets/icons/skills/${
          skill.image
        }.svg" width="48" height="48" alt="${skill.name}">
        
        <div class="flex justify-center gap-1 mt-4">
          ${renderPoints(skill.points)}
        </div>
      </div>

      <p class="text-slate-300 text-lg text-center">${skill.name}</p>
    </div>
  `;

  skillsContainerElement.appendChild(card);
});

// Scroll Section
const scrollY = localStorage.getItem("scrollY");
if (scrollY !== null) window.scrollTo(0, parseInt(scrollY, 10));

setTimeout(() => {
  sectionElements.forEach((section) => {
    if (section.id === "loading") {
      section.classList.add("opacity-0");
      setTimeout(() => (section.hidden = true), 700);
    } else {
      section.classList.remove("opacity-0");
      setTimeout(() => bodyElement.classList.remove("overflow-y-hidden"), 250);
    }
  });
}, 750);

window.addEventListener("scroll", () => {
  setActiveSection();
  localStorage.setItem("scrollY", window.scrollY);
});

/**
 * Change the language of the page
 */
document.addEventListener("click", (event) => {
  if (event.target.closest("button")?.className.includes("language-item")) {
    currentLanguage = event.target.closest("button").id;
    updateLanguageTexts(event.target.id);

    languageItemElements.forEach((item) => {
      if (item.id === currentLanguage) item.classList.add("active");
      else item.classList.remove("active");
    });

    return;
  }
});

/**
 * Manipualate the "active" class of section and language
 */
function setActiveSection() {
  let currentSectionId = null;

  sectionElements.forEach((section) => {
    const rect = section.getBoundingClientRect();
    const paddingTop = parseInt(getComputedStyle(section).paddingTop);

    if (rect.top <= paddingTop && rect.bottom > paddingTop) {
      currentSectionId = section.id;
    }
  });

  if (currentSectionId) {
    links.forEach((link) => {
      link.classList.toggle(
        "active",
        link.getAttribute("href") === `#${currentSectionId}`
      );
    });
  }
}

/**
 * Update the content of the page with the translated text
 */
function updateLanguageTexts() {
  localStorage.setItem("language", currentLanguage);
  const elements = document.querySelectorAll("[data-i18n]");

  elements.forEach((el) => {
    const key = el.getAttribute("data-i18n");
    el.innerHTML = resources.get(currentLanguage)[key];

    if (key === "rights_reserved") {
      el.innerHTML = `©${new Date().getFullYear()} | ${el.innerHTML}`;
    }
  });
}

/**
 * Render the skills points
 */
function renderPoints(points) {
  const color = getSkillColor(points);
  let dots = "";

  for (let i = 1; i <= 5; i++) {
    dots += `
      <span class="w-1.5 h-1.5 rounded-full ${
        i <= points ? color : "bg-gray-300"
      }"></span>
    `;
  }

  return dots;
}

/**
 * Get the color of the skill based on the points
 */
function getSkillColor(points) {
  switch (points) {
    case 1:
      return "bg-[#ef4444]";
    case 2:
      return "bg-[#f97316]";
    case 3:
      return "bg-[#eab308]";
    case 4:
      return "bg-[#22c55e]";
    case 5:
      return "bg-[#15803d]";
    default:
      return "bg-[#d1d5db]";
  }
}

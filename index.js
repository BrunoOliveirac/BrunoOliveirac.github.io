const enTranslation = await fetch("./i18n/en.json").then((res) => res.json());
const esTranslation = await fetch("./i18n/es.json").then((res) => res.json());
const ptTranslation = await fetch("./i18n/pt.json").then((res) => res.json());

const resources = new Map(
  Object.entries({ pt: ptTranslation, en: enTranslation, es: esTranslation })
);

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
}, 7); // 700ms / 100 = 7ms

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

const scrollY = localStorage.getItem("scrollY");
if (scrollY !== null) window.scrollTo(0, parseInt(scrollY, 10));

sectionElements.forEach((section) => {
  setTimeout(() => {
    if (section.id === "loading") {
      section.classList.add("opacity-0");
      setTimeout(() => (section.hidden = true), 700);
    } else {
      section.classList.remove("opacity-0");
      setTimeout(() => bodyElement.classList.remove("overflow-y-hidden"), 250);
    }
  }, 700);
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

window.addEventListener("scroll", () => {
  setActiveSection();
  localStorage.setItem("scrollY", window.scrollY);
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

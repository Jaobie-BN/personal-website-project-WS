/**
 * WHACK-A-MOLE GAME ENGINE
 * Implementation follows JavaScript Best Practices:
 * - Module Pattern / Encapsulation
 * - State Management
 * - Cached DOM References
 * - Descriptive Comments
 */

(function () {
  "use strict";

  // --- 1. STATE MANAGEMENT ---
  const state = {
    score: 0,
    timer: 30,
    isPlaying: false,
    lastHole: null,
    gameInterval: null,
    countdownInterval: null,
  };

  // --- 2. CACHED DOM REFERENCES ---
  const elements = {
    holes: document.querySelectorAll(".hole"),
    scoreDisplay: document.getElementById("score"),
    timerDisplay: document.getElementById("timer"),
    startBtn: document.getElementById("start-btn"),
    moles: document.querySelectorAll(".mole"),
  };

  // --- 3. CORE UTILITIES ---

  /**
   * Get a random time between min and max
   * @param {number} min
   * @param {number} max
   * @returns {number}
   */
  function randomTime(min, max) {
    return Math.round(Math.random() * (max - min) + min);
  }

  /**
   * Pick a random hole, ensuring it's not the same as the last one
   * @param {NodeList} holes
   * @returns {HTMLElement}
   */
  function randomHole(holes) {
    const idx = Math.floor(Math.random() * holes.length);
    const hole = holes[idx];

    if (hole === state.lastHole) {
      return randomHole(holes);
    }
    state.lastHole = hole;
    return hole;
  }

  // --- 4. GAME LOGIC ---

  /**
   * Make a mole pop up and then disappear
   */
  function peep() {
    const time = randomTime(500, 1500); // Speed range
    const hole = randomHole(elements.holes);

    hole.classList.add("up");

    setTimeout(() => {
      hole.classList.remove("up");
      if (state.isPlaying) peep();
    }, time);
  }

  /**
   * Handle the timer countdown
   */
  function startTimer() {
    state.countdownInterval = setInterval(() => {
      state.timer--;
      elements.timerDisplay.textContent = state.timer;

      if (state.timer <= 0) {
        endGame();
      }
    }, 1000);
  }

  /**
   * Initialize/Start the game
   */
  function startGame() {
    if (state.isPlaying) return;

    // Reset state
    state.score = 0;
    state.timer = 30;
    state.isPlaying = true;

    elements.scoreDisplay.textContent = 0;
    elements.timerDisplay.textContent = 30;
    elements.startBtn.textContent = "Playing...";
    elements.startBtn.disabled = true;

    peep();
    startTimer();
  }

  /**
   * Clean up and finish the game
   */
  function endGame() {
    state.isPlaying = false;
    clearInterval(state.countdownInterval);
    elements.startBtn.textContent = "Start Game";
    elements.startBtn.disabled = false;
    alert(`Game Over! Final Score: ${state.score}`);
  }

  /**
   * Handle whack event
   * @param {Event} e
   */
  function whack(e) {
    if (!e.isTrusted) return; // Prevent fake clicks

    // Only count if mole is up
    if (this.parentNode.classList.contains("up")) {
      state.score++;
      this.parentNode.classList.remove("up");
      elements.scoreDisplay.textContent = state.score;
    }
  }

  // --- 5. EVENT LISTENERS ---
  if (elements.startBtn) {
    elements.startBtn.addEventListener("click", startGame);
  }
  elements.moles.forEach((mole) => mole.addEventListener("click", whack));
})();

/**
 * NAVIGATION MODULE
 * Handles the mobile hamburger menu toggle functionality.
 */
(function () {
  "use strict";

  const menuToggle = document.querySelector(".menu-toggle");
  const navMenu = document.querySelector("nav ul");
  const navLinks = document.querySelectorAll("nav ul li a");

  if (!menuToggle || !navMenu) return;

  /**
   * Toggle the navigation menu open/close state
   */
  function toggleMenu() {
    const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";

    // Toggle classes and ARIA attributes for accessibility
    menuToggle.setAttribute("aria-expanded", !isExpanded);
    menuToggle.classList.toggle("active");
    navMenu.classList.toggle("active");

    // Prevent scrolling when menu is open
    document.body.style.overflow = !isExpanded ? "hidden" : "";
  }

  // Handle click on hamburger button
  menuToggle.addEventListener("click", toggleMenu);

  // Close menu when a navigation link is clicked
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      menuToggle.classList.remove("active");
      navMenu.classList.remove("active");
      menuToggle.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    });
  });
})();

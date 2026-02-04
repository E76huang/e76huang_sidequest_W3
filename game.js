// NOTE: Do NOT add setup() or draw() in this file
// setup() and draw() live in main.js
// This file only defines:
// 1) drawGame() → what the game screen looks like
// 2) input handlers → what happens when the player clicks or presses keys
// 3) helper functions specific to this screen

// ------------------------------
// Button data
// ------------------------------
// This object stores all the information needed to draw
// and interact with the button on the game screen.
// Keeping this in one object makes it easier to move,
// resize, or restyle the button later.
const gameBtn = {
  x: 400, // x position (centre of the button)
  y: 550, // y position (centre of the button)
  w: 260, // width
  h: 90, // height
  label: "PRESS HERE", // text shown on the button
};
// Array of game decisions
const decisions = [
  {
    question: "You see a lost puppy. What do you do?",
    options: [
      { text: "Pet it", good: true },
      { text: "Yell at it", good: false },
    ],
  },
  {
    question: "Do you give the puppy a treat?",
    options: [
      { text: "Give it a treat", good: true },
      { text: "Let it starve", good: false },
    ],
  },
  {
    question: "Do you give it water?",
    options: [
      { text: "Give water", good: true },
      { text: "Give a mysterious beverage", good: false },
    ],
  },
  {
    question: "Do you take it on a walk?",
    options: [
      { text: "Take it on a walk", good: true },
      { text: "Ignore it", good: false },
    ],
  },
  {
    question: "Teach it tricks?",
    options: [
      { text: "Teach it fetch", good: true },
      { text: "No, it's to much of a hassle", good: false },
    ],
  },
];

// ------------------------------
// Main draw function for this screen
// ------------------------------
// drawGame() is called from main.js *only*
// when currentScreen === "game"

function drawGame() {
  background(240, 230, 140);

  fill(0);

  textAlign(CENTER, CENTER);

  textSize(28);
  text("Lost Puppy Adventure", width / 2, 100);

  // Show current question
  const current = decisions[choiceIndex];
  textSize(22);
  text(current.question, width / 2, 200);

  // Draw buttons for current options
  current.options.forEach((opt, i) => {
    const btn = {
      x: width / 2,
      y: 300 + i * 100,
      w: 400,
      h: 70,
      label: opt.text,
    };
    drawGameButton(btn);
    opt._btn = btn; // store the button for input checking
  });

  // Show tracker on top-right
  textSize(18);
  textAlign(RIGHT, TOP);
  text(`Good Choices: ${goodChoices}/${totalChoices}`, width - 20, 20);

  // Cursor feedback
  let hover = current.options.some((opt) => isHover(opt._btn));
  cursor(hover ? HAND : ARROW);
}

// ------------------------------
// Button drawing helper
// ------------------------------
// This function is responsible *only* for drawing the button.
// It does NOT handle clicks or game logic.
function drawGameButton({ x, y, w, h, label }) {
  rectMode(CENTER);

  // Check if the mouse is hovering over the button
  // isHover() is defined in main.js so it can be shared
  const hover = isHover({ x, y, w, h });

  noStroke();

  // Change button colour when hovered
  // This gives visual feedback to the player
  fill(
    hover
      ? color(180, 220, 255, 220) // lighter blue on hover
      : color(200, 220, 255, 190), // normal state
  );

  // Draw the button rectangle
  rect(x, y, w, h, 14); // last value = rounded corners

  // Draw the button text
  fill(0);
  textSize(28);
  textAlign(CENTER, CENTER);
  text(label, x, y);
}

// ------------------------------
// Mouse input for this screen
// ------------------------------
// This function is called from main.js
// only when currentScreen === "game"
function gameMousePressed() {
  const current = decisions[choiceIndex];
  current.options.forEach((opt) => {
    if (isHover(opt._btn)) {
      if (opt.good) goodChoices++; // increment for good choices
      choiceIndex++; // move to next question

      // Check if all questions answered
      if (choiceIndex >= totalChoices) {
        // If player got more than half good, good ending
        if (goodChoices >= totalChoices / 2) currentScreen = "win";
        else currentScreen = "lose";

        // Reset for next playthrough
        choiceIndex = 0;
        goodChoices = 0;
      }
    }
  });
}

// ------------------------------
// Keyboard input for this screen
// ------------------------------
// Allows keyboard-only interaction (accessibility + design)
function gameKeyPressed() {
  // ENTER key triggers the same behaviour as clicking the button
  if (keyCode === ENTER) {
    triggerRandomOutcome();
  }
}

// ------------------------------
// Game logic: win or lose
// ------------------------------
// This function decides what happens next in the game.
// It does NOT draw anything.
function triggerRandomOutcome() {
  // random() returns a value between 0 and 1
  // Here we use a 50/50 chance:
  // - less than 0.5 → win
  // - 0.5 or greater → lose
  //
  // You can bias this later, for example:
  // random() < 0.7 → 70% chance to win
  if (random() < 0.5) {
    currentScreen = "win";
  } else {
    currentScreen = "lose";
  }
}

console.clear();

// ----------------------------------------------
// Do not modify this code.
// ----------------------------------------------

let canvas = document.getElementById("game");
let context2d = canvas.getContext("2d");
let pacman_model = null;
let snack_pellets = null;
let time_index = 0;
let key = null;
let radius = 20;
let displacement = 5;
let score = 0;
let paused = true;
let x_pacman = 0;
let y_pacman = 0;
let walls = null; //NEW

function createWalls() {
  //NEW
  walls = [
    { x: 45, y: 65, width: 110, height: 15 },
    { x: 265, y: 95, width: 20, height: 160 },
    // add more if needed
  ];
}

function collidesWithWall(x, y) {
  //NEW
  for (let wall of walls) {
    if (
      x + radius > wall.x &&
      x - radius < wall.x + wall.width &&
      y + radius > wall.y &&
      y - radius < wall.y + wall.height
    ) {
      return true;
    }
  }
  return false;
}

function hypotenus(a, b) {
  return Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
}

function createSnackPellets() {
  let index = 0;
  let pellet_radius = 3;
  let space = 25;
  let path = null;

  for (let y_pellet = space; y_pellet < canvas.height; y_pellet += space) {
    for (let x_pellet = space; x_pellet < canvas.width; x_pellet += space) {
      if (
        hypotenus(x_pellet - canvas.width / 2, y_pellet - canvas.height / 2) >
        radius + space / 2
      ) {
        path = new Path2D();
        path.arc(x_pellet, y_pellet, pellet_radius, 0, 2 * Math.PI);
        snack_pellets[index++] = { x: x_pellet, y: y_pellet, circle: path };
      }
    }
  }
}

function createModel() {
  pacman_model[0] = new Path2D();
  pacman_model[0].moveTo(0, 0);
  pacman_model[0].arc(0, 0, radius, 0, 2 * Math.PI);
  pacman_model[0].lineTo(0, 0);

  pacman_model[1] = new Path2D();
  pacman_model[1].moveTo(0, 0);
  pacman_model[1].lineTo(
    (radius * Math.cos(25 * Math.PI)) / 180,
    (radius * Math.sin(25 * Math.PI)) / 180
  );
  pacman_model[1].arc(
    0,
    0,
    radius,
    (25 * Math.PI) / 180,
    (-25 * Math.PI) / 180
  );
  pacman_model[1].lineTo(0, 0);

  pacman_model[2] = new Path2D();
  pacman_model[2].moveTo(0, 0);
  pacman_model[2].lineTo(
    radius * Math.cos((45 * Math.PI) / 180),
    radius * Math.sin((45 * Math.PI) / 180)
  );
  pacman_model[2].arc(
    0,
    0,
    radius,
    (45 * Math.PI) / 180,
    (-45 * Math.PI) / 180
  );
  pacman_model[2].lineTo(0, 0);

  pacman_model[3] = pacman_model[1];
}

// ----------------------------------------------
// Task 1: Todo - put JS code below.
// ----------------------------------------------

function startGame() {
  x_pacman = canvas.width / 2;
  y_pacman = canvas.height / 2;

  time_index = 0;
  score = 0;

  pacman_model = [];
  snack_pellets = [];

  key = "ArrowRight";
  paused = true;

  createModel();
  createSnackPellets();
  createWalls();
}

// ----------------------------------------------
// Task 2: Todo - modify the JS code below.
// ----------------------------------------------
document.addEventListener("keyup", keyEvent);

function keyEvent(event) {
  if (event.key === "s") {
    startGame();
  } else if (event.key === " ") {
    paused = !paused;
  } else if (!paused) {
    key = event.key;
  }
}

// ----------------------------------------------
// Task 3: Todo - put JS code below.
// ----------------------------------------------

function draw() {
  // Update gamescore
  const gameScore = document.getElementById("score");
  gameScore.innerText = " " + score;

  // Clear canvas context
  context2d.clearRect(0, 0, canvas.width, canvas.height);

  // Set fill and stroke colors
  context2d.fillStyle = "black";
  context2d.strokeStyle = "black";

  context2d.save();

  // Determine the snack pellets are consumed, update score, and update remaining pellets
  const remaining = [];
  for (let pellet of snack_pellets) {
    const dx = x_pacman - pellet.x;
    const dy = y_pacman - pellet.y;
    // Use hypotenus function to calculate distance
    const dist = hypotenus(dx, dy);
    // Snack pellet consumed when distance is less than half the PacMan radius
    if (dist < radius / 2) {
      score += 10;
    } else {
      remaining.push(pellet);
    }
  }
  snack_pellets = remaining;

  // Draw remaining snack pellets
  if (Array.isArray(snack_pellets)) {
    for (let pellet of snack_pellets) {
      if (!pellet) continue;
      context2d.fill(pellet.circle);
    }
  }

  // Set fill color to blue and draw walls
  context2d.fillStyle = "blue";
  for (let wall of walls) {
    context2d.fillRect(wall.x, wall.y, wall.width, wall.height);
  }

  // Restrict PacMan position
  x_pacman = Math.min(Math.max(x_pacman, radius), canvas.width - radius);
  y_pacman = Math.min(Math.max(y_pacman, radius), canvas.height - radius);

  // Translate PacMan
  context2d.translate(x_pacman, y_pacman);

  // Determine direction
  let angle = 0;
  if (key === "ArrowLeft") {
    angle = Math.PI;
  } else if (key === "ArrowUp") {
    angle = -Math.PI / 2;
  } else if (key === "ArrowDown") {
    angle = Math.PI / 2;
  } else {
    angle = 0;
  }

  // Rotate PacMan based on direction
  context2d.rotate(angle);

  // Check and update PacMan position
  if (!paused) {
    let X = x_pacman;
    let Y = y_pacman;

    if (key === "ArrowRight") X += displacement;
    else if (key === "ArrowLeft") X -= displacement;
    else if (key === "ArrowDown") Y += displacement;
    else if (key === "ArrowUp") Y -= displacement;

    if (!collidesWithWall(X, Y)) {
      x_pacman = X;
      y_pacman = Y;
    }
  }

  // Draw yellow PacMan
  context2d.fillStyle = "yellow";
  context2d.fill(pacman_model[time_index]);
  context2d.strokeStyle = "black";
  context2d.stroke(pacman_model[time_index]);

  // Restore context
  context2d.restore();

  // Increment time
  time_index += 1;
  if (time_index >= 4) time_index = 0;
}

// ----------------------------------------------
// Task 4: Todo - put JS code below.
// ----------------------------------------------

startGame();
setInterval(draw, 100);

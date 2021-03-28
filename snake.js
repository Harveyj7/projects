const btn = document.querySelector("h1");
const canvas = document.querySelector("canvas");
const boxes = document.querySelectorAll('input[type="radio"]');
const button = document.querySelector("button");
const ctx = canvas.getContext("2d");
const board_border = "black";
const board_background = "white";
let score = 0;
let snake = [];
let dy = 0;
let food_x;
let food_y;
let speed;
let size;
let bool = false;

if (document.body.clientWidth < 600) {
  canvas.width = document.body.clientWidth - 25;
  canvas.height = document.body.clientHeight + 130;
  size = 12.5;
} else if (document.body.clientWidth < 1300) {
  canvas.width = document.body.clientWidth - 80;
  canvas.height = document.body.clientHeight + 300;
  size = 25;
} else {
  canvas.width = document.body.clientWidth - 160;
  canvas.height = document.body.clientHeight + 250;
  size = 50;
}
let dx = size;
button.addEventListener("click", () => main());

coords();
function main() {
  setTimeout(function onTick() {
    clearCanvas();
    drawSnake();
    drawFood();
    moveSnake();
    let bool = has_game_ended();
    console.log(bool);
    if (has_game_ended()) {
      coords();
      ctx.fillStyle = "red";
      ctx.font = `${size}px Arial`;
      ctx.fillText(`You lose! Score of ${score}`, size * 10, size * 10);
      score = 0;
      return;
    } else {
      main();
    }
    // Call main again
  }, speed);
}
function drawSnake() {
  snake.forEach(drawSnakePart);
}
function coords() {
  snake = [
    { x: size * 4, y: 50 },
    { x: size * 3, y: 50 },
    { x: size * 2, y: 50 },
    { x: size * 1, y: 50 },
    { x: size * 0, y: 50 },
  ];
  return snake;
}

// Draw one snake part
function drawSnakePart(snakePart) {
  ctx.fillRect(snakePart.x, snakePart.y, size, size);
  ctx.fillStyle = "lightblue";
  ctx.strokeRect(snakePart.x, snakePart.y, size, size);
}
function moveSnake() {
  const head = { x: snake[0].x + dx, y: snake[0].y + dy };
  snake.unshift(head);
  const has_eaten_food = snake[0].x === food_x && snake[0].y === food_y;
  // let score = parseFloat(document.getElementById("score").innerHTML);
  if (has_game_ended()) {
    return score;
  } else {
    if (has_eaten_food) {
      score += 1;
      gen_food();
    } else {
      snake.pop();
    }
  }
  document.getElementById("score").innerHTML = score;
}
function clearCanvas() {
  ctx.fillStyle = board_background;
  ctx.strokestyle = board_border;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeRect(0, 0, canvas.width, canvas.height);
}
function has_game_ended() {
  for (let i = 4; i < snake.length; i++) {
    if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) return true;
  }
  const hitLeftWall = snake[0].x < 0;
  const hitRightWall = snake[0].x > canvas.width;
  const hitToptWall = snake[0].y < 0;
  const hitBottomWall = snake[0].y > canvas.height;
  return hitLeftWall || hitRightWall || hitToptWall || hitBottomWall;
}

function change_direction(event) {
  const LEFT_KEY = 37;
  const RIGHT_KEY = 39;
  const UP_KEY = 38;
  const DOWN_KEY = 40;

  const keyPressed = event.keyCode;
  const goingUp = dy === -size;
  const goingDown = dy === size;
  const goingRight = dx === size;
  const goingLeft = dx === -size;

  if (keyPressed === LEFT_KEY && !goingRight) {
    dx = -size;
    dy = 0;
  }
  if (keyPressed === UP_KEY && !goingDown) {
    dx = 0;
    dy = -size;
  }
  if (keyPressed === RIGHT_KEY && !goingLeft) {
    dx = size;
    dy = 0;
  }
  if (keyPressed === DOWN_KEY && !goingUp) {
    dx = 0;
    dy = size;
  }
}
function random_food(min, max) {
  console.log(Math.round((Math.random() * (max - min) + min) / size) * size);
  return Math.round((Math.random() * (max - min) + min) / size) * size;
}
function gen_food() {
  food_x = random_food(0, canvas.width - size);
  food_y = random_food(0, canvas.height - size);
  snake.forEach(function has_snake_eaten_food(part) {
    const has_eaten = part.x == food_x && part.y == food_y;
    if (has_eaten) gen_food();
  });
}
function drawFood() {
  ctx.fillStyle = "lightgreen";
  ctx.strokestyle = "darkgreen";
  ctx.fillRect(food_x, food_y, size, size);
  ctx.strokeRect(food_x, food_y, size, size);
}

function handleCheck() {
  if (this.value === "easy") {
    speed = 100;
  } else if (this.value === "medium") {
    speed = 60;
  } else {
    speed = 40;
  }
}
gen_food();
boxes.forEach((box) => box.addEventListener("click", handleCheck));
document.addEventListener("keydown", change_direction);

const btn = document.querySelector("h1");
const canvas = document.querySelector("canvas");
const boxes = document.querySelectorAll('input[type="radio"]');
const button = document.querySelector("button");
const ctx = canvas.getContext("2d");
ctx.font = "30px Arial";
const board_border = "black";
const board_background = "white";
let snake = [];
let dx = 10;
let dy = 0;
let food_x;
let food_y;
let speed;
let bool = false;
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
      return ctx.fillText(`You lose, score of ${score}`, 10, 50);
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
    { x: 40, y: 70 },
    { x: 30, y: 70 },
    { x: 20, y: 70 },
    { x: 10, y: 70 },
    { x: 0, y: 70 },
  ];
  return snake;
}

// Draw one snake part
function drawSnakePart(snakePart) {
  ctx.fillRect(snakePart.x, snakePart.y, 10, 10);
  ctx.fillStyle = "lightblue";
  ctx.strokeRect(snakePart.x, snakePart.y, 10, 10);
}
function moveSnake() {
  const head = { x: snake[0].x + dx, y: snake[0].y + dy };
  snake.unshift(head);
  const has_eaten_food = snake[0].x === food_x && snake[0].y === food_y;
  let score = parseFloat(document.getElementById("score").innerHTML);
  if (has_game_ended()) {
    score = 0;
    document.getElementById("score").innerHTML = score;
  } else {
    if (has_eaten_food) {
      score += 1;
      // Display score on screen
      document.getElementById("score").innerHTML = score;
      // Generate new food location
      gen_food();
    } else {
      // Remove the last part of snake body
      snake.pop();
    }
  }
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
  const hitRightWall = snake[0].x > canvas.width - 10;
  const hitToptWall = snake[0].y < 0;
  const hitBottomWall = snake[0].y > canvas.height - 10;
  return hitLeftWall || hitRightWall || hitToptWall || hitBottomWall;
}

function change_direction(event) {
  const LEFT_KEY = 37;
  const RIGHT_KEY = 39;
  const UP_KEY = 38;
  const DOWN_KEY = 40;

  const keyPressed = event.keyCode;
  const goingUp = dy === -10;
  const goingDown = dy === 10;
  const goingRight = dx === 10;
  const goingLeft = dx === -10;

  if (keyPressed === LEFT_KEY && !goingRight) {
    dx = -10;
    dy = 0;
  }
  if (keyPressed === UP_KEY && !goingDown) {
    dx = 0;
    dy = -10;
  }
  if (keyPressed === RIGHT_KEY && !goingLeft) {
    dx = 10;
    dy = 0;
  }
  if (keyPressed === DOWN_KEY && !goingUp) {
    dx = 0;
    dy = 10;
  }
}

function random_food(min, max) {
  return Math.round((Math.random() * (max - min) + min) / 10) * 10;
}
function gen_food() {
  food_x = random_food(0, canvas.width - 10);
  food_y = random_food(0, canvas.height - 10);
  snake.forEach(function has_snake_eaten_food(part) {
    const has_eaten = part.x == food_x && part.y == food_y;
    if (has_eaten) gen_food();
  });
}
function drawFood() {
  ctx.fillStyle = "lightgreen";
  ctx.strokestyle = "darkgreen";
  ctx.fillRect(food_x, food_y, 10, 10);
  ctx.strokeRect(food_x, food_y, 10, 10);
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

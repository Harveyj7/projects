const btn = document.querySelector("h1");
const canvas = document.querySelector("canvas");
const boxes = document.querySelectorAll('input[type="radio"]');
const button = document.querySelector("button");
const ctx = canvas.getContext("2d");
const board_border = "black";
const board_background = "white";
let score = 0;
let snake = [];
let bool = false;
// prettier-ignore
let food_x, food_y, speed, size, x1, y1,goingDown, goingUp, goingLeft, goingRight ;
if (document.body.clientWidth < 600) {
  size = 12.5;
  canvas.width = (Math.floor(window.innerWidth / size) - 3) * size - 1; //949
  canvas.height = (Math.floor(window.innerHeight / size) - 15) * size - 1; //499
  ctx.font = `${window.innerWidth / 15}px Arial`;
} else if (document.body.clientWidth < 1000) {
  size = 25;
  canvas.width = (Math.floor(window.innerWidth / size) - 3) * size - 1; //674
  canvas.height = (Math.floor(window.innerHeight / size) - 5) * size - 1; //874
  ctx.font = `${window.innerWidth / 20}px Arial`;
} else {
  size = 50;
  canvas.width = (Math.floor(window.innerWidth / size) - 3) * size - 1; //949
  canvas.height = (Math.floor(window.innerHeight / size) - 3) * size - 1; //499
  ctx.font = `${window.innerWidth / 30}px Arial`;
}
let dy = 0;
let dx = size;
gen_food();
coords();
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
console.log(window.innerWidth / 30);
function main() {
  setTimeout(function onTick() {
    clearCanvas();
    drawSnake();
    drawFood();
    moveSnake();
    if (has_game_ended()) {
      coords();
      ctx.fillStyle = "red";
      ctx.fillText(
        `You lose! Score of ${score}`,
        window.innerWidth / 4,
        window.innerHeight / 4
      );
      dy = 0;
      dx = size;
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
function direction(x1, x2, y1, y2) {
  let cx = x2 - x1;
  let cy = y2 - y1;

  const goingUp = dy === -size;
  const goingDown = dy === size;
  const goingRight = dx === size;
  const goingLeft = dx === -size;
  console.log(cx, cy);
  if (cx > Math.abs(cy) && !goingLeft) {
    console.log("right");
    dx = size;
    dy = 0;
  }
  if (cy > Math.abs(cx) && !goingUp) {
    console.log("down");
    dx = 0;
    dy = size;
    // window.onbeforeunload = function () {
    //   return "no";
    // };
  }
  if (-cx > Math.abs(cy) && !goingRight) {
    console.log("left");
    dx = -size;
    dy = 0;
  }
  if (-cy > Math.abs(cx) && !goingDown) {
    console.log("up");
    dx = 0;
    dy = -size;
  }
}

function random_food(min, max) {
  // console.log(Math.round((Math.random() * (max - min) + min) / size) * size);
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
button.addEventListener("click", () => main());
boxes.forEach((box) => box.addEventListener("click", handleCheck));
document.addEventListener("keydown", change_direction);

document.addEventListener("touchstart", (e) => {
  x1 = e.touches[0].pageX;
  y1 = e.touches[0].pageY;
  // console.log(x1, y1);
});
document.addEventListener("touchend", (e) => {
  x2 = e.changedTouches[0].pageX;
  y2 = e.changedTouches[0].pageY;
  // console.log(x2, y2);
  direction(x1, x2, y1, y2);
});


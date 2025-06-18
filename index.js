const triggers = document.querySelectorAll(".ul > li");
const background = document.querySelector(".dropdownBackground");
const text = document.querySelector(".bio");
const arrow = document.querySelector(".arrow");
const nav = document.querySelector("nav");
const items = document.querySelectorAll(".item");
const slider = document.querySelector(".items");
let isDown = false;
let startX;
let scrollLeft;
let mylatesttap;

//Opening and closing nav bar
function handleEnter() {
  this.classList.add("trigger-enter");
  setTimeout(
    () =>
      this.classList.contains("trigger-enter") &&
      this.classList.add("trigger-enter-active"),
    150
  );
  background.classList.add("open");

  const dropdown = this.querySelector(".dropdown");
  const dropdownCoords = dropdown.getBoundingClientRect();
  const navCoords = nav.getBoundingClientRect();

  const coords = {
    height: dropdownCoords.height,
    width: dropdownCoords.width,
    top: dropdownCoords.top - navCoords.top,
    left: dropdownCoords.left - navCoords.left,
  };
  let displace;
  items.forEach((item) => {
    item.style.setProperty("opacity", "0.1");
  });
  slider.style.setProperty("position", "relative");
  background.style.setProperty("width", `${coords.width}px`);
  background.style.setProperty("height", `${coords.height}px`);
  if (
    this.children[0].innerHTML === "About Me" &&
    document.body.offsetWidth < 600
  ) {
    displace = 100;
    arrow.style.setProperty("left", "30px");
  } else {
    displace = 0;
  }
  background.style.setProperty(
    "transform",
    `translate(${coords.left + displace}px, ${coords.top}px)`
  );
  text.style.setProperty("margin-left", `${2 * displace}px`);
}

function handleLeave() {
  this.classList.remove("trigger-enter", "trigger-enter-active");
  background.classList.remove("open");
  text.style.removeProperty("margin-left");
  arrow.style.removeProperty("left");
  slider.style.removeProperty("position");
  items.forEach((item) => {
    item.style.removeProperty("opacity");
  });
}

//Doubletap open links
function doubletap(e) {
  var now = new Date().getTime();
  var timesince = now - mylatesttap;
  if (timesince < 350 && timesince > 0) {
    console.log("yes");
    location = this.children[0].href;
  } else {
    console.log("no");
  }
  mylatesttap = new Date().getTime();
}

// function open() {
//   location = this.children[0].href;
// }
function dontopen(e) {
  e.preventDefault();
}

//Eventlisteners

triggers.forEach((trigger) =>
  trigger.addEventListener("mouseenter", handleEnter)
);
triggers.forEach((trigger) =>
  trigger.addEventListener("mouseleave", handleLeave)
);

slider.addEventListener("mousedown", (e) => {
  isDown = true;
  slider.classList.add("active");
  startX = e.pageX - slider.offsetLeft;
  scrollLeft = slider.scrollLeft;
});

slider.addEventListener("mouseleave", () => {
  isDown = false;
  slider.classList.remove("active");
});

slider.addEventListener("mouseup", () => {
  isDown = false;
  slider.classList.remove("active");
});

slider.addEventListener("mousemove", (e) => {
  if (!isDown) return; // stop the fn from running
  e.preventDefault();
  const x = e.pageX - slider.offsetLeft;
  const walk = (x - startX) * 3;
  slider.scrollLeft = scrollLeft - walk;
});

function hasmoved(e) {
  // console.log(e.pageX, e.pageY);
  let x2;
  let y2;
  console.log(e);
  if (e.type === "mousedown") {
    [x1, y1] = [e.screenX, e.screenY];
    console.log(e.type);
  } else {
    [x2, y2] = [e.screenX, e.screenY];
    console.log(e.type);
  }
  console.log(this);
  if (x1 === x2 && y1 === y2) {
    // console.log(this.children);
    location = this.children[1].children[0].href;
  }
}
items.forEach((item) => item.addEventListener("touchstart", doubletap));
// items.forEach((item) => item.addEventListener("dblclick", open));
items.forEach((item) => item.addEventListener("click", dontopen));
items.forEach((item) => item.addEventListener("mousedown", hasmoved));
items.forEach((item) => item.addEventListener("mouseup", hasmoved));

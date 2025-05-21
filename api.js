let canvas, context, Val_max, Val_min, sections, xScale, yScale;
// Values for the Data Plot, they can also be obtained from a external file

function init(xAxis, yAxis) {
  // set these values for your data
  sections = yAxis.length;
  Val_max = Math.max(...yAxis);
  Val_min = Math.min(...yAxis);
  let stepSize = 10;
  let columnSize = 50;
  let rowSize = 50;

  canvas = document.querySelector("canvas");
  context = canvas.getContext("2d");
  context.fillStyle = "white";
  // context.fillRect(50, 50, canvas.width, canvas.height);
  context.font = "10px Verdana";
  context.fontColor = "black";

  yScale = (canvas.height - columnSize) / (Val_max - Val_min);
  xScale = (canvas.width - rowSize) / sections;

  context.strokeStyle = "rgba(0, 0, 0, 0.2)"; // color of grid lines
  context.beginPath();
  // print Parameters on X axis, and grid lines on the graph
  context.fillText(xAxis[1], x, columnSize);
  context.fillStyle = "black";
  for (i = 1; i <= sections; i++) {
    var x = i * xScale;
    if (screen.width < 600) {
      context.font = "22px Verdana";
    } else if (screen.width < 1000) {
      context.font = "15px Verdana";
    }
    if (i % 60 === 0) {
      // var now = new Date().toJSON().slice(0, 10);
      const date = new Date(xAxis[i]);
      // prettier-ignore
      if (screen.width > 800) {
      months = new Array("January","February","March","April","May","June","July","August","September","October","November","December");
      }else{
      months = new Array("Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec");
      }
      let month = months[date.getMonth()];
      context.fillText(month, x - 15, columnSize - 10);
      context.moveTo(x, columnSize);
      context.lineTo(x, canvas.height);
    }
  }
  // print row header and draw horizontal grid lines
  var count = 0;
  for (scale = Val_max; scale >= Val_min; scale = scale - stepSize) {
    var y = 60 + yScale * count * stepSize;
    if (count % 500 === 0 || count === Math.floor(Val_max / stepSize)) {
      // console.log(100 * Math.round(scale / 100));
      context.fillText(2500 * Math.floor(scale / 2500), 10, y);
      // context.fillStyle = "black";
      context.moveTo(rowSize, y);
      context.lineTo(canvas.width, y);
    }
    count++;
  }
  context.stroke();
  context.translate(rowSize, canvas.height + Val_min * yScale);
  context.scale(1, -1 * yScale);
  context.strokeStyle = "#FF0066";
}

function plotData(dataSet) {
  context.beginPath();
  context.moveTo(0, dataSet[0]);
  for (i = 1; i < sections; i++) {
    context.lineTo(i * xScale, dataSet[i]);
  }
  context.stroke();
}

const globalBtn = document.querySelector(".fetch");
const output = document.querySelector(".data");
const tbody = document.querySelector("tbody");
const table = document.querySelector("table");
let yAxis = [];
let xAxis = [];

function populateTable(d, i) {
  const tRow = document.createElement("tr");
  const td = [document.createElement("td"), document.createElement("td")];
  // const tp = Array(2).fill(document.createElement("td"));
  tbody.appendChild(tRow);
  tRow.appendChild(td[0]);
  tRow.appendChild(td[1]);
  table.classList.add("tb");
  if (i === 0) {
    td[0].classList.add("tablehead");
    td[1].classList.add("tablehead");
    td[0].innerHTML = "Date";
    td[1].innerHTML = "Cases";
  }else if (i < 14) {
    tRow.style.display = "table-row";
    td[0].innerHTML = d.date;
    td[1].innerHTML = d.newCases;
  } else {
    tRow.style.display = "none";
    td[0].innerHTML = d.date;
    td[1].innerHTML = d.newCases;
  } 
}

function populateHorizontalTable(d, i) {
  const bigdiv = document.createElement("div");
  const div = document.createElement("div");
  const table= document.querySelector('.table')
  const div2 = document.createElement("div");
  if (i < 7) {
    div.style.display = "block";
    div2.style.display = "block";
  } else {
    div.style.display = "none";
    div2.style.display = "none";
  }
  div.classList.add("cell");
  bigdiv.classList.add("doublecell");
  table.appendChild(bigdiv);
  bigdiv.appendChild(div);
  div2.classList.add("cell");
  bigdiv.appendChild(div2);
  div.innerHTML = d.date;
  div2.innerHTML = d.newCases;
  
}

function showAll() {
  const cols = document.querySelectorAll("td");
  const rows = document.querySelectorAll("tr");
  if (screen.width < 800) {
    cols.forEach((h) => {
      h.style.display = "table-cell";
    });
  } else {
    rows.forEach((h) => {
      h.style.display = "table-row";
    });
    replaceBtn();
  }
}
function showLess() {
  const rows = document.querySelectorAll("tr");
  const cols = document.querySelectorAll("td");
  if (screen.width < 800) {
    cols.forEach((r, i) => {
      if (i < 14) {
        r.style.display = "table-cell";
      } else {
        r.style.display = "none";
      }
    });
  } else {
    rows.forEach((r, i) => {
      if (i < 14) {
        r.style.display = "table-row";
      } else {
        r.style.display = "none";
      }
    });
  }
  replaceBtn();
}
function replaceBtn() {
  const btn = document.querySelector("button");
  let text;
  const newBtn = document.createElement("button");
  newBtn.classList.add("fetch");
  newBtn.style.margin = "30px auto 10px 0px";
  document.body.insertBefore(newBtn, output);
  if (btn.innerHTML === "show more") {
    text = "show less";
    newBtn.addEventListener("click", showLess);
  } else {
    text = "show more";
    newBtn.addEventListener("click", showAll);
  }
  newBtn.innerHTML = text;
  btn.remove();
}

async function getData() {
  const url = "https://api.coronavirus.data.gov.uk/v1/data?";
  const query = "filters=areaType=nation;areaName=england&";
  const endpoint =
    'structure={"date":"date","newCases":"newCasesByPublishDate"}';

    
    const tr = document.createElement("tr");
    const tr2 = document.createElement("tr");
    
  fetch(url + query + endpoint)
    .then(
      (response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error("Request Failed");
      },
      (networkError) => {
        console.log(networkError.message);
      }
    )
    .then((data) => {
      // const len = data.length - 1;
      data.data.map((d, i) => {
        if (screen.width < 800) {
          populateHorizontalTable(d, i, tr, tr2);
        } else {
          populateTable(d, i);
        }
        xAxis.push(JSON.stringify(d.date));
        yAxis.push(d.newCases);
        return xAxis, yAxis;
      });
      xAxis.reverse(), yAxis.reverse();
      init(xAxis, yAxis);
      plotData(yAxis);
      return data;
    });
  replaceBtn();
}

globalBtn.addEventListener("click", getData);
// globalBtn.addEventListener("click", getchatbot);
let canvas, context, Val_max, Val_min, sections, xScale, yScale;
// Values for the Data Plot, they can also be obtained from a external file
const tbody = document.querySelector("tbody");
const tRow = document.createElement("tr");
const tData = document.createElement("td");
const tData2 = document.createElement("td");
tbody.appendChild(tRow);
tRow.appendChild(tData);
tRow.appendChild(tData2);
tData.innerHTML='hey'
tData2.innerHTML='hey'


function init(xAxis, yAxis) {
  // set these values for your data
  sections = yAxis.length;
  // console.log(Math.max(...yAxis))
  Val_max = Math.max(...yAxis);
  Val_min = Math.min(...yAxis);
  let stepSize = 10;
  let columnSize = 50;
  let rowSize = 50;
  let margin = 10;

  canvas = document.getElementById("canvas");
  context = canvas.getContext("2d");
  context.fillStyle = "#0099ff";
  context.font = "20 pt Verdana";

  yScale = (canvas.height - columnSize - margin) / (Val_max - Val_min);
  xScale = (canvas.width - rowSize) / sections;

  context.strokeStyle = "#009933"; // color of grid lines
  context.beginPath();
  // print Parameters on X axis, and grid lines on the graph
  context.fillText(xAxis[1], x, columnSize - margin);
  for (i = 1; i <= sections; i++) {
    var x = i * xScale;
    if (i % 40 === 0) {
      // console.log(xAxis[i].date.month)
      context.fillText(xAxis[i], x, columnSize - margin);
      context.moveTo(x, columnSize);
      context.lineTo(x, canvas.height - margin);
    }
  }
  // print row header and draw horizontal grid lines
  var count = 0;
  // console.log(Val_max);
  for (scale = Val_max; scale >= Val_min; scale = scale - stepSize) {
    var y = 60 + yScale * count * stepSize;
    if (count % 400 === 0 || count === Math.floor(Val_max / stepSize)) {
      context.fillText(scale, margin, y + margin);
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

const btn = document.querySelector(".fetch");
const output = document.querySelector(".data");
// const tbody = document.querySelector("tbody");
let yAxis = [];
let xAxis = [];

function populateTable(d, i) {
  const tRow = document.createElement("tr");
  if (i < 10) {
    tRow.style.display = "block";
  } else {
    tRow.style.display = "none";
    // tRow.classList.add("noDisp");
  }
  const tData = document.createElement("td");
  const tData2 = document.createElement("td");
  tbody.appendChild(tRow);
  tRow.appendChild(tData);
  tRow.appendChild(tData2);
  tData.innerHTML = d.date;
  tData2.innerHTML = d.newCases;
}
function showAll() {
  const rows = document.querySelectorAll("tr");
  rows.forEach((h) => {
    // console.log(h);
    h.style.display='block';
    // h.classList.add("disp");
  });
  var showAllBtn = document.querySelector("button");
  showAllBtn.remove();
  const btn3 = document.createElement("button");
    document.body.insertBefore(btn3, output);
    btn3.innerHTML = "show less";
    btn3.addEventListener("click", showLess);
}

function showLess(){
  const rows = document.querySelectorAll("tr");
  rows.forEach((h) => {
    h.style.display='none';
  })
}

const getData = async () => {
  const url = "https://api.coronavirus.data.gov.uk/v1/data?";
  const query = "filters=areaType=nation;areaName=england&";
  const endpoint =
    'structure={"date":"date","newCases":"newCasesByPublishDate"}';
  
  var getBtn = document.querySelector(".fetch");
  getBtn.remove();

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
      data.data.map((d, i) => {
        populateTable(d, i);
        xAxis.push(JSON.stringify(d.date));
        yAxis.push(d.newCases);
        // return xAxis, yAxis;
        return xAxis, yAxis;
      });
      xAxis.reverse(), yAxis.reverse();
      // console.log(xAxis.length)
      init(xAxis, yAxis);
      plotData(yAxis);
      return data;
    })
    .then((d) => {
      console.log(d);
    });

    const btn2 = document.createElement("button");
    document.body.insertBefore(btn2, output);
    btn2.innerHTML = "see full data";
    btn2.addEventListener("click", showAll);

};

btn.addEventListener("click", getData);

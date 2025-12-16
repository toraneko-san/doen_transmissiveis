const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const bgImg = new Image();
bgImg.src = "./assets/background.png";
const locationsImg = new Image();
locationsImg.src = "./assets/locations.png";
const treesImg = new Image();
treesImg.src = "./assets/trees.png";

let isGameStart = false;
let lastFrameTime = performance.now();

let selectedLocationId, selectedDiseaseId;
const cases = [];
let newCaseCount = 0;

function animate() {
  const deltaTime = getDeltaTime();

  drawBackground();
  // drawCasesPath();

  for (let i = 0; i < people.length; i++) {
    const person = people[i];

    if (isGamePause == true) {
      drawPerson(person);
      continue;
    }

    if (person.isInLocation == true) continue;

    if (person.progress >= 1) {
      savePath(person);

      checkLocation(person);
      checkFocusLocation(person);
      checkSymptoms(person);

      reduceThreshold(person);

      findNextTile(person);
    }

    updateProgress(person, deltaTime);
    drawPerson(person);
  }

  drawForeground();
  drawCasesPath();

  requestAnimationFrame(animate);
}

function drawBackground() {
  const mapWidth = Math.ceil(nCols / 2) * tileWidth;
  const mapHeight = nRows * tileHeight + tileHeight / 2;
  ctx.clearRect(0, 0, mapWidth, mapHeight);

  ctx.drawImage(bgImg, offset.x, offset.y);

  // for (let row = 0; row < nRows; row++) {
  //   for (let col = 0; col < nCols; col++) {
  //     if (map[row][col] == 0) continue;
  //     const x = tileWidth * (col / 2);
  //     const y =
  //       col % 2 == 0 ? tileHeight * row : tileHeight * row + tileHeight / 2;

  //     ctx.beginPath();

  //     if (col % 2 == 0) {
  //       if (map[row - 1]?.[col - 1] != 1) {
  //         ctx.moveTo(x + offset.x, y + tileHeight / 2 + offset.y);
  //         ctx.lineTo(x + offset.x + tileWidth / 2, y + offset.y);
  //       }

  //       if (map[row - 1]?.[col + 1] != 1) {
  //         ctx.moveTo(x + offset.x + tileWidth / 2, y + offset.y);
  //         ctx.lineTo(x + offset.x + tileWidth, y + tileHeight / 2 + offset.y);
  //       }

  //       if (map[row][col + 1] != 1) {
  //         ctx.moveTo(x + offset.x + tileWidth, y + tileHeight / 2 + offset.y);
  //         ctx.lineTo(x + offset.x + tileWidth / 2, y + tileHeight + offset.y);
  //       }

  //       if (map[row][col - 1] != 1) {
  //         ctx.moveTo(x + offset.x + tileWidth / 2, y + tileHeight + offset.y);
  //         ctx.lineTo(x + offset.x, y + tileHeight / 2 + offset.y);
  //       }
  //     } else {
  //       if (map[row][col - 1] != 1) {
  //         ctx.moveTo(x + offset.x, y + tileHeight / 2 + offset.y);
  //         ctx.lineTo(x + offset.x + tileWidth / 2, y + offset.y);
  //       }

  //       if (map[row][col + 1] != 1) {
  //         ctx.moveTo(x + offset.x + tileWidth / 2, y + offset.y);
  //         ctx.lineTo(x + offset.x + tileWidth, y + tileHeight / 2 + offset.y);
  //       }

  //       if (map[row + 1]?.[col + 1] != 1) {
  //         ctx.moveTo(x + offset.x + tileWidth, y + tileHeight / 2 + offset.y);
  //         ctx.lineTo(x + offset.x + tileWidth / 2, y + tileHeight + offset.y);
  //       }

  //       if (map[row + 1]?.[col - 1] != 1) {
  //         ctx.moveTo(x + offset.x + tileWidth / 2, y + tileHeight + offset.y);
  //         ctx.lineTo(x + offset.x, y + tileHeight / 2 + offset.y);
  //       }
  //     }

  //     ctx.lineWidth = 10;
  //     ctx.strokeStyle = "#0ff";
  //     ctx.stroke();

  //     // ctx.fillStyle = "#000";
  //     // ctx.textAlign = "center";
  //     // ctx.fillText(
  //     //   `${row}, ${col}`,
  //     //   x + tileWidth / 2 + offset.x,
  //     //   y + tileHeight / 2 + offset.y
  //     // );
  //   }
  // }

  // for (let row = 0; row < nRows; row++) {
  //   for (let col = 0; col < nCols; col++) {
  //     if (locationsMap[row][col] == null) continue;
  //     const x = tileWidth * (col / 2);
  //     const y =
  //       col % 2 == 0 ? tileHeight * row : tileHeight * row + tileHeight / 2;

  //     ctx.beginPath();

  //     ctx.moveTo(x + offset.x, y + tileHeight / 2 + offset.y);
  //     ctx.lineTo(x + offset.x + tileWidth / 2, y + offset.y);
  //     ctx.lineTo(x + offset.x + tileWidth, y + tileHeight / 2 + offset.y);
  //     ctx.lineTo(x + offset.x + tileWidth / 2, y + tileHeight + offset.y);
  //     ctx.lineTo(x + offset.x, y + tileHeight / 2 + offset.y);

  //     ctx.lineWidth = 5;
  //     ctx.strokeStyle = "#f00";
  //     ctx.stroke();

  //     // if (locationsMap[row][col] == selectedLocationId) ctx.fillStyle = "#f00";
  //     // else ctx.fillStyle = "#000";
  //     ctx.fillStyle = "#f00";
  //     ctx.fill();

  //     ctx.fillStyle = "#fff";
  //     ctx.font = "700 40px Arial";
  //     ctx.textAlign = "center";
  //     ctx.fillText(
  //       locationsMap[row][col],
  //       x + tileWidth / 2 + offset.x,
  //       y + tileHeight / 2 + offset.y
  //     );
  //   }
  // }
}

function drawForeground() {
  ctx.drawImage(treesImg, offset.x, offset.y);
  ctx.drawImage(locationsImg, offset.x, offset.y);
}

function drawCasesPath() {
  let selectedCount = 0;

  for (let i = 0; i < cases.length; i++) {
    const { isSelected, path, color } = cases[i];
    if (isSelected == false) continue;

    ctx.beginPath();

    for (let j = 0; j < path.length; j++) {
      const { x, y } = getTopXY(path[j]);

      if (j == 0)
        ctx.moveTo(
          x + offset.x + tileWidth / 2,
          y + offset.y + (tileHeight / 4) * ((selectedCount % 3) + 1)
        );
      else
        ctx.lineTo(
          x + offset.x + tileWidth / 2,
          y + offset.y + (tileHeight / 4) * ((selectedCount % 3) + 1)
        );
    }

    ctx.lineWidth = 10;
    ctx.strokeStyle = color;
    ctx.stroke();

    selectedCount += 1;
  }

  selectedCount = 0;
  for (let i = 0; i < cases.length; i++) {
    const { isSelected, path, color } = cases[i];
    if (isSelected == false) continue;

    
    for (let j = 0; j < path.length; j++) {
      const { x, y } = getTopXY(path[j]);
      const { row, col } = path[j];
      
      ctx.beginPath();
      if (locationsMap[row][col] !== null) {
        ctx.arc(
          x + offset.x + tileWidth / 2,
          y + offset.y + (tileHeight / 4) * ((selectedCount % 3) + 1),
          15,
          0,
          2 * Math.PI
        );
        ctx.fillStyle = color;
        ctx.fill();
      }
    }

    selectedCount += 1;
  }
}

function drawPerson(person) {
  const { currentTile, nextTile, progress } = person;

  const current = getCenterXY(currentTile);
  const next = getCenterXY(nextTile);

  const diffX = next.x - current.x;
  const diffY = next.y - current.y;

  const screenX = current.x + diffX * progress;
  const screenY = current.y + diffY * progress;

  ctx.beginPath();
  ctx.arc(screenX + offset.x, screenY + offset.y, 15, 0, 2 * Math.PI);

  if (person.isInfected != true) ctx.fillStyle = "#000";
  // if (person.isInfected == true) ctx.fillStyle = "#0f0";
  if (person.hasSymptoms == true) ctx.fillStyle = "#f00";
  ctx.fill();
}

function updateProgress(person, deltaTime) {
  if (person.progress > 1) person.progress = 0;
  person.progress += person.speed * deltaTime;
}

function checkLocation(person) {
  const { nextTile } = person;
  const { row, col } = nextTile;

  if (locationsMap[row][col] == null) return;

  person.speed = Math.random() * 1 + 0.75;
  person.isInLocation = true;
  setTimeout(() => (person.isInLocation = false), 2000);
}

function savePath(person) {
  if (person.hasSymptoms == true) return;
  if (isGameStart == false)
    person.path = person.path.filter((_, i) => person.path.length - i < 20);
  person.path.push(person.currentTile);
}

// reduce threshold every time person visits new location after focus location
function reduceThreshold(person) {
  if (person.isInfected == false) return;
  if (person.hasSymptoms == true) return;
  const { row, col } = person.currentTile;
  const locationId = locationsMap[row][col];

  if (locationId == null || locationId == selectedLocationId) return;
  if (person.visitedLocations.includes(locationId)) return;

  person.visitedLocations.push(locationId);
  person.onsetThreshold -= 0.2;
}

function checkFocusLocation(person) {
  if (isGameStart == false) return;
  if (person.isInfected == true) return;
  if (person.hasSymptoms == true) return;

  const { nextTile } = person;
  const { row, col } = nextTile;

  const locationId = locationsMap[row][col];

  if (locationId != selectedLocationId) return;

  person.isInfected = true;
}

function checkSymptoms(person) {
  if (person.isInfected == false) return;
  if (person.hasSymptoms == true) return;

  const { nextTile, onsetThreshold } = person;
  const { row, col } = nextTile;
  const locationId = locationsMap[row][col];

  if (locationId == null) return;
  if (locationId == selectedLocationId) return;
  if (person.visitedLocations.includes(locationId)) return;

  const risk = Math.random();
  // console.log("-------");
  // console.log(risk);
  // console.log(person.onsetThreshold);

  if (risk > onsetThreshold) {
    person.path.push(person.nextTile);
    person.hasSymptoms = true;
    person.isInfected = false;
    savePath(person);
    notifyCase(person);
  }
}

function notifyCase(person) {
  const { path, name, age } = person;

  const possibleSymptoms = [...diseases[selectedDiseaseId].symptoms];
  const symptoms = [];
  const symptomsCount = Math.floor(Math.random() * 2 + 2);

  do {
    const randomSymptonId = Math.floor(
      Math.random() * (possibleSymptoms.length - 0.1) + 0.09
    );
    const randomSympton = possibleSymptoms[randomSymptonId];
    if (randomSympton == null) continue;

    symptoms.push(randomSympton);
    possibleSymptoms[randomSymptonId] = null;
  } while (symptoms.length !== symptomsCount);

  cases.push({
    name,
    age,
    symptoms,
    isSelected: false,
    path: [...path],
    color: getRandomColor(),
  });

  newCaseCount += 1;
  showNewCaseCount();
  if (!casesMenu.classList.contains("hide")) showCasesList();
}

function findNextTile(person) {
  const { currentTile, nextTile } = person;
  const { row, col } = nextTile;
  let possibleNextTiles = [];

  if (col % 2 == 0) {
    if (map[row - 1]?.[col - 1] == 1)
      possibleNextTiles.push({ row: row - 1, col: col - 1 });
    if (map[row - 1]?.[col + 1] == 1)
      possibleNextTiles.push({ row: row - 1, col: col + 1 });
    if (map[row]?.[col - 1] == 1) possibleNextTiles.push({ row, col: col - 1 });
    if (map[row]?.[col + 1] == 1) possibleNextTiles.push({ row, col: col + 1 });
  } else {
    if (map[row]?.[col - 1] == 1)
      possibleNextTiles.push({ row: row, col: col - 1 });
    if (map[row]?.[col + 1] == 1)
      possibleNextTiles.push({ row: row, col: col + 1 });
    if (map[row + 1]?.[col - 1] == 1)
      possibleNextTiles.push({ row: row + 1, col: col - 1 });
    if (map[row + 1]?.[col + 1] == 1)
      possibleNextTiles.push({ row: row + 1, col: col + 1 });
  }

  if (possibleNextTiles.length > 1) {
    possibleNextTiles = possibleNextTiles.filter(
      (tile) => !(tile.row == currentTile.row && tile.col == currentTile.col)
    );
  }

  const randomIndex = Math.floor(
    Math.random() * (possibleNextTiles.length - 0.1) + 0.09
  );

  person.currentTile = nextTile;
  person.nextTile = possibleNextTiles[randomIndex];
}

//////////////////////////////////////////////////////
function getDeltaTime() {
  const nowTime = performance.now();
  const deltaTime = (nowTime - lastFrameTime) / 1000; // converte ms → s
  lastFrameTime = nowTime;

  return deltaTime;
}

function getTopXY(tile) {
  const { row, col } = tile;

  const x = col * (tileWidth / 2);
  const y = col % 2 == 0 ? row * tileHeight : row * tileHeight + tileHeight / 2;

  return { x, y };
}

function getCenterXY(tile) {
  const { row, col } = tile;

  const x = (col + 1) * (tileWidth / 2);
  const y =
    col % 2 == 0 ? row * tileHeight + tileHeight / 2 : (row + 1) * tileHeight;

  return { x, y };
}

function getRandomColor() {
  const r = Math.floor(Math.random() * (200 - 1) + 0.5);
  const g = Math.floor(Math.random() * (200 - 1) + 0.5);
  const b = Math.floor(Math.random() * (200 - 1) + 0.5);

  return `rgb(${r},${g},${b})`;
}

//////////////////////////////////////////////////////

//////////////////////////////////////////////////////
function resize() {
  // size canvas with CSS values
  canvas.width = Math.min(canvas.scrollWidth, bgImg.width);
  canvas.height = Math.min(canvas.scrollHeight, bgImg.height);

  setMapLimit();
  moveCasesMenu();
  moveManualMenu();
  moveAnswerMenu();
}

function prepareGame() {
  resize();

  for (let i = 0; i < people.length; i++) {
    const person = {};
    let startTile;

    do {
      let startRow = Math.floor(Math.random() * (nRows - 0.1) + 0.09);
      let startCol = Math.floor(Math.random() * (nCols - 0.1) + 0.09);

      if (map[startRow][startCol] == 1)
        startTile = { row: startRow, col: startCol };
    } while (startTile == undefined);

    person.currentTile = startTile;
    person.nextTile = startTile;
    person.progress = 1;
    person.speed = Math.random() * 1 + 0.75;
    person.isInLocation = false;
    person.isInfected = false;
    person.onsetThreshold = 1;
    person.hasSymptoms = false;
    person.path = [];
    person.visitedLocations = [];

    do {
      savePath(person);
      findNextTile(person);
    } while (person.path.length < 20);

    people[i] = person;
  }

  selectedLocationId = Math.floor(
    Math.random() * (locations.length - 0.1) + 0.09
  );
  randomDiseasePos = Math.floor(
    Math.random() * (locations[selectedLocationId].diseases.length - 0.1) + 0.09
  );
  selectedDiseaseId = locations[selectedLocationId].diseases[randomDiseasePos];

  console.log("local", selectedLocationId);
  console.log("doenca", diseases[selectedDiseaseId].name);

  animate();
}

window.addEventListener("resize", resize);
window.addEventListener("load", prepareGame);
//////////////////////////////////////////////////////

//////////////////////////////////////////////////////
const startButton = document.querySelector(".start-btn");
const mainMenu = document.querySelector(".main-menu");
const playerMenu = document.querySelector(".player-menu");
const pauseBtn = document.querySelector(".pause-btn");
const casesBtn = document.querySelector(".cases-btn");
const manualBtn = document.querySelector(".manual-btn");
const answerBtn = document.querySelector(".answer-btn");
const settingsBtn = document.querySelector(".settings-btn");

function start() {
  mainMenu.classList.add("hide");
  playerMenu.classList.remove("hide");
  pauseBtn.addEventListener("click", togglePause);
  casesBtn.addEventListener("click", toggleCases);
  manualBtn.addEventListener("click", toggleManual);
  answerBtn.addEventListener("click", toggleAnswer);
  settingsBtn.addEventListener("click", toggleSettings);

  isGameStart = true;
}

startButton.addEventListener("click", start);

//////////////////////////////////////////////////////
const casesMenu = document.querySelector(".cases-menu");
const manualMenu = document.querySelector(".manual-menu");
const answerMenu = document.querySelector(".answer-menu");

canvas.addEventListener("mousedown", (event) => {
  const { clientX, clientY } = event;
  mouseStartPos.x = clientX;
  mouseStartPos.y = clientY;

  isDragginMap = true;
  canvas.classList.add("grabbing");
});

window.addEventListener("mouseup", () => {
  // console.log(map)
  isDragginMap = false;
  isDragginPlayerMenu = false;
  canvas.classList.remove("grabbing");
});

function setMapLimit() {
  if (offset.x > 0) offset.x = 0;
  if (offset.x < -(Math.ceil(nCols / 2) * tileWidth) + canvas.width)
    offset.x = -(Math.ceil(nCols / 2) * tileWidth) + canvas.width;
  if (offset.y > 0) offset.y = 0;
  if (offset.y < -(nRows * tileHeight + tileHeight / 2) + canvas.height)
    offset.y = -(nRows * tileHeight + tileHeight / 2) + canvas.height;
}

canvas.addEventListener("mousemove", (event) => {
  if (isDragginMap == false) return;

  const { clientX, clientY } = event;
  offset.x = offset.x + (clientX - mouseStartPos.x);
  offset.y = offset.y + (clientY - mouseStartPos.y);

  setMapLimit();

  mouseStartPos.x = clientX;
  mouseStartPos.y = clientY;
});

//////////////////////////////////////////////////////
// canvas.addEventListener("click", (event) => {
//   const mouseX = event.offsetX;
//   const mouseY = event.offsetY;

//   // decide which diagonal / or \
//   const tempX = Math.floor((mouseX - offset.x) / (tileWidth / 2));
//   const tempY = Math.floor((mouseY - offset.y) / (tileHeight / 2));

//   let x1, y1, x2, y2;
//   if ((tempX + tempY) % 2 == 0) {
//     console.log("/");
//     x1 = tempX * (tileWidth / 2);
//     y1 = tempY * (tileHeight / 2) + tileHeight / 2;
//     x2 = tempX * (tileWidth / 2) + tileWidth / 2;
//     y2 = tempY * (tileHeight / 2);
//   } else {
//     console.log("\\");
//     x1 = tempX * (tileWidth / 2);
//     y1 = tempY * (tileHeight / 2);
//     x2 = tempX * (tileWidth / 2) + tileWidth / 2;
//     y2 = tempY * (tileHeight / 2) + tileHeight / 2;
//   }

//   const distance =
//     (mouseX - offset.x - x1) * (y2 - y1) - (mouseY - offset.y - y1) * (x2 - x1);

//   let row, col;
//   if (tempY % 2 == 0)
//     row = distance > 0 ? Math.floor(tempY / 2) - 1 : Math.floor(tempY / 2);
//   else row = Math.floor(tempY / 2);

//   if ((tempX + tempY) % 2 == 0) col = distance > 0 ? tempX - 1 : tempX;
//   else col = distance > 0 ? tempX : tempX - 1;

//   map[row][col] = map[row][col] == 0 ? 1 : 0;

//   console.log(map);
// });

// canvas.addEventListener("click", (event) => {
//   const mouseX = event.offsetX;
//   const mouseY = event.offsetY;

//   // decide which diagonal / or \
//   const tempX = Math.floor((mouseX - offset.x) / (tileWidth / 2));
//   const tempY = Math.floor((mouseY - offset.y) / (tileHeight / 2));

//   let x1, y1, x2, y2;
//   if ((tempX + tempY) % 2 == 0) {
//     console.log("/");
//     x1 = tempX * (tileWidth / 2);
//     y1 = tempY * (tileHeight / 2) + tileHeight / 2;
//     x2 = tempX * (tileWidth / 2) + tileWidth / 2;
//     y2 = tempY * (tileHeight / 2);
//   } else {
//     console.log("\\");
//     x1 = tempX * (tileWidth / 2);
//     y1 = tempY * (tileHeight / 2);
//     x2 = tempX * (tileWidth / 2) + tileWidth / 2;
//     y2 = tempY * (tileHeight / 2) + tileHeight / 2;
//   }

//   const distance =
//     (mouseX - offset.x - x1) * (y2 - y1) - (mouseY - offset.y - y1) * (x2 - x1);

//   let row, col;
//   if (tempY % 2 == 0)
//     row = distance > 0 ? Math.floor(tempY / 2) - 1 : Math.floor(tempY / 2);
//   else row = Math.floor(tempY / 2);

//   if ((tempX + tempY) % 2 == 0) col = distance > 0 ? tempX - 1 : tempX;
//   else col = distance > 0 ? tempX : tempX - 1;

//   const locationId = prompt("Location Id: ");
//   console.log(locationId);
//   locationsMap[row][col] = locationId !== null ? Number(locationId) : null;
//   map[row][col] = map[row][col] == 0 || locationsMap[row][col] ? 1 : 0;

//   console.log(map);
//   console.log(locationsMap);
// });

//////////////////////////////////////////////////////

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const mapImg = new Image();
mapImg.src = "./assets/map.jpeg";

let isGameStart = false; // (to do: false)
let lastFrameTime = performance.now();

let selectedLocationId, selectedDiseaseId;
const cases = [];

function animate() {
  const deltaTime = getDeltaTime();

  drawBackground();
  drawCasesPath();

  for (let i = 0; i < people.length; i++) {
    const person = people[i];

    if (person.isInLocation == true) continue;

    if (person.progress >= 1) {
      checkLocation(person);
      checkFocusLocation(person);

      checkSymptons(person);

      savePath(person);
      saveVisitedLocations(person);
      findNextTile(person);
    }

    updateProgress(person, deltaTime);
    drawPerson(person);
  }

  // draw locations (to do)
  requestAnimationFrame(animate);
}

function drawBackground() {
  const mapWidth = Math.ceil(nCols / 2) * tileWidth;
  const mapHeight = nRows * tileHeight + tileHeight / 2;
  ctx.clearRect(0, 0, mapWidth, mapHeight);

  ctx.drawImage(mapImg, offset.x, offset.y);

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

  //     ctx.lineWidth = 5;
  //     ctx.strokeStyle = "#000";
  //     ctx.stroke();

  //     ctx.fillStyle = "#000";
  //     ctx.textAlign = "center";
  //     ctx.fillText(
  //       `${row}, ${col}`,
  //       x + tileWidth / 2 + offset.x,
  //       y + tileHeight / 2 + offset.y
  //     );
  //   }
  // }

  for (let row = 0; row < nRows; row++) {
    for (let col = 0; col < nCols; col++) {
      if (locationsMap[row][col] == null) continue;
      const x = tileWidth * (col / 2);
      const y =
        col % 2 == 0 ? tileHeight * row : tileHeight * row + tileHeight / 2;

      ctx.beginPath();

      ctx.moveTo(x + offset.x, y + tileHeight / 2 + offset.y);
      ctx.lineTo(x + offset.x + tileWidth / 2, y + offset.y);
      ctx.lineTo(x + offset.x + tileWidth, y + tileHeight / 2 + offset.y);
      ctx.lineTo(x + offset.x + tileWidth / 2, y + tileHeight + offset.y);
      ctx.lineTo(x + offset.x, y + tileHeight / 2 + offset.y);

      ctx.lineWidth = 5;
      ctx.strokeStyle = "#f00";
      ctx.stroke();

      // if (locationsMap[row][col] == selectedLocationId) ctx.fillStyle = "#f00";
      // else ctx.fillStyle = "#000";

      ctx.textAlign = "center";
      ctx.fillText(
        locationsMap[row][col],
        x + tileWidth / 2 + offset.x,
        y + tileHeight / 2 + offset.y
      );
    }
  }
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

    ctx.strokeStyle = color;
    ctx.stroke();

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
  if (person.hasSymptons == true) ctx.fillStyle = "#f00";
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
  if (person.hasSymptons == true) return;
  if (isGameStart == false)
    person.path = person.path.filter((_, i) => person.path.length - i < 30);
  person.path.push(person.currentTile);
}

function saveVisitedLocations(person) {
  if (person.isInfected == false) return;
  if (person.hasSymptons == true) return;
  const { row, col } = person.currentTile;
  const locationId = locationsMap[row][col];

  if (locationId == null || locationId == selectedLocationId) return;
  if (person.visitedLocations.includes(locationId)) return;
  person.visitedLocations.push(locationId);
}

function checkFocusLocation(person) {
  if (isGameStart == false) return;
  if (person.isInfected == true) return;
  if (person.hasSymptons == true) return;

  const { nextTile } = person;
  const { row, col } = nextTile;

  const locationId = locationsMap[row][col];

  if (locationId != selectedLocationId) return;

  person.isInfected = true;
}

function checkSymptons(person) {
  if (person.isInfected == false) return;
  if (person.hasSymptons == true) return;

  const { nextTile, onsetThreshold } = person;
  const { row, col } = nextTile;
  const locationId = locationsMap[row][col];

  if (locationId == null) return;
  if (person.visitedLocations.includes(selectedLocationId)) return;

  const risk = Math.random();
  // console.log("-------");
  // console.log(risk);
  // console.log(person.onsetThreshold);

  if (risk > onsetThreshold) {
    person.hasSymptons = true;
    person.isInfected = false;
    notifyCase(person);
    // console.log(person.path);
    // setTimeout(() => notifyCase(person), Math.random() * 5000);
  }

  person.onsetThreshold -= 0.2;
}

function notifyCase(person) {
  const { path } = person;

  cases.push({
    path: [...path],
    isSelected: false, // (to do) false
    color: getRandomColor(),
  });
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

  return `rgb(${r},${g},${b}, 0.5)`;
}

//////////////////////////////////////////////////////

//////////////////////////////////////////////////////
canvas.addEventListener("mousedown", (event) => {
  const { clientX, clientY } = event;
  mouseStartPos.x = clientX;
  mouseStartPos.y = clientY;
  isDraggin = true;
});

window.addEventListener("mouseup", () => {
  // console.log(map)
  isDraggin = false;
});

canvas.addEventListener("mousemove", (event) => {
  if (isDraggin == false) return;

  const { clientX, clientY } = event;
  offset.x = offset.x + (clientX - mouseStartPos.x);
  offset.y = offset.y + (clientY - mouseStartPos.y);

  if (offset.x > 0) offset.x = 0;
  if (offset.x < -(Math.ceil(nCols / 2) * tileWidth) + canvas.width)
    offset.x = -(Math.ceil(nCols / 2) * tileWidth) + canvas.width;
  if (offset.y > 0) offset.y = 0;
  if (offset.y < -(nRows * tileHeight + tileHeight / 2) + canvas.height)
    offset.y = -(nRows * tileHeight + tileHeight / 2) + canvas.height;

  mouseStartPos.x = clientX;
  mouseStartPos.y = clientY;
});
//////////////////////////////////////////////////////

//////////////////////////////////////////////////////
function resizeCanvas() {
  // size canvas with CSS values
  canvas.width = Math.min(canvas.scrollWidth, mapImg.width);
  canvas.height = Math.min(canvas.scrollHeight, mapImg.height);

  if (offset.x > 0) offset.x = 0;
  if (offset.x < -(Math.ceil(nCols / 2) * tileWidth) + canvas.width)
    offset.x = -(Math.ceil(nCols / 2) * tileWidth) + canvas.width;
  if (offset.y > 0) offset.y = 0;
  if (offset.y < -(nRows * tileHeight + tileHeight / 2) + canvas.height)
    offset.y = -(nRows * tileHeight + tileHeight / 2) + canvas.height;
}

function prepareGame() {
  resizeCanvas();

  for (let i = 0; i < people.length; i++) {
    const person = people[i];
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
    person.hasSymptons = false;
    person.path = [];
    person.visitedLocations = [];
  }

  selectedLocationId = Math.floor(
    Math.random() * (locations.length - 0.1) + 0.09
  );
  selectedDiseaseId = Math.floor(
    Math.random() * (locations[selectedLocationId].diseases.length - 0.1) + 0.09
  );

  console.log(selectedLocationId);
  animate();
}

window.addEventListener("resize", resizeCanvas);
window.addEventListener("load", prepareGame);
//////////////////////////////////////////////////////

//////////////////////////////////////////////////////
const startButton = document.querySelector(".start-btn");
const mainMenu = document.querySelector(".main-menu");

function start() {
  mainMenu.classList.add("hide");
  setTimeout(() => (isGameStart = true), 2500);
}

startButton.addEventListener("click", start);

//////////////////////////////////////////////////////

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

//   console.log(map)
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

//   const locationId = Number(prompt("Location Id: "));
//   locationsMap[row][col] = locationId ? locationId : null;

//   console.log(locationsMap);
// });

window.addEventListener("dblclick", () => {
  const caseId = Number(prompt("Case Id:"));
  cases[caseId].isSelected = !cases[caseId].isSelected;
});

//////////////////////////////////////////////////////

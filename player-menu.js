let isGamePause = false;

const playerMenuPos = {
  cases: {
    x: window.innerWidth * 0.25,
    y: window.innerHeight * 0.05,
  },
  manual: {
    x: window.innerWidth * 0.17,
    y: window.innerHeight * 0.05,
  },
  answer: {
    x: window.innerWidth * 0.25,
    y: window.innerHeight * 0.05,
  },
};

//////////////////////////////////////////////////////
function togglePause() {
  const icon = document.querySelector(".pause-btn img");

  if (isGamePause == true) icon.src = "assets/icons/pause.png";
  else icon.src = "assets/icons/play.png";

  isGamePause = !isGamePause;
}
//////////////////////////////////////////////////////
function showNewCaseCount() {
  const newCaseCounter = document.querySelector(".new-case-counter");
  if (newCaseCount == 0) {
    newCaseCounter.classList.add("hide");
    return;
  }

  newCaseCounter.classList.remove("hide");
  newCaseCounter.innerHTML = newCaseCount;
}

function toggleCases() {
  const icon = document.querySelector(".cases-btn img");

  if (casesMenu.classList.contains("hide")) {
    casesMenu.classList.remove("hide");
    icon.src = "assets/icons/cases-open.png";

    moveCasesMenu();
    setMenuLayer("cases");
  } else {
    casesMenu.classList.add("hide");
    icon.src = "assets/icons/cases-close.png";
  }

  showCasesList();
}

function showCasesList() {
  newCaseCount = 0;
  showNewCaseCount();

  const casesList = document.querySelector(".cases-list");
  casesList.innerHTML = "";

  for (let i = 0; i < cases.length; i++) {
    const { name, isSelected } = cases[i];

    casesList.innerHTML += `
        <div class="">${name}<div>
        <div class="" onClick="togglePath(cases[i])">${name}<div>
        <div class="" onClick="showCaseDetail(cases[i])">${name}<div>
    `;
  }
  //
}

function togglePath(diseaseCase) {
  showCasesList();
  alert("sss");
}

function showCaseDetail(diseaseCase) {
  const caseDetail = document.querySelector(".case-detail");
  caseDetail.innerHTML = `
    <div></div>
  `;
}
//////////////////////////////////////////////////////
function toggleManual() {
  const icon = document.querySelector(".manual-btn img");

  if (manualMenu.classList.contains("hide")) {
    manualMenu.classList.remove("hide");
    icon.src = "assets/icons/manual-open.png";

    moveManualMenu();
    setMenuLayer("manual");
  } else {
    manualMenu.classList.add("hide");
    icon.src = "assets/icons/manual-close.png";
  }
}

//////////////////////////////////////////////////////
function toggleAnswer() {
  const answerMenu = document.querySelector(".answer-menu");
  const icon = document.querySelector(".answer-btn img");

  if (answerMenu.classList.contains("hide")) {
    answerMenu.classList.remove("hide");
    icon.src = "assets/icons/answer-open.png";

    moveAnswerMenu();
    setMenuLayer("answer");
    renderAnswer();
  } else {
    answerMenu.classList.add("hide");
    icon.src = "assets/icons/answer-close.png";
  }
}
//////////////////////////////////////////////////////
function toggleSettings() {
  //
}

//////////////////////////////////////////////////////
function moveCasesMenu() {
  casesMenu.classList.add("grabbing");
  setPlayerMenuLimit("cases", casesMenu);

  casesMenu.style.top = `${playerMenuPos.cases.y}px`;
  casesMenu.style.left = `${playerMenuPos.cases.x}px`;
}

function moveManualMenu() {
  manualMenu.classList.add("grabbing");
  setPlayerMenuLimit("manual", manualMenu);

  manualMenu.style.top = `${playerMenuPos.manual.y}px`;
  manualMenu.style.left = `${playerMenuPos.manual.x}px`;
}

function moveAnswerMenu() {
  answerMenu.classList.add("grabbing");
  setPlayerMenuLimit("answer", answerMenu);

  answerMenu.style.top = `${playerMenuPos.answer.y}px`;
  answerMenu.style.left = `${playerMenuPos.answer.x}px`;
}

function setPlayerMenuLimit(menuType, menu) {
  const menuPos = playerMenuPos[menuType];

  if (menuPos.x < -menu.offsetWidth + 0.1 * window.innerWidth)
    menuPos.x = -menu.offsetWidth + 0.1 * window.innerWidth;
  if (menuPos.x > 0.9 * window.innerWidth) menuPos.x = 0.9 * window.innerWidth;
  if (menuPos.y < -menu.offsetHeight + 0.05 * window.innerHeight)
    menuPos.y = -menu.offsetHeight + 0.05 * window.innerHeight;
  if (menuPos.y > 0.95 * window.innerHeight)
    menuPos.y = 0.95 * window.innerHeight;
}

let menuLayer = [];

function setMenuLayer(menuType) {
  if (menuLayer.length >= 3)
    menuLayer = menuLayer.filter((layer) => !(layer == menuType));
  menuLayer.push(menuType);

  menuLayer.forEach((layer, index) => {
    const menu = document.querySelector(`.${layer}-menu`);
    menu.style.zIndex = index;
  });
}

function startDragPlayerMenu(event) {
  const { clientX, clientY } = event;
  mouseStartPos.x = clientX;
  mouseStartPos.y = clientY;
  isDragginPlayerMenu = true;
}

function dragPlayerMenu(event, menuType) {
  if (isDragginPlayerMenu == false) return;
  setMenuLayer(menuType);

  const { clientX, clientY } = event;

  const menuPos = playerMenuPos[menuType];
  menuPos.x = menuPos.x + (clientX - mouseStartPos.x);
  menuPos.y = menuPos.y + (clientY - mouseStartPos.y);

  if (menuType == "cases") moveCasesMenu();
  if (menuType == "manual") moveManualMenu();
  if (menuType == "answer") moveAnswerMenu();

  mouseStartPos.x = clientX;
  mouseStartPos.y = clientY;
}

casesMenu.addEventListener("mouseup", () => {
  isDragginPlayerMenu = false;
  casesMenu.classList.remove("grabbing");
});
casesMenu.addEventListener("mousedown", startDragPlayerMenu);
casesMenu.addEventListener("mousemove", (event) =>
  dragPlayerMenu(event, "cases")
);

manualMenu.addEventListener("mouseup", () => {
  isDragginPlayerMenu = false;
  manualMenu.classList.remove("grabbing");
});
manualMenu.addEventListener("mousedown", startDragPlayerMenu);
manualMenu.addEventListener("mousemove", (event) =>
  dragPlayerMenu(event, "manual")
);

answerMenu.addEventListener("mouseup", () => {
  isDragginPlayerMenu = false;
  answerMenu.classList.remove("grabbing");
});
answerMenu.addEventListener("mousedown", startDragPlayerMenu);
answerMenu.addEventListener("mousemove", (event) =>
  dragPlayerMenu(event, "answer")
);

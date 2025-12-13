const playerMenuState = {
  pause: false,
  cases: false,
  manual: false,
  answer: false,
  settings: false,
};

const playerMenuPos = {
  cases: {
    x: window.innerWidth * 0.3,
    y: window.innerHeight * 0.05,
  },
  manual: {
    x: window.innerWidth * 0.17,
    y: window.innerHeight * 0.05,
  },
  answer: {
    x: window.innerWidth * 0.3,
    y: window.innerHeight * 0.05,
  },
};

//////////////////////////////////////////////////////
function togglePause() {
  const icon = document.querySelector(".pause-btn img");

  if (playerMenuState.pause == true) {
    icon.src = "assets/icons/pause.png";
    playerMenuState.pause = false;
  } else if (playerMenuState.pause == false) {
    icon.src = "assets/icons/play.png";
    playerMenuState.pause = true;
  }
}
//////////////////////////////////////////////////////
function toggleCases() {
  const casesMenu = document.querySelector(".cases-menu");
  const icon = document.querySelector(".cases-btn img");

  if (playerMenuState.cases == true) {
    casesMenu.classList.add("hide");
    icon.src = "assets/icons/cases-close.png";
    playerMenuState.cases = false;
  } else if (playerMenuState.cases == false) {
    casesMenu.classList.remove("hide");
    casesMenu.style.top = `${playerMenuPos.cases.y}px`;
    casesMenu.style.left = `${playerMenuPos.cases.x}px`;
    icon.src = "assets/icons/cases-open.png";
    playerMenuState.cases = true;
  }

  showCasesList();
}

function showCasesList() {
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
  const manualMenu = document.querySelector(".manual-menu");
  const icon = document.querySelector(".manual-btn img");

  if (playerMenuState.manual == true) {
    manualMenu.classList.add("hide");
    icon.src = "assets/icons/manual-close.png";
    playerMenuState.manual = false;
  } else if (playerMenuState.manual == false) {
    manualMenu.classList.remove("hide");
    manualMenu.style.top = `${playerMenuPos.manual.y}px`;
    manualMenu.style.left = `${playerMenuPos.manual.x}px`;
    icon.src = "assets/icons/manual-open.png";
    playerMenuState.manual = true;
  }
}
//////////////////////////////////////////////////////
function toggleAnswer() {
  const answerMenu = document.querySelector(".answer-menu");
  const icon = document.querySelector(".answer-btn img");

  if (playerMenuState.answer == true) {
    answerMenu.classList.add("hide");
    icon.src = "assets/icons/answer-close.png";
    playerMenuState.answer = false;
  } else if (playerMenuState.answer == false) {
    answerMenu.classList.remove("hide");
    answerMenu.style.top = `${playerMenuPos.answer.y}px`;
    answerMenu.style.left = `${playerMenuPos.answer.x}px`;
    icon.src = "assets/icons/answer-open.png";
    playerMenuState.answer = true;
  }
}
//////////////////////////////////////////////////////
function toggleSettings() {
  if (playerMenuState.settings == true) {
    playerMenuState.settings = false;
  } else if (playerMenuState.settings == false) {
    playerMenuState.settings = true;
  }
}

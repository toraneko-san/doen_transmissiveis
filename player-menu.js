const playerMenuState = {
  pause: false,
  cases: false,
  manual: false,
  answer: false,
  settings: false,
};

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

function toggleCases() {
  const icon = document.querySelector(".cases-btn img");

  if (playerMenuState.cases == true) {
    icon.src = "assets/icons/cases-close.png";
    playerMenuState.cases = false;
  } else if (playerMenuState.cases == false) {
    icon.src = "assets/icons/cases-open.png";
    playerMenuState.cases = true;
  }
}

function toggleManual() {
  const icon = document.querySelector(".manual-btn img");

  if (playerMenuState.manual == true) {
    icon.src = "assets/icons/manual-close.png";
    playerMenuState.manual = false;
  } else if (playerMenuState.manual == false) {
    icon.src = "assets/icons/manual-open.png";
    playerMenuState.manual = true;
  }
}

function toggleAnswer() {
  const icon = document.querySelector(".answer-btn img");

  if (playerMenuState.answer == true) {
    icon.src = "assets/icons/answer-close.png";
    playerMenuState.answer = false;
  } else if (playerMenuState.answer == false) {
    icon.src = "assets/icons/answer-open.png";
    playerMenuState.answer = true;
  }
}

function toggleSettings() {
  if (playerMenuState.settings == true) {
    playerMenuState.settings = false;
  } else if (playerMenuState.settings == false) {
    playerMenuState.settings = true;
  }
}

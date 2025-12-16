const answer = {
  disease: null,
  location: null,
};
const finishBtn = document.querySelector(".finish-btn");
const resultContainer = document.querySelector(".result-container");

function displayDiseases() {
  const diseasesList = document.getElementById("diseases-list");
  diseasesList.innerHTML = "";

  const headerLi = document.createElement("li");
  headerLi.innerHTML = `<h3>DOENÇAS</h3>`;
  diseasesList.appendChild(headerLi);

  diseases.forEach((disease, index) => {
    const listItem = document.createElement("li");
    const span = document.createElement("span");
    const name = disease.name || disease.nome || "";
    span.textContent = `[ID ${index}] - ${name}`;
    span.className = "";
    if (disease.estado === 1) span.classList.add("riscado");
    if (disease.estado === 2) span.classList.add("marcatexto");
    if (disease.estado === 3) span.classList.add("confirmacao");

    span.addEventListener("click", () => {
      // ciclo: 0 -> 1 (riscado) -> 2 (marcatexto) -> 3 (confirmacao, exclusiva) -> 0
      if (!disease.estado || disease.estado === 0) {
        disease.estado = 1;
      } else if (disease.estado === 1) {
        disease.estado = 2;
      } else if (disease.estado === 2) {
        // tornar confirmacao exclusivo entre diseases
        diseases.forEach((other) => {
          if (other !== disease && other.estado === 3) other.estado = 2;
        });
        disease.estado = 3;
      } else {
        disease.estado = 0;
      }

      answer.disease = null;
      diseases.forEach((d, i) => {
        if (d.estado == 3) answer.disease = i;
      });

      renderAnswer();
    });

    listItem.appendChild(span);
    diseasesList.appendChild(listItem);
  });
}

function displayLocations() {
  const locationsList = document.getElementById("locations-list");
  locationsList.innerHTML = "";

  const headerLi = document.createElement("li");
  headerLi.innerHTML = `<h3>LOCALIZAÇÕES</h3>`;
  locationsList.appendChild(headerLi);

  locations.forEach((location, index) => {
    const listItem = document.createElement("li");
    const span = document.createElement("span");
    const name =
      location && (location.name || location.nome)
        ? location.name || location.nome
        : String(location);
    span.textContent = `[ID ${index}] - ${name}`;
    span.className = "";
    if (location && location.estado === 1) span.classList.add("riscado");
    if (location && location.estado === 2) span.classList.add("marcatexto");
    if (location && location.estado === 3) span.classList.add("confirmacao");

    span.addEventListener("click", () => {
      if (!location.estado || location.estado === 0) {
        location.estado = 1;
      } else if (location.estado === 1) {
        location.estado = 2;
      } else if (location.estado === 2) {
        // tornar confirmacao exclusiva entre locations
        locations.forEach((other) => {
          if (other !== location && other.estado === 3) other.estado = 2;
        });
        location.estado = 3;
      } else {
        location.estado = 0;
      }

      answer.location = null;
      locations.forEach((l, i) => {
        if (l.estado == 3) answer.location = i;
      });

      renderAnswer();
    });

    listItem.appendChild(span);
    locationsList.appendChild(listItem);
  });
}

function renderAnswer() {
  displayDiseases();
  displayLocations();

  checkFinishBtnState();
  finishBtn.addEventListener("click", checkResult);
}

function checkFinishBtnState() {
  if (answer.disease !== null && answer.location !== null) {
    finishBtn.disabled = false;
  } else {
    finishBtn.disabled = true;
  }
}

function checkResult() {
  togglePause();
  playerMenu.classList.add("hide");
  casesMenu.classList.add("hide");
  manualMenu.classList.add("hide");
  answerMenu.classList.add("hide");

  resultContainer.classList.remove("hide");

  const isCorrect =
    answer.disease == selectedDiseaseId &&
    answer.location == selectedLocationId;
  const resultMsg = isCorrect ? "Parábens!" : "Tente novamente...";

  const result = document.querySelector(".result");
  result.innerHTML = `
    <p class="message">${resultMsg}</p>
    <div class="answer-container">
      <p>Doença:</p>
      <p class="correct-answer">${
        answer.disease == selectedDiseaseId ? "✔" : ""
      } ${diseases[selectedDiseaseId].name}
      ${
        answer.disease != selectedDiseaseId
          ? `<span class='wrong-answer'>X ${
              diseases[answer.disease].name
            }</span>`
          : ""
      }
      </p>
      <p>Local:</p>
      <p class="correct-answer">${
        answer.location == selectedLocationId ? "✔" : ""
      } ${locations[selectedLocationId].name}
      ${
        answer.location != selectedLocationId
          ? `<span class='wrong-answer'>X ${
              locations[answer.location].name
            }</span>`
          : ""
      }
      </p>
    </div>
    <p class="comment">
      ${diseases[selectedDiseaseId].comment}
    </p>
  `;
}

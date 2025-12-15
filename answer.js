const answer = {
  disease: null,
  location: null,
};

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
        answer.disease = index;
      } else {
        disease.estado = 0;
      }
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
        answer.location = index;
      } else {
        location.estado = 0;
      }
      renderAnswer();
    });

    listItem.appendChild(span);
    locationsList.appendChild(listItem);
  });
}

function renderAnswer() {
  displayDiseases();
  displayLocations();

  document
    .getElementById("closeAnswer")
    .addEventListener("click", toggleAnswer);
}

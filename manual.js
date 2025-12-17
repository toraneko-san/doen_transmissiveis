let manualSpreads = [];
let currentSpread = 0;

function buildManual() {
  const items = [];
  for (let i = 0; i < locations.length; i++) {
    items.push({
      type: "location",
      idx: i,
      data: locations[i],
      pageNum: i + 1,
    });
  }
  for (let i = 0; i < diseases.length; i++) {
    items.push({
      type: "disease",
      idx: i,
      data: diseases[i],
      pageNum: locations.length + i + 1,
    });
  }

  for (let i = 0; i < items.length; i += 2) {
    manualSpreads.push([items[i], items[i + 1] || null]);
  }
}

buildManual();

function renderSpread(index) {
  const left = document.querySelector(".page.left");
  const right = document.querySelector(".page.right");

  const spread = manualSpreads[currentSpread];

  left.innerHTML = spread[0] ? renderItem(spread[0]) : "";
  right.innerHTML = spread[1] ? renderItem(spread[1]) : "";
}

function renderItem(item) {
  if (item.type === "disease") {
    const s = item.data.symptoms || [];
    return `
    <div class="page-content">
      <h3>Doença [ID: ${item.idx}]</h3>
      <h3>${item.data.name}</h3>
      <p>${item.data.description}<p>
      <h4>SINTOMAS</h4>
      <ul>
      ${s.map((t) => `<li>${t}</li>`).join("")}
      </ul>
    </div>
    <p class="page-num">${item.pageNum}</p>
	`;
  }

  if (item.type === "location") {
    const diseaseList = (item.data.diseases || []).map((dIdx) => {
      const d = diseases[dIdx];
      return d ? `<li>[ID ${dIdx}] ${d.name}</li>` : "";
    });

    return `
    <div class="page-content">
      <h3>Local [ID: ${item.idx}]</h3>
      <h3>${item.data.name}</h3>
      <img src="assets/locations/${item.data.img}" draggable="false"  />
      <h4>DOENÇAS</h4>
      <ul>${diseaseList.join("")}</ul>
    </div>
    <p class="page-num">${item.pageNum}</p>
	`;
  }
}

function prev() {
  if (currentSpread > 0) currentSpread--;
  else currentSpread = manualSpreads.length - 1;

  renderSpread(currentSpread);
}

function next() {
  if (currentSpread < manualSpreads.length - 1) currentSpread++;
  else currentSpread = 0;
  
  renderSpread(currentSpread);
}

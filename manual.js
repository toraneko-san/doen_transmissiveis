let manualSpreads = [];
let currentSpread = 0;

function buildManual() {
  const items = [];
  for (let i = 0; i < locations.length; i++) {
    items.push({ type: "location", idx: i, data: locations[i] });
  }
  for (let i = 0; i < diseases.length; i++) {
    items.push({ type: "disease", idx: i, data: diseases[i] });
  }

  for (let i = 0; i < items.length; i += 2) {
    manualSpreads.push([items[i], items[i + 1] || null]);
  }
}

buildManual();

function renderSpread(index) {
  const left = document.getElementById("pgL");
  const right = document.getElementById("pgR");
  if (!left || !right) return;
  currentSpread = Math.max(0, Math.min(index, manualSpreads.length - 1));
  const spread = manualSpreads[currentSpread] || [null, null];

  left.innerHTML = spread[0] ? renderItem(spread[0]) : "";
  right.innerHTML = spread[1] ? renderItem(spread[1]) : "";
}

function renderItem(item) {
  if (item.type === "disease") {
    const s = item.data.symptoms || [];
    return `
		<h3>Doença [ID: ${item.idx}]</h3>
		<h3>${escapeHtml(item.data.name)}</h3>
		<p>${item.data.description}<p>
		<h4>SINTOMAS</h4>
		<ul>
			${s.map((t) => `<li>${escapeHtml(t)}</li>`).join("")}
	  	</ul>
	`;
  }

  if (item.type === "location") {
    const diseaseList = (item.data.diseases || []).map((dIdx) => {
      const d = diseases[dIdx];
      return d ? `<li>[ID ${dIdx}] ${escapeHtml(d.name)}</li>` : "";
    });

    return `
		<h3>Local [ID: ${item.idx}]</h3>
		<h3>${escapeHtml(item.data.name)}</h3>
		<img src="assets/locations/${item.data.img}" draggable="false"  />
		<h4>DOENÇAS</h4>
		<ul>${diseaseList.join("")}</ul>
	`;
  }
}

function prev() {
  if (currentSpread > 0) {
    currentSpread--;
    renderSpread(currentSpread);
  }
}

function next() {
  if (currentSpread < manualSpreads.length - 1) {
    currentSpread++;
    renderSpread(currentSpread);
  }
}

function escapeHtml(str) {
  if (typeof str !== "string") return "";
  return str.replace(/[&<>"']/g, function (m) {
    return {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    }[m];
  });
}

window.addEventListener("DOMContentLoaded", () => {
  buildManual();
  renderSpread(0);
});

let manualSpreads = [];
let currentSpread = 0;

function buildManual() {
	manualSpreads = [];
	const items = [];
	if (typeof diseases !== 'undefined') {
		for (let i = 0; i < diseases.length; i++) {
			items.push({ type: 'disease', idx: i, data: diseases[i] });
		}
	}
	if (typeof locations !== 'undefined') {
		for (let i = 0; i < locations.length; i++) {
			items.push({ type: 'location', idx: i, data: locations[i] });
		}
	}

	for (let i = 0; i < items.length; i += 2) {
		manualSpreads.push([items[i], items[i + 1] || null]);
	}
}

function renderSpread(index) {
	const left = document.getElementById('pgL');
	const right = document.getElementById('pgR');
	if (!left || !right) return;
	currentSpread = Math.max(0, Math.min(index, manualSpreads.length - 1));
	const spread = manualSpreads[currentSpread] || [null, null];

	left.innerHTML = spread[0] ? renderItem(spread[0]) : '';
	right.innerHTML = spread[1] ? renderItem(spread[1]) : '';
}

function renderItem(item) {
	if (!item) return '';
	if (item.type === 'disease') {
		const s = item.data.symptons || [];
		return `<h3>${escapeHtml(item.data.name)}</h3><ul>${s
			.map((t) => `<li>${escapeHtml(t)}</li>`)
			.join('')}</ul>`;
	}
	if (item.type === 'location') {
		const diseaseList = (item.data.diseases || []).map((dIdx) => {
			const d = diseases[dIdx];
			return d ? `<li>${escapeHtml(d.name)}</li>` : '';
		});
		return `<h3>Local: ${escapeHtml(item.data.name)}</h3><ul>${diseaseList.join('')}</ul>`;
	}
	return '';
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
	if (typeof str !== 'string') return '';
	return str.replace(/[&<>"']/g, function (m) {
		return {
			'&': '&amp;',
			'<': '&lt;',
			'>': '&gt;',
			'"': '&quot;',
			"'": '&#39;'
		}[m];
	});
}

window.addEventListener('DOMContentLoaded', () => {
	buildManual();
	renderSpread(0);
});


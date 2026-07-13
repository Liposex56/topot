const STORAGE_KEY = "levantamientos-topograficos-v1";
const PROJECTS_KEY = "levantamientos-topograficos-projects-v1";
const CURRENT_PROJECT_KEY = "levantamientos-topograficos-current-project-v1";

const els = {
  stationEast: document.querySelector("#stationEast"),
  stationNorth: document.querySelector("#stationNorth"),
  modeInputs: [...document.querySelectorAll('input[name="mode"]')],
  showLines: document.querySelector("#showLines"),
  closePolygon: document.querySelector("#closePolygon"),
  showGrid: document.querySelector("#showGrid"),
  body: document.querySelector("#observationsBody"),
  rowTemplate: document.querySelector("#rowTemplate"),
  canvas: document.querySelector("#plotCanvas"),
  addRow: document.querySelector("#addRowBtn"),
  fit: document.querySelector("#fitBtn"),
  sample: document.querySelector("#sampleBtn"),
  export: document.querySelector("#exportBtn"),
  exportProcess: document.querySelector("#exportProcessBtn"),
  exportTxt: document.querySelector("#exportTxtBtn"),
  importFile: document.querySelector("#importFile"),
  newProject: document.querySelector("#newProjectBtn"),
  saveProject: document.querySelector("#saveProjectBtn"),
  projectName: document.querySelector("#projectName"),
  projectList: document.querySelector("#projectList"),
  loadProject: document.querySelector("#loadProjectBtn"),
  deleteProject: document.querySelector("#deleteProjectBtn"),
  saveState: document.querySelector("#saveState"),
  pointsCount: document.querySelector("#pointsCount"),
  areaValue: document.querySelector("#areaValue"),
  perimeterValue: document.querySelector("#perimeterValue"),
  lastPoint: document.querySelector("#lastPoint"),
  axisDecimals: document.querySelector("#axisDecimals"),
};

let state = {
  projectName: "Levantamiento sin nombre",
  station: { east: 1000, north: 1000 },
  mode: "radiacion",
  showLines: true,
  closePolygon: true,
  showGrid: true,
  axisDecimals: 0,
  observations: [],
};

function createBlankState(projectName = "Levantamiento sin nombre") {
  return {
    projectName,
    station: { east: 1000, north: 1000 },
    mode: "radiacion",
    showLines: true,
    closePolygon: true,
    showGrid: true,
    axisDecimals: 0,
    observations: [defaultObservation(1)],
  };
}

function defaultObservation(index) {
  return {
    id: String(index),
    degrees: 0,
    minutes: 0,
    seconds: 0,
    distance: 0,
    description: "",
  };
}

function toNumber(value) {
  const parsed = Number.parseFloat(String(value));
  return Number.isFinite(parsed) ? parsed : 0;
}

function hasPointData(obs) {
  return toNumber(obs.distance) > 0;
}

function clampNumber(value, min, max) {
  return Math.min(max, Math.max(min, toNumber(value)));
}

function normalizeObservation(obs) {
  const normalized = { ...defaultObservation(1), ...obs };
  normalized.degrees = clampNumber(normalized.degrees, 0, 360);
  if (normalized.degrees >= 360) {
    normalized.degrees = 360;
    normalized.minutes = 0;
    normalized.seconds = 0;
  } else {
    normalized.minutes = clampNumber(normalized.minutes, 0, 59);
    normalized.seconds = clampNumber(normalized.seconds, 0, 59.999);
  }
  normalized.distance = Math.max(0, toNumber(normalized.distance));
  normalized.description = normalized.description || "";
  return normalized;
}

function dmsToDecimal({ degrees, minutes, seconds }) {
  const sign = toNumber(degrees) < 0 ? -1 : 1;
  return sign * (Math.abs(toNumber(degrees)) + toNumber(minutes) / 60 + toNumber(seconds) / 3600);
}

function decimalToDms(value) {
  const normalized = ((value % 360) + 360) % 360;
  const degrees = Math.floor(normalized);
  const minuteFloat = (normalized - degrees) * 60;
  const minutes = Math.floor(minuteFloat);
  const seconds = (minuteFloat - minutes) * 60;
  return { degrees, minutes, seconds };
}

function formatDms(value) {
  const dms = decimalToDms(value);
  return `${dms.degrees}°${String(dms.minutes).padStart(2, "0")}'${dms.seconds.toFixed(3).padStart(6, "0")}"`;
}

function formatDmsText(value) {
  const dms = decimalToDms(value);
  return `${dms.degrees} deg ${String(dms.minutes).padStart(2, "0")}' ${dms.seconds.toFixed(3).padStart(6, "0")}"`;
}

function bearingFromAzimuth(azimuth) {
  const angle = ((azimuth % 360) + 360) % 360;
  if (angle <= 90) return `N ${formatDmsText(angle)} E`;
  if (angle <= 180) return `S ${formatDmsText(180 - angle)} E`;
  if (angle <= 270) return `S ${formatDmsText(angle - 180)} W`;
  return `N ${formatDmsText(360 - angle)} W`;
}

function computePoints() {
  const stationEast = toNumber(state.station.east);
  const stationNorth = toNumber(state.station.north);
  let cursor = { east: stationEast, north: stationNorth };

  return state.observations.map((obs, index) => {
    const normalized = normalizeObservation(obs);
    normalized.id = normalized.id || String(index + 1);
    state.observations[index] = normalized;
    const valid = hasPointData(normalized);
    const azimuth = dmsToDecimal(normalized);
    const radians = (azimuth * Math.PI) / 180;
    const distance = Math.max(0, toNumber(normalized.distance));
    const deltaEast = distance * Math.sin(radians);
    const deltaNorth = distance * Math.cos(radians);

    const base = state.mode === "poligonal" ? cursor : { east: stationEast, north: stationNorth };
    const point = {
      id: normalized.id,
      azimuth,
      distance,
      deltaEast,
      deltaNorth,
      east: base.east + deltaEast,
      north: base.north + deltaNorth,
      bearing: bearingFromAzimuth(azimuth),
      radians,
      valid,
      description: normalized.description,
      source: normalized,
    };
    if (state.mode === "poligonal" && valid) cursor = point;
    return point;
  });
}

function polygonArea(points) {
  if (points.length < 3) return 0;
  let sum = 0;
  for (let i = 0; i < points.length; i += 1) {
    const a = points[i];
    const b = points[(i + 1) % points.length];
    sum += a.east * b.north - b.east * a.north;
  }
  return Math.abs(sum) / 2;
}

function perimeter(points) {
  if (points.length < 2) return 0;
  let total = 0;
  const last = state.closePolygon && points.length > 2 ? points.length : points.length - 1;
  for (let i = 0; i < last; i += 1) {
    const a = points[i];
    const b = points[(i + 1) % points.length];
    total += Math.hypot(b.east - a.east, b.north - a.north);
  }
  return total;
}

function formatNumber(value, decimals = 3) {
  return new Intl.NumberFormat("en-US", {
    useGrouping: false,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

function formatCoordinate(value) {
  return new Intl.NumberFormat("en-US", {
    useGrouping: false,
    minimumFractionDigits: 0,
    maximumFractionDigits: 3,
  }).format(value);
}

function formatPlainNumber(value, decimals = 3) {
  if (decimals === 0) return String(Math.round(Number(value || 0)));
  return Number(value || 0).toFixed(decimals).replace(/\.?0+$/, "");
}

function niceStep(rawStep) {
  if (!Number.isFinite(rawStep) || rawStep <= 0) return 1;
  const power = 10 ** Math.floor(Math.log10(rawStep));
  const fraction = rawStep / power;
  if (fraction <= 1) return power;
  if (fraction <= 2) return 2 * power;
  if (fraction <= 5) return 5 * power;
  return 10 * power;
}

function niceAxis(minValue, maxValue, anchorValue) {
  if (minValue === maxValue) {
    const center = Number.isFinite(anchorValue) ? anchorValue : minValue;
    minValue = center - 5;
    maxValue = center + 5;
  }

  const span = Math.max(1, maxValue - minValue);
  const padding = span * 0.12;
  const paddedMin = minValue - padding;
  const paddedMax = maxValue + padding;
  const step = niceStep((paddedMax - paddedMin) / 5);
  const axisMin = Math.floor(paddedMin / step) * step;
  const axisMax = Math.ceil(paddedMax / step) * step;
  const ticks = [];

  for (let value = axisMin; value <= axisMax + step / 2; value += step) {
    ticks.push(Number(value.toFixed(10)));
  }

  if (!ticks.some((value) => Math.abs(value - anchorValue) < step / 1000)) {
    ticks.push(anchorValue);
    ticks.sort((a, b) => a - b);
  }

  return { min: axisMin, max: axisMax, ticks };
}

function balancedAxes(eastAxis, northAxis, plotW, plotH, station) {
  let eastMin = eastAxis.min;
  let eastMax = eastAxis.max;
  let northMin = northAxis.min;
  let northMax = northAxis.max;
  const eastUnitsPerPixel = (eastMax - eastMin) / plotW;
  const northUnitsPerPixel = (northMax - northMin) / plotH;

  if (eastUnitsPerPixel > northUnitsPerPixel) {
    const targetRange = eastUnitsPerPixel * plotH;
    const center = station.north;
    northMin = center - targetRange / 2;
    northMax = center + targetRange / 2;
  } else {
    const targetRange = northUnitsPerPixel * plotW;
    const center = station.east;
    eastMin = center - targetRange / 2;
    eastMax = center + targetRange / 2;
  }

  return {
    eastAxis: niceAxis(eastMin, eastMax, station.east),
    northAxis: niceAxis(northMin, northMax, station.north),
  };
}

function loadProjects() {
  try {
    return JSON.parse(localStorage.getItem(PROJECTS_KEY)) || {};
  } catch {
    return {};
  }
}

function writeProjects(projects) {
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
}

function normalizeProjectName(name) {
  return (name || "").trim() || "Levantamiento sin nombre";
}

function saveNamedProject() {
  state.projectName = normalizeProjectName(state.projectName);
  const projects = loadProjects();
  projects[state.projectName] = structuredClone(state);
  writeProjects(projects);
  localStorage.setItem(CURRENT_PROJECT_KEY, state.projectName);
  renderProjectList();
  els.saveState.textContent = `Guardado: ${state.projectName}`;
}

function renderProjectList() {
  const projects = loadProjects();
  const names = Object.keys(projects).sort((a, b) => a.localeCompare(b, "es"));
  els.projectList.innerHTML = "";
  if (!names.length) {
    const option = document.createElement("option");
    option.value = "";
    option.textContent = "Sin guardados";
    els.projectList.appendChild(option);
    return;
  }
  names.forEach((name) => {
    const option = document.createElement("option");
    option.value = name;
    option.textContent = name;
    option.selected = name === state.projectName;
    els.projectList.appendChild(option);
  });
}

function renderRows(points) {
  els.body.innerHTML = "";
  state.observations.forEach((obs, index) => {
    state.observations[index] = normalizeObservation(obs);
    state.observations[index].id = state.observations[index].id || String(index + 1);
    obs = state.observations[index];
    const row = els.rowTemplate.content.firstElementChild.cloneNode(true);
    row.dataset.index = String(index);
    row.querySelectorAll("input[data-field]").forEach((input) => {
      const field = input.dataset.field;
      input.value = obs[field] ?? "";
      input.addEventListener("input", () => {
        state.observations[index][field] = input.type === "number" ? toNumber(input.value) : input.value;
        state.observations[index] = normalizeObservation(state.observations[index]);
        state.observations[index].id = state.observations[index].id || String(index + 1);
        if (input.type === "number") {
          const normalizedValue = String(state.observations[index][field] ?? "");
          if (input.value !== normalizedValue && toNumber(input.value) !== toNumber(normalizedValue)) {
            input.value = normalizedValue;
          }
        }
        update(false);
      });
    });

    const point = points[index];
    row.querySelector('[data-output="azimuth"]').textContent = point?.valid ? formatNumber(point.azimuth) : "-";
    row.querySelector('[data-output="bearing"]').textContent = point?.valid ? point.bearing : "-";
    row.querySelector('[data-output="deltaEast"]').textContent = point?.valid ? formatNumber(point.deltaEast) : "-";
    row.querySelector('[data-output="deltaNorth"]').textContent = point?.valid ? formatNumber(point.deltaNorth) : "-";
    row.querySelector('[data-output="east"]').textContent = point?.valid ? formatNumber(point.east) : "-";
    row.querySelector('[data-output="north"]').textContent = point?.valid ? formatNumber(point.north) : "-";
    row.querySelector('[data-action="delete"]').addEventListener("click", () => {
      state.observations[index] = defaultObservation(index + 1);
      update();
    });
    els.body.appendChild(row);
  });
}

function renderRowOutputs(points) {
  els.body.querySelectorAll("tr").forEach((row, index) => {
    const point = points[index];
    const obs = state.observations[index];
    if (obs) {
      row.querySelectorAll("input[data-field]").forEach((input) => {
        if (document.activeElement !== input) input.value = obs[input.dataset.field] ?? "";
      });
    }
    row.querySelector('[data-output="azimuth"]').textContent = point?.valid ? formatNumber(point.azimuth) : "-";
    row.querySelector('[data-output="bearing"]').textContent = point?.valid ? point.bearing : "-";
    row.querySelector('[data-output="deltaEast"]').textContent = point?.valid ? formatNumber(point.deltaEast) : "-";
    row.querySelector('[data-output="deltaNorth"]').textContent = point?.valid ? formatNumber(point.deltaNorth) : "-";
    row.querySelector('[data-output="east"]').textContent = point?.valid ? formatNumber(point.east) : "-";
    row.querySelector('[data-output="north"]').textContent = point?.valid ? formatNumber(point.north) : "-";
  });
}

function drawPlot(points) {
  const canvas = els.canvas;
  const ctx = canvas.getContext("2d");
  const rect = canvas.getBoundingClientRect();
  const scale = window.devicePixelRatio || 1;
  canvas.width = Math.max(600, Math.round(rect.width * scale));
  canvas.height = Math.max(360, Math.round(rect.height * scale));
  ctx.setTransform(scale, 0, 0, scale, 0, 0);

  const width = rect.width;
  const height = rect.height;
  ctx.clearRect(0, 0, width, height);

  const station = {
    east: toNumber(state.station.east),
    north: toNumber(state.station.north),
    id: "BM",
  };
  const validPoints = points.filter((point) => point.valid);
  const all = [station, ...validPoints];
  const eastValues = all.map((p) => p.east);
  const northValues = all.map((p) => p.north);
  let eastAxis = niceAxis(Math.min(...eastValues), Math.max(...eastValues), station.east);
  let northAxis = niceAxis(Math.min(...northValues), Math.max(...northValues), station.north);

  const margin = { left: 62, right: 28, top: 24, bottom: 48 };
  const plotW = width - margin.left - margin.right;
  const plotH = height - margin.top - margin.bottom;
  ({ eastAxis, northAxis } = balancedAxes(eastAxis, northAxis, plotW, plotH, station));
  const x = (east) => margin.left + ((east - eastAxis.min) / (eastAxis.max - eastAxis.min)) * plotW;
  const y = (north) => margin.top + (1 - (north - northAxis.min) / (northAxis.max - northAxis.min)) * plotH;

  const axisDecimals = Number.parseInt(state.axisDecimals, 10) || 0;

  ctx.fillStyle = "#fbfcfa";
  ctx.fillRect(0, 0, width, height);

  if (state.showGrid) {
    ctx.strokeStyle = "rgba(25, 33, 38, 0.12)";
    ctx.fillStyle = "#60717b";
    ctx.lineWidth = 1;
    ctx.font = "12px Segoe UI, Arial";
    eastAxis.ticks.forEach((eastLabel) => {
      const gx = x(eastLabel);
      ctx.beginPath();
      ctx.moveTo(gx, margin.top);
      ctx.lineTo(gx, margin.top + plotH);
      ctx.stroke();
      ctx.fillText(formatNumber(eastLabel, axisDecimals), gx - 18, height - 22);
    });
    northAxis.ticks.forEach((northLabel) => {
      const gy = y(northLabel);
      ctx.beginPath();
      ctx.moveTo(margin.left, gy);
      ctx.lineTo(margin.left + plotW, gy);
      ctx.stroke();
      ctx.fillText(formatNumber(northLabel, axisDecimals), 10, gy + 4);
    });
  }

  ctx.strokeStyle = "#192126";
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.moveTo(margin.left, margin.top + plotH);
  ctx.lineTo(margin.left + plotW, margin.top + plotH);
  ctx.moveTo(margin.left, margin.top);
  ctx.lineTo(margin.left, margin.top + plotH);
  ctx.stroke();

  if (validPoints.length && state.showLines) {
    ctx.strokeStyle = "#0b6b5d";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    let openSegment = false;
    points.forEach((point, index) => {
      if (!point.valid) {
        openSegment = false;
        return;
      }
      const px = x(point.east);
      const py = y(point.north);
      if (!openSegment || index === 0) {
        ctx.moveTo(px, py);
        openSegment = true;
      }
      else ctx.lineTo(px, py);
    });
    if (state.closePolygon && validPoints.length > 2 && validPoints.length === points.length) ctx.closePath();
    ctx.stroke();

    if (state.closePolygon && validPoints.length > 2 && validPoints.length === points.length) {
      ctx.fillStyle = "rgba(11, 107, 93, 0.08)";
      ctx.fill();
    }
  }

  drawStationGuides(ctx, x(station.east), y(station.north), margin, plotW, plotH);
  drawPoint(ctx, x(station.east), y(station.north), station.id, "#c75d2c", true);
  drawStationCoords(ctx, x(station.east), y(station.north), station);
  validPoints.forEach((point) => drawPoint(ctx, x(point.east), y(point.north), point.id, "#0b6b5d"));

  ctx.fillStyle = "#60717b";
  ctx.font = "700 12px Segoe UI, Arial";
  ctx.fillText("Este (E)", margin.left + plotW - 54, height - 8);
  ctx.fillText("Norte (N)", margin.left, 14);
}

function drawPoint(ctx, x, y, label, color, station = false) {
  ctx.fillStyle = color;
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(x, y, station ? 7 : 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#192126";
  ctx.font = "750 12px Segoe UI, Arial";
  ctx.fillText(label, x + 9, y - 9);
}

function drawStationGuides(ctx, x, y, margin, plotW, plotH) {
  ctx.save();
  ctx.strokeStyle = "rgba(199, 93, 44, 0.55)";
  ctx.lineWidth = 1.2;
  ctx.setLineDash([5, 5]);
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x, margin.top + plotH);
  ctx.moveTo(x, y);
  ctx.lineTo(margin.left, y);
  ctx.stroke();
  ctx.restore();
}

function drawStationCoords(ctx, x, y, station) {
  ctx.fillStyle = "#60717b";
  ctx.font = "700 11px Segoe UI, Arial";
  ctx.fillText(`E ${formatCoordinate(station.east)} / N ${formatCoordinate(station.north)}`, x + 9, y + 12);
}

function syncControls() {
  els.projectName.value = state.projectName;
  els.stationEast.value = state.station.east;
  els.stationNorth.value = state.station.north;
  els.modeInputs.forEach((input) => {
    input.checked = input.value === state.mode;
  });
  els.showLines.checked = state.showLines;
  els.closePolygon.checked = state.closePolygon;
  els.showGrid.checked = state.showGrid;
  els.axisDecimals.value = String(state.axisDecimals);
  renderProjectList();
}

function updateStats(points) {
  const measuredPoints = points.filter((point) => point.valid);
  const area = polygonArea(measuredPoints);
  const length = perimeter(measuredPoints);
  const last = measuredPoints.at(-1);
  els.pointsCount.textContent = String(measuredPoints.length);
  els.areaValue.textContent = `${formatNumber(area)} m2`;
  els.perimeterValue.textContent = `${formatNumber(length)} m`;
  els.lastPoint.textContent = last
    ? `E ${formatNumber(last.east)} / N ${formatNumber(last.north)}`
    : `BM E ${formatCoordinate(toNumber(state.station.east))} / N ${formatCoordinate(toNumber(state.station.north))}`;
}

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  localStorage.setItem(CURRENT_PROJECT_KEY, state.projectName);
  persistCurrentNamedProject();
  els.saveState.textContent = "Guardado local";
  window.clearTimeout(save._timer);
  save._timer = window.setTimeout(() => {
    els.saveState.textContent = "Listo";
  }, 900);
}

function persistCurrentNamedProject() {
  state.projectName = normalizeProjectName(state.projectName);
  const projects = loadProjects();
  projects[state.projectName] = structuredClone(state);
  writeProjects(projects);
  renderProjectList();
}

function update(renderTable = true) {
  const points = computePoints();
  if (renderTable) renderRows(points);
  else renderRowOutputs(points);
  updateStats(points);
  drawPlot(points);
  save();
}

function load() {
  const projects = loadProjects();
  const currentName = localStorage.getItem(CURRENT_PROJECT_KEY);
  const stored = currentName && projects[currentName] ? JSON.stringify(projects[currentName]) : localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      state = { ...state, ...JSON.parse(stored) };
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }
  if (!state.projectName) state.projectName = "Levantamiento sin nombre";
  if (!state.observations.length) state.observations = [defaultObservation(1)];
  state = { ...createBlankState(state.projectName), ...state };
  syncControls();
  update();
}

function setSample() {
  const currentStation = {
    east: toNumber(els.stationEast.value || state.station.east),
    north: toNumber(els.stationNorth.value || state.station.north),
  };
  state = {
    projectName: state.projectName || "Ejemplo de terreno",
    station: currentStation,
    mode: "radiacion",
    showLines: true,
    closePolygon: true,
    showGrid: true,
    axisDecimals: 0,
    observations: [
      { id: "1", degrees: 42, minutes: 15, seconds: 0, distance: 94.6, description: "Punto 1" },
      { id: "2", degrees: 112, minutes: 40, seconds: 30, distance: 128.2, description: "Punto 2" },
      { id: "3", degrees: 203, minutes: 10, seconds: 15, distance: 116.4, description: "Punto 3" },
      { id: "4", degrees: 304, minutes: 35, seconds: 45, distance: 86.8, description: "Punto 4" },
    ],
  };
  syncControls();
  update();
}

function safeFileName(name) {
  return normalizeProjectName(name).replace(/[\\/:*?"<>|]+/g, "-").replace(/\s+/g, "-").toLowerCase();
}

function downloadTextFile(content, filename) {
  const cleanContent = content.replaceAll("Â°", " deg").replaceAll("°", " deg");
  const blob = new Blob([cleanContent], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function makeTextTable(headers, rows) {
  const allRows = [headers, ...rows];
  const widths = headers.map((_, columnIndex) =>
    Math.max(...allRows.map((row) => String(row[columnIndex] ?? "").length))
  );
  const formatRow = (row) =>
    row.map((cell, columnIndex) => String(cell ?? "").padEnd(widths[columnIndex], " ")).join(" | ");
  return [
    formatRow(headers),
    widths.map((width) => "-".repeat(width)).join("-|-"),
    ...rows.map(formatRow),
  ].join("\n");
}

function exportTxt() {
  const points = computePoints().filter((point) => point.valid);
  const headers = ["Numero del punto", "Coordenada Este", "Coordenada Norte", "Coordenada Z", "Descripcion"];
  const rows = points.map((point) => [
    point.id,
    formatNumber(point.east),
    formatNumber(point.north),
    "0",
    point.description || "",
  ]);
  downloadTextFile(makeTextTable(headers, rows), `${safeFileName(state.projectName)}-coordenadas.txt`);
}

function exportProcess() {
  const points = computePoints().filter((point) => point.valid);
  const lines = [
    `Levantamiento: ${state.projectName}`,
    `Estacion inicial: E ${formatNumber(toNumber(state.station.east))}, N ${formatNumber(toNumber(state.station.north))}`,
    "",
    "Proceso de conversion GMS, rumbos y proyecciones",
    "",
  ];

  points.forEach((point) => {
    const obs = point.source;
    lines.push(`Punto ${point.id} - ${point.description || "Sin descripcion"}`);
    lines.push(`GMS: ${formatPlainNumber(obs.degrees, 0)}° ${formatPlainNumber(obs.minutes, 0)}' ${formatPlainNumber(obs.seconds, 3)}"`);
    lines.push(
      `Azimut decimal: ${formatPlainNumber(obs.degrees, 0)} + (${formatPlainNumber(obs.minutes, 0)} / 60) + (${formatPlainNumber(obs.seconds, 3)} / 3600) = ${formatNumber(point.azimuth)}°`
    );
    lines.push(`Radianes: ${formatNumber(point.azimuth)} * PI / 180 = ${formatNumber(point.radians, 6)}`);
    lines.push(`Rumbo cardinal: ${point.bearing}`);
    lines.push(`Proyeccion Este: distancia * sen(azimut) = ${formatNumber(point.distance)} * sen(${formatNumber(point.azimuth)}°) = ${formatNumber(point.deltaEast)}`);
    lines.push(`Proyeccion Norte: distancia * cos(azimut) = ${formatNumber(point.distance)} * cos(${formatNumber(point.azimuth)}°) = ${formatNumber(point.deltaNorth)}`);
    lines.push(`Coordenada Este: ${formatNumber(point.east)}`);
    lines.push(`Coordenada Norte: ${formatNumber(point.north)}`);
    lines.push("");
  });

  downloadTextFile(lines.join("\n"), `${safeFileName(state.projectName)}-calculos.txt`);
}

function exportCsv() {
  const points = computePoints();
  const rows = [
    ["numero_punto", "grados", "minutos", "segundos", "distancia", "descripcion", "azimut_decimal", "rumbo", "proyeccion_este", "proyeccion_norte", "este", "norte"],
    ...state.observations.map((obs, index) => {
      const point = points[index] || {};
      return [obs.id, obs.degrees, obs.minutes, obs.seconds, obs.distance, obs.description, point.azimuth, point.bearing, point.deltaEast, point.deltaNorth, point.east, point.north];
    }),
  ];
  const csv = rows.map((row) => row.map((value) => `"${String(value ?? "").replaceAll('"', '""')}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "levantamiento-topografico.csv";
  link.click();
  URL.revokeObjectURL(url);
}

function importCsv(file) {
  const reader = new FileReader();
  reader.onload = () => {
    const lines = String(reader.result).split(/\r?\n/).filter(Boolean);
    const dataLines = lines[0]?.toLowerCase().includes("numero") ? lines.slice(1) : lines;
    const observations = dataLines.map((line, index) => {
      const cells = parseCsvLine(line);
      return {
        id: cells[0] || String(index + 1),
        degrees: toNumber(cells[1]),
        minutes: toNumber(cells[2]),
        seconds: toNumber(cells[3]),
        distance: toNumber(cells[4]),
        description: cells[5] || "",
      };
    });
    if (observations.length) {
      state.observations = observations;
      update();
    }
  };
  reader.readAsText(file, "utf-8");
}

function parseCsvLine(line) {
  const cells = [];
  let current = "";
  let quoted = false;
  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    if (char === '"' && line[i + 1] === '"') {
      current += '"';
      i += 1;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (char === "," && !quoted) {
      cells.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  cells.push(current);
  return cells;
}

els.stationEast.addEventListener("input", () => {
  state.station.east = toNumber(els.stationEast.value);
  update();
});
els.projectName.addEventListener("input", () => {
  const previousName = state.projectName;
  state.projectName = normalizeProjectName(els.projectName.value);
  const projects = loadProjects();
  if (previousName && previousName !== state.projectName && projects[previousName]) {
    delete projects[previousName];
    writeProjects(projects);
  }
  save();
});
els.stationNorth.addEventListener("input", () => {
  state.station.north = toNumber(els.stationNorth.value);
  update();
});
els.modeInputs.forEach((input) => {
  input.addEventListener("change", () => {
    state.mode = input.value;
    update();
  });
});
els.showLines.addEventListener("change", () => {
  state.showLines = els.showLines.checked;
  update();
});
els.closePolygon.addEventListener("change", () => {
  state.closePolygon = els.closePolygon.checked;
  update();
});
els.showGrid.addEventListener("change", () => {
  state.showGrid = els.showGrid.checked;
  update();
});
els.axisDecimals.addEventListener("change", () => {
  state.axisDecimals = Number.parseInt(els.axisDecimals.value, 10) || 0;
  update();
});
els.addRow.addEventListener("click", () => {
  state.observations.push(defaultObservation(state.observations.length + 1));
  update();
});
els.fit.addEventListener("click", () => drawPlot(computePoints()));
els.sample.addEventListener("click", setSample);
els.export.addEventListener("click", exportCsv);
els.exportProcess.addEventListener("click", exportProcess);
els.exportTxt.addEventListener("click", exportTxt);
els.importFile.addEventListener("change", () => {
  const [file] = els.importFile.files;
  if (file) importCsv(file);
  els.importFile.value = "";
});
els.newProject.addEventListener("click", () => {
  const name = normalizeProjectName(window.prompt("Nombre del nuevo levantamiento:", "Nuevo levantamiento"));
  state = createBlankState(name);
  syncControls();
  update();
  saveNamedProject();
});
els.saveProject.addEventListener("click", () => {
  state.projectName = normalizeProjectName(window.prompt("Guardar levantamiento como:", state.projectName) || state.projectName);
  syncControls();
  saveNamedProject();
});
els.projectList.addEventListener("change", () => {
  const name = els.projectList.value;
  const projects = loadProjects();
  if (!name || !projects[name]) return;
  state = { ...createBlankState(name), ...projects[name] };
  syncControls();
  update();
});
els.loadProject.addEventListener("click", () => {
  const name = els.projectList.value;
  const projects = loadProjects();
  if (!name || !projects[name]) return;
  state = { ...createBlankState(name), ...projects[name] };
  syncControls();
  update();
});
els.deleteProject.addEventListener("click", () => {
  const name = els.projectList.value;
  if (!name) return;
  const projects = loadProjects();
  if (!projects[name]) return;
  if (!window.confirm(`Eliminar "${name}" de los guardados?`)) return;
  delete projects[name];
  writeProjects(projects);
  if (state.projectName === name) state = createBlankState();
  syncControls();
  update();
});

window.addEventListener("resize", () => drawPlot(computePoints()));
load();

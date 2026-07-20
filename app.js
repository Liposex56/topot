const STORAGE_KEY = "levantamientos-topograficos-v1";
const PROJECTS_KEY = "levantamientos-topograficos-projects-v1";
const CURRENT_PROJECT_KEY = "levantamientos-topograficos-current-project-v1";
const HISTORY_LIMIT = 60;
const ZONE_COLORS = ["#0b6b5d", "#2962a3", "#d36b22", "#6d7378", "#8a4f9e", "#b13f4b"];
const PAPER_FORMATS = {
  A1: { width: 594, height: 841 },
  A2: { width: 420, height: 594 },
  A3: { width: 297, height: 420 },
  A4: { width: 210, height: 297 },
};
const DRAWING_SCALES = [50, 100, 200, 250, 500, 1000, 2000, 2500, 5000, 10000];
const PAPER_MARGIN_MM = 10;
const TITLE_BLOCK_MM = 35;

const els = {
  stationEast: document.querySelector("#stationEast"),
  stationNorth: document.querySelector("#stationNorth"),
  showLines: document.querySelector("#showLines"),
  showGrid: document.querySelector("#showGrid"),
  showZoneNames: document.querySelector("#showZoneNames"),
  body: document.querySelector("#observationsBody"),
  rowTemplate: document.querySelector("#rowTemplate"),
  canvas: document.querySelector("#plotCanvas"),
  canvasWrap: document.querySelector("#canvasWrap"),
  addRow: document.querySelector("#addRowBtn"),
  fit: document.querySelector("#fitBtn"),
  center: document.querySelector("#centerBtn"),
  zoomIn: document.querySelector("#zoomInBtn"),
  zoomOut: document.querySelector("#zoomOutBtn"),
  sample: document.querySelector("#sampleBtn"),
  exportCsv: document.querySelector("#exportBtn"),
  exportProcess: document.querySelector("#exportProcessBtn"),
  exportTxt: document.querySelector("#exportTxtBtn"),
  exportImage: document.querySelector("#exportImageBtn"),
  printReport: document.querySelector("#printReportBtn"),
  importFile: document.querySelector("#importFile"),
  newProject: document.querySelector("#newProjectBtn"),
  saveProject: document.querySelector("#saveProjectBtn"),
  openProject: document.querySelector("#openProjectBtn"),
  undo: document.querySelector("#undoBtn"),
  redo: document.querySelector("#redoBtn"),
  projectName: document.querySelector("#projectName"),
  projectList: document.querySelector("#projectList"),
  deleteProject: document.querySelector("#deleteProjectBtn"),
  saveState: document.querySelector("#saveState"),
  pointsCount: document.querySelector("#pointsCount"),
  areaValue: document.querySelector("#areaValue"),
  perimeterValue: document.querySelector("#perimeterValue"),
  measureLabel: document.querySelector("#measureLabel"),
  lastPoint: document.querySelector("#lastPoint"),
  axisDecimals: document.querySelector("#axisDecimals"),
  zonesList: document.querySelector("#zonesList"),
  addZone: document.querySelector("#addZoneBtn"),
  activeZone: document.querySelector("#activeZoneSelect"),
  activeZoneName: document.querySelector("#activeZoneName"),
  activeZoneColor: document.querySelector("#activeZoneColor"),
  activeZoneType: document.querySelector("#activeZoneType"),
  sidebar: document.querySelector("#appSidebar"),
  sidebarBackdrop: document.querySelector("#sidebarBackdrop"),
  sidebarToggle: document.querySelector("#sidebarToggleBtn"),
  navButtons: [...document.querySelectorAll(".nav-button[data-view]")],
  mobileNavButtons: [...document.querySelectorAll(".mobile-nav-button[data-view]")],
  viewPanels: [...document.querySelectorAll("[data-view-panel]")],
  viewTargets: [...document.querySelectorAll("[data-view-target]")],
  mobileMore: document.querySelector("#mobileMoreBtn"),
  quickAddPoint: document.querySelector("#quickAddPointBtn"),
  quickSelectPoint: document.querySelector("#quickSelectPointBtn"),
  quickMovePoint: document.querySelector("#quickMovePointBtn"),
  quickClearPoint: document.querySelector("#quickClearPointBtn"),
  quickMeasure: document.querySelector("#quickMeasureBtn"),
  quickPoints: document.querySelector("#quickPointsBtn"),
  quickLines: document.querySelector("#quickLinesBtn"),
  quickGrid: document.querySelector("#quickGridBtn"),
  selectedPointStatus: document.querySelector("#selectedPointStatus"),
  paperFormat: document.querySelector("#paperFormatSelect"),
  paperOrientation: document.querySelector("#paperOrientationSelect"),
  drawingScaleMode: document.querySelector("#drawingScaleModeSelect"),
  drawingScale: document.querySelector("#drawingScaleSelect"),
  drawingScaleInfo: document.querySelector("#drawingScaleInfo"),
  distanceHeader: document.querySelector("#distanceHeader"),
  pointSearch: document.querySelector("#pointSearch"),
  pointZoneFilter: document.querySelector("#pointZoneFilter"),
  pointStatusFilter: document.querySelector("#pointStatusFilter"),
  clearPointFilters: document.querySelector("#clearPointFiltersBtn"),
  pointsEmptyState: document.querySelector("#pointsEmptyState"),
  calculationZoneFilter: document.querySelector("#calculationZoneFilter"),
  calculationPointFilter: document.querySelector("#calculationPointFilter"),
  calculationsContent: document.querySelector("#calculationsContent"),
  projectsViewList: document.querySelector("#projectsViewList"),
  duplicateProject: document.querySelector("#duplicateProjectBtn"),
  units: document.querySelector("#unitsSelect"),
  gridSize: document.querySelector("#gridSizeSelect"),
  appearance: document.querySelector("#appearanceSelect"),
  showPointNumbers: document.querySelector("#showPointNumbers"),
  autoClosePolygons: document.querySelector("#autoClosePolygons"),
  pointDialog: document.querySelector("#pointDialog"),
  pointForm: document.querySelector("#pointForm"),
  pointDialogTitle: document.querySelector("#pointDialogTitle"),
  pointNumber: document.querySelector("#pointNumber"),
  pointZone: document.querySelector("#pointZone"),
  pointDegrees: document.querySelector("#pointDegrees"),
  pointMinutes: document.querySelector("#pointMinutes"),
  pointSeconds: document.querySelector("#pointSeconds"),
  pointDistance: document.querySelector("#pointDistance"),
  pointDescription: document.querySelector("#pointDescription"),
  pointAddAnother: document.querySelector("#pointAddAnother"),
  pointAddAnotherField: document.querySelector("#pointAddAnotherField"),
  cancelPoint: document.querySelector("#cancelPointBtn"),
  dismissPoint: document.querySelector("#dismissPointBtn"),
  newProjectDialog: document.querySelector("#newProjectDialog"),
  newProjectForm: document.querySelector("#newProjectForm"),
  newProjectName: document.querySelector("#newProjectName"),
  newProjectEast: document.querySelector("#newProjectEast"),
  newProjectNorth: document.querySelector("#newProjectNorth"),
  cancelNewProject: document.querySelector("#cancelNewProjectBtn"),
  dismissNewProject: document.querySelector("#dismissNewProjectBtn"),
  zoneDialog: document.querySelector("#zoneDialog"),
  zoneForm: document.querySelector("#zoneForm"),
  zoneDialogTitle: document.querySelector("#zoneDialogTitle"),
  zoneName: document.querySelector("#zoneName"),
  zoneColor: document.querySelector("#zoneColor"),
  zoneType: document.querySelector("#zoneType"),
  zoneDescription: document.querySelector("#zoneDescription"),
  zoneReferenceType: document.querySelector("#zoneReferenceType"),
  zoneReferencePoint: document.querySelector("#zoneReferencePoint"),
  zoneReferenceEast: document.querySelector("#zoneReferenceEast"),
  zoneReferenceNorth: document.querySelector("#zoneReferenceNorth"),
  referencePointField: document.querySelector("#referencePointField"),
  customReferenceFields: document.querySelector("#customReferenceFields"),
  cancelZone: document.querySelector("#cancelZoneBtn"),
  dismissZone: document.querySelector("#dismissZoneBtn"),
  toast: document.querySelector("#toast"),
};

let state;
let loadedProjectName = null;
let editingZoneId = null;
let editingPointIndex = null;
let activeView = "plan";
let selectedPointUid = null;
let quickMode = null;
let measurePointUids = [];
let plotTransform = null;
let dragState = null;
const undoStack = [];
const redoStack = [];

function makeId(prefix) {
  if (globalThis.crypto?.randomUUID) return `${prefix}-${crypto.randomUUID()}`;
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function clone(value) {
  return structuredClone(value);
}

function createZone(overrides = {}) {
  const type = ["polygon", "line", "points"].includes(overrides.type) ? overrides.type : "polygon";
  return {
    id: overrides.id || makeId("zone"),
    name: String(overrides.name || "Zona principal").trim() || "Zona principal",
    color: /^#[0-9a-f]{6}$/i.test(overrides.color || "") ? overrides.color : ZONE_COLORS[0],
    type,
    description: String(overrides.description || ""),
    visible: overrides.visible !== false,
    closed: type === "polygon" ? overrides.closed !== false : false,
    reference: {
      type: ["station", "point", "custom"].includes(overrides.reference?.type)
        ? overrides.reference.type
        : "station",
      pointUid: String(overrides.reference?.pointUid || ""),
      east: toNumber(overrides.reference?.east),
      north: toNumber(overrides.reference?.north),
    },
  };
}

function defaultObservation(index, zoneId) {
  return {
    uid: makeId("point"),
    zoneId,
    id: String(index),
    degrees: 0,
    minutes: 0,
    seconds: 0,
    distance: 0,
    description: "",
  };
}

function createBlankState(projectName = "Levantamiento sin nombre") {
  const mainZone = createZone({ id: makeId("zone"), name: "Zona principal", color: ZONE_COLORS[0] });
  return {
    version: 2,
    projectName,
    modifiedAt: new Date().toISOString(),
    station: { east: 1000, north: 1000 },
    mode: "radiacion",
    showPoints: true,
    showLines: true,
    showGrid: true,
    showZoneNames: true,
    showPointNumbers: true,
    autoClosePolygons: true,
    units: "m",
    gridSize: 0,
    appearance: "dark",
    axisDecimals: 0,
    view: { zoom: 1, panEast: 0, panNorth: 0 },
    drawingScale: { paper: "A3", orientation: "horizontal", mode: "auto", denominator: 500 },
    zones: [mainZone],
    activeZoneId: mainZone.id,
    observations: [defaultObservation(1, mainZone.id)],
  };
}

function migrateState(rawState) {
  const raw = rawState && typeof rawState === "object" ? rawState : {};
  const fallback = createBlankState(normalizeProjectName(raw.projectName));
  const hasZones = Array.isArray(raw.zones) && raw.zones.length > 0;
  const zones = hasZones
    ? raw.zones.map((zone, index) => createZone({ ...zone, color: zone.color || ZONE_COLORS[index % ZONE_COLORS.length] }))
    : [
        createZone({
          id: "zone-main-migrated",
          name: "Zona principal",
          color: ZONE_COLORS[0],
          type: "polygon",
          closed: raw.closePolygon !== false,
        }),
      ];
  const zoneIds = new Set(zones.map((zone) => zone.id));
  const defaultZoneId = zones[0].id;
  const sourceObservations = Array.isArray(raw.observations) && raw.observations.length
    ? raw.observations
    : [defaultObservation(1, defaultZoneId)];
  const observations = sourceObservations.map((observation, index) => ({
    ...defaultObservation(index + 1, defaultZoneId),
    ...observation,
    uid: observation.uid || makeId("point"),
    zoneId: zoneIds.has(observation.zoneId) ? observation.zoneId : defaultZoneId,
    id: observation.id === 0 ? "" : String(observation.id ?? index + 1),
    description: String(observation.description || ""),
  }));
  const activeZoneId = zoneIds.has(raw.activeZoneId) ? raw.activeZoneId : defaultZoneId;

  return {
    ...fallback,
    version: 2,
    projectName: normalizeProjectName(raw.projectName),
    modifiedAt: typeof raw.modifiedAt === "string" ? raw.modifiedAt : fallback.modifiedAt,
    station: {
      east: toNumber(raw.station?.east ?? fallback.station.east),
      north: toNumber(raw.station?.north ?? fallback.station.north),
    },
    mode: raw.mode === "poligonal" ? "poligonal" : "radiacion",
    showPoints: raw.showPoints !== false,
    showLines: raw.showLines !== false,
    showGrid: raw.showGrid !== false,
    showZoneNames: raw.showZoneNames !== false,
    showPointNumbers: raw.showPointNumbers !== false,
    autoClosePolygons: raw.autoClosePolygons !== false,
    units: raw.units === "ft" ? "ft" : "m",
    gridSize: [0, 1, 5, 10, 25, 50, 100].includes(Number(raw.gridSize)) ? Number(raw.gridSize) : 0,
    appearance: raw.appearance === "light" ? "light" : "dark",
    axisDecimals: Math.min(3, Math.max(0, Number.parseInt(raw.axisDecimals, 10) || 0)),
    view: {
      zoom: clampNumber(raw.view?.zoom || 1, 0.5, 20),
      panEast: toNumber(raw.view?.panEast),
      panNorth: toNumber(raw.view?.panNorth),
    },
    drawingScale: {
      paper: PAPER_FORMATS[raw.drawingScale?.paper] ? raw.drawingScale.paper : fallback.drawingScale.paper,
      orientation: raw.drawingScale?.orientation === "vertical" ? "vertical" : "horizontal",
      mode: raw.drawingScale?.mode === "manual" ? "manual" : "auto",
      denominator: DRAWING_SCALES.includes(Number(raw.drawingScale?.denominator))
        ? Number(raw.drawingScale.denominator)
        : fallback.drawingScale.denominator,
    },
    zones,
    activeZoneId,
    observations,
  };
}

function toNumber(value) {
  const parsed = Number.parseFloat(String(value));
  return Number.isFinite(parsed) ? parsed : 0;
}

function clampNumber(value, min, max) {
  return Math.min(max, Math.max(min, toNumber(value)));
}

function normalizeProjectName(name) {
  return String(name || "").trim() || "Levantamiento sin nombre";
}

function normalizeObservation(observation) {
  const normalized = { ...observation };
  normalized.id = String(normalized.id ?? "").trim();
  normalized.degrees = clampNumber(normalized.degrees, 0, 360);
  if (normalized.degrees >= 360) {
    normalized.degrees = 360;
    normalized.minutes = 0;
    normalized.seconds = 0;
  } else {
    normalized.minutes = Math.trunc(clampNumber(normalized.minutes, 0, 59));
    normalized.seconds = clampNumber(normalized.seconds, 0, 59.999);
  }
  normalized.distance = Math.max(0, toNumber(normalized.distance));
  normalized.description = String(normalized.description || "");
  return normalized;
}

function isPositiveInteger(value) {
  return /^\d+$/.test(String(value)) && Number(value) > 0;
}

function hasMeasurementData(observation) {
  return (
    toNumber(observation.distance) > 0 ||
    toNumber(observation.degrees) !== 0 ||
    toNumber(observation.minutes) !== 0 ||
    toNumber(observation.seconds) !== 0 ||
    String(observation.description || "").trim() !== ""
  );
}

function dmsToDecimal({ degrees, minutes, seconds }) {
  return toNumber(degrees) + toNumber(minutes) / 60 + toNumber(seconds) / 3600;
}

function decimalToDms(value) {
  const normalized = ((value % 360) + 360) % 360;
  let degrees = Math.floor(normalized);
  const minuteFloat = (normalized - degrees) * 60;
  let minutes = Math.floor(minuteFloat);
  let seconds = Math.round((minuteFloat - minutes) * 60000) / 1000;
  if (seconds >= 60) {
    seconds = 0;
    minutes += 1;
  }
  if (minutes >= 60) {
    minutes = 0;
    degrees = (degrees + 1) % 360;
  }
  return { degrees, minutes, seconds };
}

function formatDms(value) {
  const dms = decimalToDms(value);
  return `${dms.degrees}\u00b0 ${String(dms.minutes).padStart(2, "0")}' ${dms.seconds.toFixed(3).padStart(6, "0")}"`;
}

function bearingFromAzimuth(azimuth) {
  const angle = ((azimuth % 360) + 360) % 360;
  if (angle <= 90) return `N ${formatDms(angle)} E`;
  if (angle <= 180) return `S ${formatDms(180 - angle)} E`;
  if (angle <= 270) return `S ${formatDms(angle - 180)} O`;
  return `N ${formatDms(360 - angle)} O`;
}

function buildInputErrors() {
  const errors = state.observations.map(() => ({ id: [], minutes: [], seconds: [], general: [] }));

  state.observations.forEach((observation, index) => {
    const hasData = hasMeasurementData(observation);
    if (hasData && !isPositiveInteger(observation.id)) {
      errors[index].id.push("Ingrese un número entero positivo.");
    }
    if (toNumber(observation.minutes) < 0 || toNumber(observation.minutes) >= 60) {
      errors[index].minutes.push("Los minutos deben estar entre 0 y 59.");
    }
    if (toNumber(observation.seconds) < 0 || toNumber(observation.seconds) >= 60) {
      errors[index].seconds.push("Los segundos deben ser menores que 60.");
    }
    if (toNumber(observation.degrees) < 0 || toNumber(observation.degrees) > 360) {
      errors[index].general.push("Los grados deben estar entre 0 y 360.");
    }
    if (toNumber(observation.degrees) === 360 && (toNumber(observation.minutes) !== 0 || toNumber(observation.seconds) !== 0)) {
      errors[index].general.push("Con 360 grados, minutos y segundos deben ser 0.");
    }
    if (hasData && toNumber(observation.distance) <= 0) {
      errors[index].general.push("Falta una distancia mayor que 0.");
    }
  });

  state.zones.forEach((zone) => {
    const zoneIndexes = state.observations
      .map((observation, index) => ({ observation, index }))
      .filter((item) => item.observation.zoneId === zone.id && hasMeasurementData(item.observation));
    const occurrences = new Map();
    zoneIndexes.forEach(({ observation, index }) => {
      if (!isPositiveInteger(observation.id)) return;
      const number = Number(observation.id);
      if (!occurrences.has(number)) occurrences.set(number, []);
      occurrences.get(number).push(index);
    });
    occurrences.forEach((indexes) => {
      if (indexes.length < 2) return;
      indexes.forEach((index) => errors[index].id.push("Número repetido dentro de esta zona."));
    });
    zoneIndexes.forEach(({ observation, index }, position) => {
      if (!isPositiveInteger(observation.id)) return;
      const value = Number(observation.id);
      const previous = zoneIndexes[position - 1]?.observation;
      const next = zoneIndexes[position + 1]?.observation;
      if (previous && isPositiveInteger(previous.id) && value <= Number(previous.id)) {
        errors[index].id.push("Debe ser mayor que el punto anterior.");
      }
      if (next && isPositiveInteger(next.id) && value >= Number(next.id)) {
        errors[index].id.push("Debe ser menor que el punto siguiente.");
      }
    });
  });

  return errors;
}

function resolveZoneBase(zone, computedByUid) {
  const station = { east: toNumber(state.station.east), north: toNumber(state.station.north) };
  if (state.mode !== "poligonal" || zone.reference.type === "station") {
    return { ...station, referenceValid: true };
  }
  if (zone.reference.type === "custom") {
    return {
      east: toNumber(zone.reference.east),
      north: toNumber(zone.reference.north),
      referenceValid: true,
    };
  }
  const referencePoint = computedByUid.get(zone.reference.pointUid);
  if (referencePoint?.hasCoordinates) {
    return { east: referencePoint.east, north: referencePoint.north, referenceValid: true };
  }
  return { ...station, referenceValid: false };
}

function computeSurvey() {
  const rowErrors = buildInputErrors();
  const points = [];
  const computedByUid = new Map();
  const runtimes = new Map();
  const zonesById = new Map(state.zones.map((zone) => [zone.id, zone]));

  state.observations.forEach((observation, rowIndex) => {
    const zone = zonesById.get(observation.zoneId) || state.zones[0];
    if (!runtimes.has(zone.id)) {
      const base = resolveZoneBase(zone, computedByUid);
      runtimes.set(zone.id, {
        base,
        cursor: { east: base.east, north: base.north },
        started: false,
        breakNext: false,
      });
    }
    const runtime = runtimes.get(zone.id);
    const normalized = normalizeObservation(observation);
    const angleValid =
      toNumber(observation.degrees) >= 0 &&
      toNumber(observation.degrees) <= 360 &&
      toNumber(observation.minutes) >= 0 &&
      toNumber(observation.minutes) < 60 &&
      toNumber(observation.seconds) >= 0 &&
      toNumber(observation.seconds) < 60 &&
      !(toNumber(observation.degrees) === 360 && (toNumber(observation.minutes) !== 0 || toNumber(observation.seconds) !== 0));
    const hasCoordinates = toNumber(observation.distance) > 0 && angleValid;
    const azimuth = dmsToDecimal(normalized);
    const radians = (azimuth * Math.PI) / 180;
    const distance = Math.max(0, toNumber(normalized.distance));
    const deltaEast = distance * Math.sin(radians);
    const deltaNorth = distance * Math.cos(radians);
    const base = state.mode === "poligonal" ? runtime.cursor : runtime.base;
    const point = {
      uid: observation.uid,
      id: String(observation.id || ""),
      zoneId: zone.id,
      rowIndex,
      azimuth,
      radians,
      distance,
      deltaEast,
      deltaNorth,
      east: base.east + deltaEast,
      north: base.north + deltaNorth,
      bearing: bearingFromAzimuth(azimuth),
      description: String(observation.description || ""),
      source: normalized,
      hasCoordinates,
      hasData: hasMeasurementData(observation),
      breakBefore: hasCoordinates && runtime.breakNext,
      referenceValid: runtime.base.referenceValid,
      status: "Incompleto",
    };

    if (!runtime.base.referenceValid) {
      rowErrors[rowIndex].general.push("El punto de referencia de la zona no está disponible.");
    }
    if (hasCoordinates) {
      runtime.started = true;
      runtime.breakNext = false;
      if (state.mode === "poligonal") runtime.cursor = { east: point.east, north: point.north };
      computedByUid.set(point.uid, point);
    } else if (runtime.started) {
      runtime.breakNext = true;
    }
    points.push(point);
  });

  const analyses = new Map();
  state.zones.forEach((zone) => {
    const zoneRows = state.observations
      .map((observation, index) => ({ observation, index, point: points[index] }))
      .filter((item) => item.observation.zoneId === zone.id);
    const zonePoints = zoneRows.filter((item) => item.point.hasCoordinates).map((item) => item.point);

    const coordinateGroups = new Map();
    zonePoints.forEach((point) => {
      const key = `${point.east.toFixed(6)}|${point.north.toFixed(6)}`;
      if (!coordinateGroups.has(key)) coordinateGroups.set(key, []);
      coordinateGroups.get(key).push(point);
    });
    let duplicateCoordinates = false;
    coordinateGroups.forEach((group) => {
      if (group.length < 2) return;
      duplicateCoordinates = true;
      group.forEach((point) => rowErrors[point.rowIndex].general.push("Coordenada duplicada dentro de esta zona."));
    });

    const validPositions = zoneRows
      .map((item, position) => (item.point.hasCoordinates ? position : -1))
      .filter((position) => position >= 0);
    const firstValid = validPositions[0] ?? -1;
    const lastValid = validPositions.at(-1) ?? -1;
    const hasGap = firstValid >= 0 && zoneRows.some((item, position) => position > firstValid && position < lastValid && !item.point.hasCoordinates);
    const hasIncompleteRows = zoneRows.some((item) => !item.point.hasCoordinates);
    const segments = buildSegments(zonePoints);
    const crossed = zone.type === "polygon" && zone.closed && zonePoints.length >= 4 && !hasGap
      ? polygonHasCrossings(zonePoints)
      : false;
    if (crossed) {
      zonePoints.forEach((point) => rowErrors[point.rowIndex].general.push("La figura presenta líneas cruzadas."));
    }

    const hasRowErrors = zoneRows.some(({ index }) => Object.values(rowErrors[index]).some((messages) => messages.length));
    const enoughPoints =
      (zone.type === "polygon" && zonePoints.length >= 3) ||
      (zone.type === "line" && zonePoints.length >= 2) ||
      (zone.type === "points" && zonePoints.length >= 1);
    let status = "Pendiente de completar";
    let statusClass = "status-incomplete";
    if (!zoneRows.length || !zonePoints.length) {
      status = "Abierta";
      statusClass = "status-open";
    } else if (crossed || duplicateCoordinates || hasRowErrors) {
      status = "Con errores";
      statusClass = "status-error";
    } else if (hasGap || hasIncompleteRows || !enoughPoints) {
      status = "Pendiente de completar";
      statusClass = "status-incomplete";
    } else if (zone.type === "polygon" && !zone.closed) {
      status = "Abierta";
      statusClass = "status-open";
    } else {
      status = "Completa";
      statusClass = "status-ok";
    }

    const complete = status === "Completa";
    const area = zone.type === "polygon" && complete ? polygonArea(zonePoints) : 0;
    let measure = 0;
    if (zone.type === "polygon" && complete) measure = perimeter(zonePoints, true);
    if (zone.type === "line" && complete) measure = segments.reduce((sum, segment) => sum + perimeter(segment, false), 0);

    analyses.set(zone.id, {
      zone,
      rows: zoneRows,
      points: zonePoints,
      segments,
      count: zonePoints.length,
      area,
      measure,
      status,
      statusClass,
      complete,
      crossed,
      hasGap,
      duplicateCoordinates,
    });
  });

  points.forEach((point) => {
    const errors = rowErrors[point.rowIndex];
    if (!point.hasCoordinates) point.status = "Incompleto";
    else if (errors.id.some((message) => message.includes("repetido"))) point.status = "Número repetido";
    else if (errors.id.length) point.status = "Fuera de secuencia";
    else if (errors.general.some((message) => message.includes("Coordenada duplicada"))) point.status = "Coordenada duplicada";
    else if (errors.general.some((message) => message.includes("líneas cruzadas"))) point.status = "Figura cruzada";
    else if (Object.values(errors).some((messages) => messages.length)) point.status = "Incompleto";
    else point.status = "Correcto";
  });

  return { points, analyses, rowErrors };
}

function buildSegments(points) {
  const segments = [];
  let current = [];
  points.forEach((point) => {
    if (point.breakBefore && current.length) {
      segments.push(current);
      current = [];
    }
    current.push(point);
  });
  if (current.length) segments.push(current);
  return segments;
}

function polygonArea(points) {
  if (points.length < 3) return 0;
  let sum = 0;
  for (let index = 0; index < points.length; index += 1) {
    const a = points[index];
    const b = points[(index + 1) % points.length];
    sum += a.east * b.north - b.east * a.north;
  }
  return Math.abs(sum) / 2;
}

function perimeter(points, close) {
  if (points.length < 2) return 0;
  let total = 0;
  for (let index = 1; index < points.length; index += 1) {
    total += Math.hypot(points[index].east - points[index - 1].east, points[index].north - points[index - 1].north);
  }
  if (close && points.length > 2) {
    total += Math.hypot(points[0].east - points.at(-1).east, points[0].north - points.at(-1).north);
  }
  return total;
}

function polygonHasCrossings(points) {
  const edges = points.map((point, index) => [point, points[(index + 1) % points.length]]);
  for (let first = 0; first < edges.length; first += 1) {
    for (let second = first + 1; second < edges.length; second += 1) {
      const adjacent = second === first + 1 || (first === 0 && second === edges.length - 1);
      if (adjacent) continue;
      if (segmentsIntersect(edges[first][0], edges[first][1], edges[second][0], edges[second][1])) return true;
    }
  }
  return false;
}

function segmentsIntersect(a, b, c, d) {
  const orientation = (p, q, r) => {
    const value = (q.north - p.north) * (r.east - q.east) - (q.east - p.east) * (r.north - q.north);
    if (Math.abs(value) < 1e-9) return 0;
    return value > 0 ? 1 : 2;
  };
  const onSegment = (p, q, r) =>
    q.east <= Math.max(p.east, r.east) + 1e-9 &&
    q.east + 1e-9 >= Math.min(p.east, r.east) &&
    q.north <= Math.max(p.north, r.north) + 1e-9 &&
    q.north + 1e-9 >= Math.min(p.north, r.north);
  const o1 = orientation(a, b, c);
  const o2 = orientation(a, b, d);
  const o3 = orientation(c, d, a);
  const o4 = orientation(c, d, b);
  if (o1 !== o2 && o3 !== o4) return true;
  if (o1 === 0 && onSegment(a, c, b)) return true;
  if (o2 === 0 && onSegment(a, d, b)) return true;
  if (o3 === 0 && onSegment(c, a, d)) return true;
  if (o4 === 0 && onSegment(c, b, d)) return true;
  return false;
}

function formatNumber(value, decimals = 3) {
  return new Intl.NumberFormat("en-US", {
    useGrouping: false,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(Number.isFinite(value) ? value : 0);
}

function formatCoordinate(value) {
  return new Intl.NumberFormat("en-US", {
    useGrouping: false,
    minimumFractionDigits: 0,
    maximumFractionDigits: 3,
  }).format(Number.isFinite(value) ? value : 0);
}

function formatPlainNumber(value, decimals = 3) {
  if (decimals === 0) return String(Math.round(Number(value || 0)));
  return Number(value || 0).toFixed(decimals).replace(/\.?0+$/, "");
}

function zoneTypeLabel(type) {
  if (type === "line") return "Línea";
  if (type === "points") return "Puntos independientes";
  return "Polígono";
}

function nextPointNumber(zoneId) {
  const numbers = state.observations
    .filter((observation) => observation.zoneId === zoneId && hasMeasurementData(observation) && isPositiveInteger(observation.id))
    .map((observation) => Number(observation.id));
  return numbers.length ? Math.max(...numbers) + 1 : 1;
}

function unitSymbol() {
  return state.units === "ft" ? "ft" : "m";
}

function areaUnitSymbol() {
  return `${unitSymbol()}\u00b2`;
}

function fillPointZoneOptions(selectedZoneId) {
  els.pointZone.innerHTML = "";
  state.zones.forEach((zone) => {
    const option = document.createElement("option");
    option.value = zone.id;
    option.textContent = zone.name;
    option.selected = zone.id === selectedZoneId;
    els.pointZone.appendChild(option);
  });
}

function openPointDialog(index = null) {
  if (!state.zones.length) {
    showToast("Cree una zona antes de agregar puntos.", true);
    return;
  }
  editingPointIndex = Number.isInteger(index) ? index : null;
  const source = editingPointIndex === null
    ? defaultObservation(nextPointNumber(state.activeZoneId), state.activeZoneId)
    : state.observations[editingPointIndex];
  if (!source) return;
  els.pointDialogTitle.textContent = editingPointIndex === null ? "Agregar punto" : `Editar punto ${source.id || ""}`;
  fillPointZoneOptions(source.zoneId);
  els.pointNumber.value = source.id ?? "";
  els.pointDegrees.value = source.degrees ?? 0;
  els.pointMinutes.value = source.minutes ?? 0;
  els.pointSeconds.value = source.seconds ?? 0;
  const lockedAtFullTurn = Number(source.degrees) === 360;
  els.pointMinutes.disabled = lockedAtFullTurn;
  els.pointSeconds.disabled = lockedAtFullTurn;
  els.pointDistance.value = source.distance ?? 0;
  els.pointDescription.value = source.description ?? "";
  els.pointAddAnother.checked = false;
  els.pointAddAnotherField.classList.toggle("is-hidden", editingPointIndex !== null);
  els.pointDialog.showModal();
  window.setTimeout(() => {
    els.pointDegrees.focus();
    els.pointDegrees.select();
  }, 0);
}

function savePointFromDialog() {
  const id = els.pointNumber.value.replace(/[^0-9]/g, "");
  const degrees = Number(els.pointDegrees.value);
  const minutes = Number(els.pointMinutes.value);
  const seconds = Number(els.pointSeconds.value);
  const distance = Number(els.pointDistance.value);
  if (!isPositiveInteger(id)) return showToast("El n\u00famero del punto debe ser un entero positivo.", true);
  if (!Number.isFinite(degrees) || degrees < 0 || degrees > 360) return showToast("Los grados deben estar entre 0 y 360.", true);
  if (!Number.isFinite(minutes) || minutes < 0 || minutes >= 60) return showToast("Los minutos deben ser menores que 60.", true);
  if (!Number.isFinite(seconds) || seconds < 0 || seconds >= 60) return showToast("Los segundos deben ser menores que 60.", true);
  if (degrees === 360 && (minutes !== 0 || seconds !== 0)) return showToast("Con 360 grados, minutos y segundos deben ser 0.", true);
  if (!Number.isFinite(distance) || distance <= 0) return showToast("La distancia debe ser mayor que 0.", true);
  const reusableIndex = editingPointIndex === null
    ? state.observations.findIndex((observation) =>
        observation.zoneId === els.pointZone.value && !hasMeasurementData(observation) && Number(observation.id) === Number(id)
      )
    : editingPointIndex;
  const duplicate = state.observations.some((observation, index) =>
    index !== reusableIndex && observation.zoneId === els.pointZone.value && Number(observation.id) === Number(id) && hasMeasurementData(observation)
  );
  if (duplicate) return showToast("Ese n\u00famero de punto ya existe dentro de la zona.", true);

  pushHistory();
  const previous = reusableIndex >= 0 ? state.observations[reusableIndex] : null;
  const point = normalizeObservation({
    ...defaultObservation(id, els.pointZone.value),
    uid: previous?.uid || makeId("point"),
    zoneId: els.pointZone.value,
    id,
    degrees,
    minutes,
    seconds,
    distance,
    description: els.pointDescription.value.trim(),
  });
  if (reusableIndex < 0) state.observations.push(point);
  else state.observations[reusableIndex] = point;
  selectedPointUid = point.uid;
  const addAnother = editingPointIndex === null && els.pointAddAnother.checked;
  update(true);
  if (addAnother) {
    editingPointIndex = null;
    els.pointNumber.value = String(nextPointNumber(point.zoneId));
    els.pointDegrees.value = "0";
    els.pointMinutes.value = "0";
    els.pointSeconds.value = "0";
    els.pointMinutes.disabled = false;
    els.pointSeconds.disabled = false;
    els.pointDistance.value = "";
    els.pointDescription.value = "";
    els.pointDegrees.focus();
    showToast("Punto guardado. Puede ingresar el siguiente.");
  } else {
    els.pointDialog.close();
    showToast(editingPointIndex !== null ? "Punto actualizado correctamente." : "Punto agregado correctamente.");
  }
}

function renderRows(survey) {
  els.body.innerHTML = "";
  state.observations.forEach((observation, index) => {
    const row = els.rowTemplate.content.firstElementChild.cloneNode(true);
    row.dataset.index = String(index);
    row.dataset.zoneId = observation.zoneId;
    row.dataset.pointId = String(observation.id || "");
    row.dataset.status = survey.points[index].status;
    row.dataset.search = `${observation.id || ""} ${observation.description || ""}`.toLocaleLowerCase("es");
    const zoneSelect = row.querySelector('[data-field="zoneId"]');
    state.zones.forEach((zone) => {
      const option = document.createElement("option");
      option.value = zone.id;
      option.textContent = zone.name;
      option.selected = zone.id === observation.zoneId;
      zoneSelect.appendChild(option);
    });
    zoneSelect.addEventListener("focus", rememberInputState);
    zoneSelect.addEventListener("change", () => {
      pushHistory();
      observation.zoneId = zoneSelect.value;
      if (!isPositiveInteger(observation.id)) observation.id = String(nextPointNumber(observation.zoneId));
      update(true);
    });

    row.querySelectorAll("input[data-field]").forEach((input) => {
      const field = input.dataset.field;
      input.value = observation[field] ?? "";
      input.addEventListener("focus", rememberInputState);
      input.addEventListener("input", () => handleObservationInput(index, input));
      input.addEventListener("blur", () => {
        state.observations[index] = normalizeObservation(state.observations[index]);
        update(false);
      });
    });

    wireRowActions(row, index);
    applyRowOutputs(row, survey, index);
    row.addEventListener("dblclick", (event) => {
      if (event.target.closest("button, input, select")) return;
      openPointDialog(index);
    });
    els.body.appendChild(row);
  });
  applyPointFilters();
}

function applyPointFilters() {
  const search = els.pointSearch.value.trim().toLocaleLowerCase("es");
  const zoneId = els.pointZoneFilter.value;
  const status = els.pointStatusFilter.value;
  let visible = 0;
  els.body.querySelectorAll("tr").forEach((row) => {
    const matches = (!search || row.dataset.search.includes(search)) &&
      (!zoneId || row.dataset.zoneId === zoneId) &&
      (!status || row.dataset.status === status);
    row.hidden = !matches;
    if (matches) visible += 1;
  });
  els.pointsEmptyState.classList.toggle("is-hidden", visible > 0);
}

function rememberInputState(event) {
  event.currentTarget.dataset.historySaved = "true";
  pushHistory();
}

function handleObservationInput(index, input) {
  const field = input.dataset.field;
  const observation = state.observations[index];
  if (field === "id") {
    const cleaned = input.value.replace(/[^0-9]/g, "");
    if (cleaned !== input.value) input.value = cleaned;
    observation.id = cleaned;
  } else if (field === "description") {
    observation.description = input.value;
  } else {
    let value = input.value === "" ? "" : toNumber(input.value);
    if (field === "degrees" && value !== "") value = clampNumber(value, 0, 360);
    if (field === "minutes" && value !== "") value = Math.trunc(clampNumber(value, 0, 59));
    if (field === "seconds" && value !== "") value = clampNumber(value, 0, 59.999);
    if (field === "distance" && value !== "") value = Math.max(0, value);
    observation[field] = value;
    if (field === "degrees" && toNumber(value) === 360) {
      observation.minutes = 0;
      observation.seconds = 0;
    }
  }
  update(false);
}

function wireRowActions(row, index) {
  const observation = state.observations[index];
  const sameZoneIndexes = state.observations
    .map((item, itemIndex) => (item.zoneId === observation.zoneId ? itemIndex : -1))
    .filter((itemIndex) => itemIndex >= 0);
  const position = sameZoneIndexes.indexOf(index);
  const up = row.querySelector('[data-action="up"]');
  const down = row.querySelector('[data-action="down"]');
  up.disabled = position <= 0;
  down.disabled = position < 0 || position >= sameZoneIndexes.length - 1;
  up.addEventListener("click", () => moveObservation(index, -1));
  down.addEventListener("click", () => moveObservation(index, 1));
  const edit = document.createElement("button");
  edit.type = "button";
  edit.textContent = "\u270e";
  edit.title = "Editar punto";
  edit.setAttribute("aria-label", "Editar punto");
  edit.addEventListener("click", () => openPointDialog(index));
  row.querySelector(".row-actions").insertBefore(edit, row.querySelector('[data-action="delete"]'));
  row.querySelector('[data-action="delete"]').addEventListener("click", () => {
    pushHistory();
    state.observations[index] = {
      ...defaultObservation(observation.id || nextPointNumber(observation.zoneId), observation.zoneId),
      uid: observation.uid,
      id: observation.id,
    };
    update(true);
    showToast("Se limpiaron los valores del punto. Puede recuperarlos con Deshacer.");
  });
}

function moveObservation(index, direction) {
  const zoneId = state.observations[index].zoneId;
  const indexes = state.observations
    .map((observation, itemIndex) => (observation.zoneId === zoneId ? itemIndex : -1))
    .filter((itemIndex) => itemIndex >= 0);
  const position = indexes.indexOf(index);
  const targetIndex = indexes[position + direction];
  if (targetIndex === undefined) return;
  pushHistory();
  [state.observations[index], state.observations[targetIndex]] = [state.observations[targetIndex], state.observations[index]];
  renumberZone(zoneId);
  update(true);
  showToast("Puntos reordenados y numeración actualizada.");
}

function applyRowOutputs(row, survey, index) {
  const point = survey.points[index];
  const errors = survey.rowErrors[index];
  const observation = state.observations[index];
  row.dataset.zoneId = observation.zoneId;
  row.dataset.pointId = String(observation.id || "");
  row.dataset.status = point.status;
  row.dataset.search = `${observation.id || ""} ${observation.description || ""}`.toLocaleLowerCase("es");
  row.classList.toggle("row-error", Object.values(errors).some((messages) => messages.length));
  row.querySelectorAll("input[data-field]").forEach((input) => {
    if (document.activeElement !== input) input.value = observation[input.dataset.field] ?? "";
  });
  const zoneSelect = row.querySelector('[data-field="zoneId"]');
  if (zoneSelect && document.activeElement !== zoneSelect) zoneSelect.value = observation.zoneId;
  setOutput(row, "azimuth", point.hasCoordinates ? formatNumber(point.azimuth) : "-");
  setOutput(row, "bearing", point.hasCoordinates ? point.bearing : "-");
  setOutput(row, "deltaEast", point.hasCoordinates ? formatNumber(point.deltaEast) : "-");
  setOutput(row, "deltaNorth", point.hasCoordinates ? formatNumber(point.deltaNorth) : "-");
  setOutput(row, "east", point.hasCoordinates ? formatNumber(point.east) : "-");
  setOutput(row, "north", point.hasCoordinates ? formatNumber(point.north) : "-");
  setOutput(row, "status", point.status);
  const status = row.querySelector('[data-output="status"]');
  status.className = `point-status ${point.status === "Correcto" ? "status-ok" : point.status === "Incompleto" ? "status-incomplete" : "status-error"}`;
  setFieldError(row, "id", errors.id);
  setFieldError(row, "minutes", errors.minutes);
  setFieldError(row, "seconds", errors.seconds);
  const idInput = row.querySelector('[data-field="id"]');
  idInput.classList.toggle("is-invalid", errors.id.length > 0);
}

function setOutput(row, name, value) {
  const output = row.querySelector(`[data-output="${name}"]`);
  if (output) output.textContent = value;
}

function setFieldError(row, name, messages) {
  const error = row.querySelector(`[data-error="${name}"]`);
  if (error) error.textContent = [...new Set(messages)].join(" ");
  const input = row.querySelector(`[data-field="${name}"]`);
  if (input) input.classList.toggle("is-invalid", messages.length > 0);
}

function renderRowOutputs(survey) {
  const rows = [...els.body.querySelectorAll("tr")];
  if (rows.length !== state.observations.length) {
    renderRows(survey);
    return;
  }
  rows.forEach((row, index) => applyRowOutputs(row, survey, index));
  applyPointFilters();
}

function renderZoneSelectors() {
  const current = state.activeZoneId;
  els.activeZone.innerHTML = "";
  state.zones.forEach((zone) => {
    const option = document.createElement("option");
    option.value = zone.id;
    option.textContent = `${zone.name} (${zoneTypeLabel(zone.type)})`;
    option.selected = zone.id === current;
    els.activeZone.appendChild(option);
  });
  els.addRow.disabled = !state.zones.some((zone) => zone.id === state.activeZoneId);
  fillZoneFilter(els.pointZoneFilter, "Todas las zonas");
  fillZoneFilter(els.calculationZoneFilter, "Todas las zonas");
  syncActiveZoneControls();
}

function fillZoneFilter(select, emptyLabel) {
  const selected = select.value;
  select.innerHTML = "";
  const all = document.createElement("option");
  all.value = "";
  all.textContent = emptyLabel;
  select.appendChild(all);
  state.zones.forEach((zone) => {
    const option = document.createElement("option");
    option.value = zone.id;
    option.textContent = zone.name;
    select.appendChild(option);
  });
  select.value = state.zones.some((zone) => zone.id === selected) ? selected : "";
}

function syncActiveZoneControls() {
  const zone = state.zones.find((item) => item.id === state.activeZoneId);
  const disabled = !zone;
  els.activeZoneName.disabled = disabled;
  els.activeZoneColor.disabled = disabled;
  els.activeZoneType.disabled = disabled;
  if (!zone) {
    els.activeZoneName.value = "";
    els.activeZoneColor.value = "#31b6d5";
    els.activeZoneType.value = "polygon";
    return;
  }
  if (document.activeElement !== els.activeZoneName) els.activeZoneName.value = zone.name;
  if (document.activeElement !== els.activeZoneColor) els.activeZoneColor.value = zone.color;
  els.activeZoneType.value = zone.type;
}

function renderZones(survey) {
  els.zonesList.innerHTML = "";
  state.zones.forEach((zone) => {
    const analysis = survey.analyses.get(zone.id);
    const item = document.createElement("article");
    item.className = "zone-item";
    item.style.setProperty("--zone-color", zone.color);
    item.classList.toggle("is-active", zone.id === state.activeZoneId);
    item.classList.toggle("has-error", analysis.status === "Con errores");

    const top = document.createElement("div");
    top.className = "zone-topline";
    const title = document.createElement("h3");
    title.className = "zone-title";
    title.textContent = zone.name;
    title.title = zone.description || zone.name;
    const visibility = document.createElement("label");
    visibility.className = "zone-visibility";
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = zone.visible;
    checkbox.addEventListener("change", () => {
      pushHistory();
      zone.visible = checkbox.checked;
      update(false);
    });
    const visibilityText = document.createElement("span");
    visibilityText.textContent = "Mostrar";
    visibility.append(checkbox, visibilityText);
    top.append(title, visibility);

    const meta = document.createElement("div");
    meta.className = "zone-meta";
    meta.append(
      textSpan(zoneTypeLabel(zone.type)),
      textSpan(`${analysis.count} ${analysis.count === 1 ? "punto" : "puntos"}`),
      statusSpan(analysis.status, analysis.statusClass)
    );

    const measures = document.createElement("div");
    measures.className = "zone-measures";
    if (zone.type === "polygon") measures.append(textSpan(`Área: ${formatNumber(analysis.area)} ${areaUnitSymbol()}`));
    if (zone.type !== "points") {
      measures.append(textSpan(`${zone.type === "line" ? "Longitud" : "Perímetro"}: ${formatNumber(analysis.measure)} ${unitSymbol()}`));
    }

    const actions = document.createElement("div");
    actions.className = "zone-actions";
    actions.append(
      zoneButton("Seleccionar", () => setActiveZone(zone.id)),
      zoneButton("Editar", () => openZoneDialog(zone.id)),
      zoneButton("Duplicar", () => duplicateZone(zone.id)),
      zoneButton("Renumerar", () => {
        pushHistory();
        renumberZone(zone.id);
        update(true);
        showToast(`Se actualizó la numeración de ${zone.name}.`);
      })
    );
    actions.append(zoneButton("Eliminar", () => deleteZone(zone.id), "danger-outline"));
    item.append(top, meta, measures, actions);
    els.zonesList.appendChild(item);
  });
}

function renderCalculations(survey) {
  const zoneFilter = els.calculationZoneFilter.value;
  const previousPoint = els.calculationPointFilter.value;
  const availablePoints = survey.points.filter((point) => point.hasData && (!zoneFilter || point.zoneId === zoneFilter));
  els.calculationPointFilter.innerHTML = '<option value="">Todos los puntos</option>';
  availablePoints.forEach((point) => {
    const zone = state.zones.find((item) => item.id === point.zoneId);
    const option = document.createElement("option");
    option.value = point.uid;
    option.textContent = `${zone?.name || "Zona"} - punto ${point.id || "sin numero"}`;
    els.calculationPointFilter.appendChild(option);
  });
  els.calculationPointFilter.value = availablePoints.some((point) => point.uid === previousPoint) ? previousPoint : "";
  const pointFilter = els.calculationPointFilter.value;
  const zones = state.zones.filter((zone) => !zoneFilter || zone.id === zoneFilter);
  const sections = zones.map((zone) => {
    const analysis = survey.analyses.get(zone.id);
    const rows = analysis.rows.filter(({ point }) => point.hasData && (!pointFilter || point.uid === pointFilter));
    if (pointFilter && !rows.length) return "";
    const rowHtml = rows.map(({ point, index }) => {
      const source = state.observations[index];
      const gms = `${formatPlainNumber(source.degrees, 0)}\u00b0 ${formatPlainNumber(source.minutes, 0)}' ${formatPlainNumber(source.seconds, 3)}\"`;
      const details = [];
      if (zone?.name) details.push(zone.name);
      else if (point.description) details.push("Sin zona");
      if (point.description) details.push(point.description);
      const title = `Punto ${point.id || "-"}${details.length ? ` (${details.join(", ")})` : ""}`;
      const value = (number, suffix = "") => point.hasCoordinates ? `${formatNumber(number)}${suffix}` : "-";
      return `<tr>
        <td>${escapeHtml(title)}</td>
        <td>${escapeHtml(gms)}</td>
        <td>${value(point.distance, ` ${unitSymbol()}`)}</td>
        <td>${value(point.azimuth, "\u00b0")}</td>
        <td>${point.hasCoordinates ? escapeHtml(point.bearing) : "-"}</td>
        <td>${value(point.deltaEast, ` ${unitSymbol()}`)}</td>
        <td>${value(point.deltaNorth, ` ${unitSymbol()}`)}</td>
        <td>${value(point.east)}</td>
        <td>${value(point.north)}</td>
      </tr>`;
    }).join("");
    const area = zone.type === "polygon" ? `<span>Area: ${formatNumber(analysis.area)} ${areaUnitSymbol()}</span>` : "";
    const measure = zone.type !== "points" ? `<span>${zone.type === "line" ? "Longitud" : "Perimetro"}: ${formatNumber(analysis.measure)} ${unitSymbol()}</span>` : "";
    return `<section class="calculation-zone" style="--zone-color:${escapeHtml(zone.color)}">
      <div class="calculation-zone-heading"><h2>${escapeHtml(zone.name)}</h2></div>
      <div class="calculation-summary"><span>${escapeHtml(zoneTypeLabel(zone.type))}</span><span>${analysis.count} puntos</span>${area}${measure}</div>
      <div class="calculation-table-wrap"><table class="calculation-table"><thead><tr>
        <th>Identificación</th><th>GMS</th><th>Distancia</th><th>Azimut decimal</th><th>Rumbo</th><th>Proy. Este</th><th>Proy. Norte</th><th>Coord. Este</th><th>Coord. Norte</th>
      </tr></thead><tbody>${rowHtml || '<tr><td colspan="9">No hay observaciones para mostrar.</td></tr>'}</tbody></table></div>
    </section>`;
  }).filter(Boolean).join("");
  els.calculationsContent.innerHTML = sections || '<p class="empty-state">No hay calculos que coincidan con los filtros.</p>';
}

function textSpan(text) {
  const span = document.createElement("span");
  span.textContent = text;
  return span;
}

function statusSpan(text, className) {
  const span = textSpan(text);
  span.className = `zone-status ${className}`;
  return span;
}

function zoneButton(label, action, className = "") {
  const button = document.createElement("button");
  button.type = "button";
  button.textContent = label;
  if (className) button.className = className;
  button.addEventListener("click", action);
  return button;
}

function setActiveZone(zoneId) {
  if (!state.zones.some((zone) => zone.id === zoneId)) return;
  state.activeZoneId = zoneId;
  update(false);
}

function renumberZone(zoneId) {
  let number = 1;
  state.observations.forEach((observation) => {
    if (observation.zoneId !== zoneId) return;
    observation.id = String(number);
    number += 1;
  });
}

function toggleZoneClosed(zoneId) {
  const zone = state.zones.find((item) => item.id === zoneId);
  if (!zone || zone.type !== "polygon") return;
  pushHistory();
  zone.closed = !zone.closed;
  update(true);
}

function duplicateZone(zoneId) {
  const source = state.zones.find((zone) => zone.id === zoneId);
  if (!source) return;
  pushHistory();
  const duplicate = createZone({
    ...source,
    id: makeId("zone"),
    name: uniqueZoneName(`${source.name} copia`),
    color: ZONE_COLORS[state.zones.length % ZONE_COLORS.length],
  });
  state.zones.push(duplicate);
  state.activeZoneId = duplicate.id;
  update(true);
  showToast("Zona duplicada. La copia está vacía y lista para recibir puntos.");
}

function uniqueZoneName(baseName) {
  const names = new Set(state.zones.map((zone) => zone.name.toLocaleLowerCase("es")));
  if (!names.has(baseName.toLocaleLowerCase("es"))) return baseName;
  let suffix = 2;
  while (names.has(`${baseName} ${suffix}`.toLocaleLowerCase("es"))) suffix += 1;
  return `${baseName} ${suffix}`;
}

function deleteZone(zoneId) {
  const zone = state.zones.find((item) => item.id === zoneId);
  if (!zone) return;
  const pointCount = state.observations.filter((observation) => observation.zoneId === zoneId && hasMeasurementData(observation)).length;
  if (pointCount && !window.confirm(`La zona "${zone.name}" contiene ${pointCount} punto(s). ¿Desea eliminar la zona y sus filas?`)) return;
  if (!pointCount && !window.confirm(`¿Eliminar la zona "${zone.name}"?`)) return;
  pushHistory();
  state.zones = state.zones.filter((item) => item.id !== zoneId);
  state.observations = state.observations.filter((observation) => observation.zoneId !== zoneId);
  if (!state.zones.length) {
    const replacement = createZone({ name: "Zona principal", color: ZONE_COLORS[0] });
    state.zones.push(replacement);
  }
  state.activeZoneId = state.zones[0].id;
  if (!state.observations.length) state.observations.push(defaultObservation(1, state.activeZoneId));
  update(true);
}

function openZoneDialog(zoneId = null) {
  editingZoneId = zoneId;
  const zone = state.zones.find((item) => item.id === zoneId);
  const draft = zone || createZone({
    name: `Zona ${state.zones.length + 1}`,
    color: ZONE_COLORS[state.zones.length % ZONE_COLORS.length],
    reference: { type: "station" },
  });
  els.zoneDialogTitle.textContent = zone ? "Editar zona" : "Agregar zona";
  els.zoneName.value = draft.name;
  els.zoneColor.value = draft.color;
  els.zoneType.value = draft.type;
  els.zoneDescription.value = draft.description;
  els.zoneReferenceType.value = draft.reference.type;
  els.zoneReferenceEast.value = draft.reference.east || toNumber(state.station.east);
  els.zoneReferenceNorth.value = draft.reference.north || toNumber(state.station.north);
  populateReferencePoints(draft.reference.pointUid, zoneId);
  syncReferenceFields();
  els.zoneDialog.showModal();
  els.zoneName.focus();
  els.zoneName.select();
}

function populateReferencePoints(selectedUid, editingId) {
  const survey = computeSurvey();
  els.zoneReferencePoint.innerHTML = "";
  const available = survey.points.filter((point) => point.hasCoordinates && point.zoneId !== editingId);
  if (!available.length) {
    const option = document.createElement("option");
    option.value = "";
    option.textContent = "No hay puntos disponibles";
    els.zoneReferencePoint.appendChild(option);
    return;
  }
  available.forEach((point) => {
    const zone = state.zones.find((item) => item.id === point.zoneId);
    const option = document.createElement("option");
    option.value = point.uid;
    option.textContent = `${zone?.name || "Zona"} - punto ${point.id}`;
    option.selected = point.uid === selectedUid;
    els.zoneReferencePoint.appendChild(option);
  });
}

function syncReferenceFields() {
  const type = els.zoneReferenceType.value;
  els.referencePointField.classList.toggle("is-hidden", type !== "point");
  els.customReferenceFields.classList.toggle("is-hidden", type !== "custom");
}

function saveZoneFromDialog() {
  const name = els.zoneName.value.trim();
  if (!name) {
    showToast("Escriba un nombre para la zona.", true);
    return;
  }
  const duplicateName = state.zones.some(
    (zone) => zone.id !== editingZoneId && zone.name.toLocaleLowerCase("es") === name.toLocaleLowerCase("es")
  );
  if (duplicateName) {
    showToast("Ya existe una zona con ese nombre.", true);
    return;
  }
  const referenceType = els.zoneReferenceType.value;
  if (state.mode === "poligonal" && referenceType === "point" && !els.zoneReferencePoint.value) {
    showToast("Seleccione un punto de referencia o use la estación inicial.", true);
    return;
  }
  pushHistory();
  const values = {
    name,
    color: els.zoneColor.value,
    type: els.zoneType.value,
    description: els.zoneDescription.value.trim(),
    reference: {
      type: referenceType,
      pointUid: els.zoneReferencePoint.value,
      east: toNumber(els.zoneReferenceEast.value),
      north: toNumber(els.zoneReferenceNorth.value),
    },
  };
  if (editingZoneId) {
    const index = state.zones.findIndex((zone) => zone.id === editingZoneId);
    const previous = state.zones[index];
    state.zones[index] = createZone({ ...previous, ...values, id: previous.id, closed: values.type === "polygon" ? previous.closed : false });
  } else {
    const zone = createZone({ ...values, closed: values.type === "polygon" && state.autoClosePolygons });
    state.zones.push(zone);
    state.activeZoneId = zone.id;
  }
  els.zoneDialog.close();
  update(true);
  showToast(editingZoneId ? "Zona actualizada correctamente." : "Zona creada y seleccionada como activa.");
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
    minValue -= 5;
    maxValue += 5;
  }
  const span = Math.max(1, maxValue - minValue);
  const padding = span * 0.1;
  const requestedStep = Number(state?.gridSize || 0);
  const step = requestedStep > 0 && (span + padding * 2) / requestedStep <= 250
    ? requestedStep
    : niceStep((span + padding * 2) / 5);
  const min = Math.floor((minValue - padding) / step) * step;
  const max = Math.ceil((maxValue + padding) / step) * step;
  const ticks = [];
  for (let value = min; value <= max + step / 2; value += step) ticks.push(Number(value.toFixed(10)));
  if (Number.isFinite(anchorValue) && !ticks.some((value) => Math.abs(value - anchorValue) < step / 1000)) {
    ticks.push(anchorValue);
    ticks.sort((a, b) => a - b);
  }
  return { min, max, ticks };
}

function axisWithinRange(min, max, anchorValue) {
  const span = Math.max(1e-9, max - min);
  const requestedStep = Number(state?.gridSize || 0);
  const step = requestedStep > 0 && span / requestedStep <= 250
    ? requestedStep
    : niceStep(span / 5);
  const ticks = [];
  const firstTick = Math.ceil((min - step / 1000) / step) * step;
  for (let value = firstTick; value <= max + step / 1000; value += step) {
    ticks.push(Number(value.toFixed(10)));
  }
  if (
    Number.isFinite(anchorValue) &&
    anchorValue >= min &&
    anchorValue <= max &&
    !ticks.some((value) => Math.abs(value - anchorValue) < step / 1000)
  ) {
    ticks.push(anchorValue);
    ticks.sort((a, b) => a - b);
  }
  return { min, max, ticks };
}

function balancedAxes(eastAxis, northAxis, plotW, plotH, station) {
  const eastCenter = (eastAxis.min + eastAxis.max) / 2;
  const northCenter = (northAxis.min + northAxis.max) / 2;
  const unitsPerPixel = Math.max(
    (eastAxis.max - eastAxis.min) / plotW,
    (northAxis.max - northAxis.min) / plotH
  );
  const eastRange = unitsPerPixel * plotW;
  const northRange = unitsPerPixel * plotH;
  return {
    eastAxis: axisWithinRange(eastCenter - eastRange / 2, eastCenter + eastRange / 2, station.east),
    northAxis: axisWithinRange(northCenter - northRange / 2, northCenter + northRange / 2, station.north),
  };
}

function applyView(eastAxis, northAxis, station) {
  const zoom = clampNumber(state.view.zoom, 0.5, 20);
  const eastRange = (eastAxis.max - eastAxis.min) / zoom;
  const northRange = (northAxis.max - northAxis.min) / zoom;
  const eastCenter = (eastAxis.min + eastAxis.max) / 2 + toNumber(state.view.panEast);
  const northCenter = (northAxis.min + northAxis.max) / 2 + toNumber(state.view.panNorth);
  return {
    eastAxis: axisWithinRange(eastCenter - eastRange / 2, eastCenter + eastRange / 2, station.east),
    northAxis: axisWithinRange(northCenter - northRange / 2, northCenter + northRange / 2, station.north),
  };
}

function drawPlot(survey) {
  const canvas = els.canvas;
  const ctx = canvas.getContext("2d");
  const rect = canvas.getBoundingClientRect();
  if (!rect.width || !rect.height) return;
  const scale = window.devicePixelRatio || 1;
  canvas.width = Math.max(600, Math.round(rect.width * scale));
  canvas.height = Math.max(600, Math.round(rect.height * scale));
  ctx.setTransform(scale, 0, 0, scale, 0, 0);
  const width = rect.width;
  const height = rect.height;
  ctx.clearRect(0, 0, width, height);

  const station = { east: toNumber(state.station.east), north: toNumber(state.station.north), id: "BM" };
  const visibleZoneIds = new Set(state.zones.filter((zone) => zone.visible).map((zone) => zone.id));
  const visiblePoints = survey.points.filter((point) => point.hasCoordinates && visibleZoneIds.has(point.zoneId));
  const all = [station, ...visiblePoints];
  const eastValues = all.map((point) => point.east);
  const northValues = all.map((point) => point.north);
  let eastAxis = niceAxis(Math.min(...eastValues), Math.max(...eastValues), station.east);
  let northAxis = niceAxis(Math.min(...northValues), Math.max(...northValues), station.north);
  const margin = { left: 66, right: 28, top: 28, bottom: 52 };
  const plotW = Math.max(1, width - margin.left - margin.right);
  const plotH = Math.max(1, height - margin.top - margin.bottom);
  ({ eastAxis, northAxis } = balancedAxes(eastAxis, northAxis, plotW, plotH, station));
  ({ eastAxis, northAxis } = applyView(eastAxis, northAxis, station));
  const x = (east) => margin.left + ((east - eastAxis.min) / (eastAxis.max - eastAxis.min)) * plotW;
  const y = (north) => margin.top + (1 - (north - northAxis.min) / (northAxis.max - northAxis.min)) * plotH;
  plotTransform = { eastAxis, northAxis, plotW, plotH, margin, x, y };

  const colors = plotColors();
  ctx.fillStyle = colors.background;
  ctx.fillRect(0, 0, width, height);
  drawGrid(ctx, eastAxis, northAxis, x, y, margin, plotW, plotH, width, height);

  state.zones.forEach((zone) => {
    if (!zone.visible) return;
    const analysis = survey.analyses.get(zone.id);
    const displayColor = analysis.status === "Con errores" ? "#bd3c2f" : zone.color;
    if (state.showLines && zone.type !== "points") drawZoneGeometry(ctx, analysis, zone, displayColor, x, y);
    if (state.showPoints) {
      analysis.points.forEach((point) => drawPoint(
        ctx,
        x(point.east),
        y(point.north),
        state.showPointNumbers ? point.id : "",
        displayColor,
        false,
        point.uid === selectedPointUid
      ));
    }
    if (state.showZoneNames && analysis.points.length) drawZoneName(ctx, analysis, zone, x, y);
  });

  drawStationGuides(ctx, x(station.east), y(station.north), margin, plotW, plotH);
  drawPoint(ctx, x(station.east), y(station.north), station.id, "#c64f32", true);
  drawStationCoords(ctx, x(station.east), y(station.north), station);
  drawLegend(ctx, state.zones.filter((zone) => zone.visible), survey, width, margin);

  ctx.fillStyle = colors.text;
  ctx.font = "700 12px Segoe UI, Arial";
  ctx.fillText("Este (E)", margin.left + plotW - 52, height - 9);
  ctx.fillText("Norte (N)", margin.left, 16);
}

function plotColors() {
  return state.appearance === "light"
    ? {
        background: "#f7fafb", grid: "rgba(67, 105, 120, 0.2)", muted: "#536973", axis: "#718690",
        text: "#263840", pointStroke: "#ffffff", labelBackground: "rgba(247, 250, 251, 0.92)",
        legendBackground: "rgba(255, 255, 255, 0.96)", legendText: "#263840",
      }
    : {
        background: "#0b1115", grid: "rgba(92, 152, 176, 0.2)", muted: "#9fb1ba", axis: "#8fa4ae",
        text: "#b6c5cc", pointStroke: "#ffffff", labelBackground: "rgba(11, 17, 21, 0.88)",
        legendBackground: "rgba(18, 25, 30, 0.94)", legendText: "#e5eef1",
      };
}

function drawGrid(ctx, eastAxis, northAxis, x, y, margin, plotW, plotH, width, height) {
  const colors = plotColors();
  if (state.showGrid) {
    ctx.strokeStyle = colors.grid;
    ctx.fillStyle = colors.muted;
    ctx.lineWidth = 1;
    ctx.font = "11px Segoe UI, Arial";
    eastAxis.ticks.forEach((value) => {
      const px = x(value);
      ctx.beginPath();
      ctx.moveTo(px, margin.top);
      ctx.lineTo(px, margin.top + plotH);
      ctx.stroke();
      ctx.fillText(formatNumber(value, state.axisDecimals), px - 18, height - 25);
    });
    northAxis.ticks.forEach((value) => {
      const py = y(value);
      ctx.beginPath();
      ctx.moveTo(margin.left, py);
      ctx.lineTo(margin.left + plotW, py);
      ctx.stroke();
      ctx.fillText(formatNumber(value, state.axisDecimals), 8, py + 4);
    });
  }
  ctx.strokeStyle = colors.axis;
  ctx.lineWidth = 1.3;
  ctx.beginPath();
  ctx.moveTo(margin.left, margin.top + plotH);
  ctx.lineTo(margin.left + plotW, margin.top + plotH);
  ctx.moveTo(margin.left, margin.top);
  ctx.lineTo(margin.left, margin.top + plotH);
  ctx.stroke();
}

function drawZoneGeometry(ctx, analysis, zone, color, x, y) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = analysis.status === "Con errores" ? 3 : 2.4;
  if (analysis.status === "Con errores") ctx.setLineDash([8, 5]);
  analysis.segments.forEach((segment) => {
    if (segment.length < 2) return;
    ctx.beginPath();
    segment.forEach((point, index) => {
      if (index === 0) ctx.moveTo(x(point.east), y(point.north));
      else ctx.lineTo(x(point.east), y(point.north));
    });
    if (zone.type === "polygon" && zone.closed && analysis.complete && segment.length === analysis.points.length) {
      ctx.closePath();
      ctx.globalAlpha = 0.1;
      ctx.fillStyle = color;
      ctx.fill();
      ctx.globalAlpha = 1;
    }
    ctx.stroke();
  });
  ctx.restore();
}

function drawPoint(ctx, x, y, label, color, station = false, selected = false) {
  const colors = plotColors();
  if (selected) {
    ctx.strokeStyle = "#f2c94c";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(x, y, 11, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.fillStyle = color;
  ctx.strokeStyle = colors.pointStroke;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(x, y, station ? 7 : 5.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = colors.text;
  ctx.font = "700 11px Segoe UI, Arial";
  if (label) ctx.fillText(String(label), x + 8, y - 8);
}

function drawStationGuides(ctx, x, y, margin, plotW, plotH) {
  ctx.save();
  ctx.strokeStyle = "rgba(239, 107, 94, 0.66)";
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
  ctx.fillStyle = plotColors().text;
  ctx.font = "700 11px Segoe UI, Arial";
  ctx.fillText(`E ${formatCoordinate(station.east)} / N ${formatCoordinate(station.north)}`, x + 9, y + 13);
}

function drawZoneName(ctx, analysis, zone, x, y) {
  const center = analysis.points.reduce(
    (sum, point) => ({ east: sum.east + point.east, north: sum.north + point.north }),
    { east: 0, north: 0 }
  );
  center.east /= analysis.points.length;
  center.north /= analysis.points.length;
  const label = zone.name;
  ctx.save();
  ctx.font = "700 12px Segoe UI, Arial";
  const width = ctx.measureText(label).width + 12;
  const px = x(center.east) - width / 2;
  const py = y(center.north) - 10;
  ctx.fillStyle = plotColors().labelBackground;
  ctx.fillRect(px, py, width, 20);
  ctx.fillStyle = zone.color;
  ctx.fillText(label, px + 6, py + 14);
  ctx.restore();
}

function drawLegend(ctx, zones, survey, width, margin) {
  if (!zones.length) return;
  const maxItems = Math.min(zones.length, 7);
  const boxWidth = Math.min(185, width * 0.42);
  const boxHeight = 12 + maxItems * 22;
  const left = width - margin.right - boxWidth;
  const top = margin.top + 4;
  ctx.save();
  ctx.fillStyle = plotColors().legendBackground;
  ctx.strokeStyle = "rgba(143, 164, 174, 0.5)";
  ctx.lineWidth = 1;
  ctx.fillRect(left, top, boxWidth, boxHeight);
  ctx.strokeRect(left, top, boxWidth, boxHeight);
  ctx.font = "700 11px Segoe UI, Arial";
  zones.slice(0, maxItems).forEach((zone, index) => {
    const analysis = survey.analyses.get(zone.id);
    const color = analysis.status === "Con errores" ? "#bd3c2f" : zone.color;
    const y = top + 18 + index * 22;
    ctx.fillStyle = color;
    ctx.fillRect(left + 9, y - 9, 11, 11);
    ctx.fillStyle = plotColors().legendText;
    const label = zone.name.length > 22 ? `${zone.name.slice(0, 20)}...` : zone.name;
    ctx.fillText(label, left + 27, y);
  });
  ctx.restore();
}

function updateStats(survey) {
  const validPoints = survey.points.filter((point) => point.hasCoordinates);
  const activeAnalysis = survey.analyses.get(state.activeZoneId);
  const last = validPoints.at(-1);
  const selected = survey.points.find((point) => point.uid === selectedPointUid && point.hasCoordinates);
  if (selectedPointUid && !selected) selectedPointUid = null;
  els.pointsCount.textContent = String(validPoints.length);
  els.areaValue.textContent = `${formatNumber(activeAnalysis?.area || 0)} ${areaUnitSymbol()}`;
  els.measureLabel.textContent = activeAnalysis?.zone.type === "line" ? "Longitud de zona activa" : "Perímetro de zona activa";
  els.perimeterValue.textContent = `${formatNumber(activeAnalysis?.measure || 0)} ${unitSymbol()}`;
  els.lastPoint.textContent = last
    ? `E ${formatNumber(last.east)} / N ${formatNumber(last.north)}`
    : `BM E ${formatCoordinate(toNumber(state.station.east))} / N ${formatCoordinate(toNumber(state.station.north))}`;
  els.selectedPointStatus.textContent = selected
    ? `Punto ${selected.id}: E ${formatCoordinate(selected.east)} / N ${formatCoordinate(selected.north)}`
    : quickMode === "measure" && measurePointUids.length === 1
      ? "Seleccione el segundo punto"
      : "Sin selección";
  els.quickPoints.classList.toggle("is-active", state.showPoints);
  els.quickPoints.querySelector("span:last-child").textContent = state.showPoints ? "Ocultar puntos" : "Mostrar puntos";
  els.quickLines.classList.toggle("is-active", state.showLines);
  els.quickLines.querySelector("span:last-child").textContent = state.showLines ? "Ocultar líneas" : "Mostrar líneas";
  els.quickGrid.classList.toggle("is-active", state.showGrid);
}

function drawingPaperDimensions() {
  const format = PAPER_FORMATS[state.drawingScale.paper] || PAPER_FORMATS.A3;
  return state.drawingScale.orientation === "horizontal"
    ? { width: format.height, height: format.width }
    : { width: format.width, height: format.height };
}

function drawingTerrainBounds(survey) {
  const station = { east: toNumber(state.station.east), north: toNumber(state.station.north) };
  const points = survey.points.filter((point) => point.hasCoordinates);
  const planPoints = [station, ...points];
  const eastValues = planPoints.map((point) => point.east);
  const northValues = planPoints.map((point) => point.north);
  return {
    minEast: Math.min(...eastValues),
    maxEast: Math.max(...eastValues),
    minNorth: Math.min(...northValues),
    maxNorth: Math.max(...northValues),
  };
}

function drawingScaleDetails(survey) {
  const paper = drawingPaperDimensions();
  const bounds = drawingTerrainBounds(survey);
  const coordinateToMeters = state.units === "ft" ? 0.3048 : 1;
  const terrainWidth = (bounds.maxEast - bounds.minEast) * coordinateToMeters;
  const terrainHeight = (bounds.maxNorth - bounds.minNorth) * coordinateToMeters;
  const usefulWidth = Math.max(1, paper.width - PAPER_MARGIN_MM * 2);
  const usefulHeight = Math.max(1, paper.height - PAPER_MARGIN_MM * 2 - TITLE_BLOCK_MM);
  const needed = Math.max(
    (terrainWidth * 1000) / usefulWidth,
    (terrainHeight * 1000) / usefulHeight,
    1
  );
  const recommended = DRAWING_SCALES.find((denominator) => denominator >= needed) || DRAWING_SCALES.at(-1);
  const selected = state.drawingScale.mode === "auto" ? recommended : state.drawingScale.denominator;
  const drawingWidth = (terrainWidth * 1000) / selected;
  const drawingHeight = (terrainHeight * 1000) / selected;
  const fits = drawingWidth <= usefulWidth + 1e-9 && drawingHeight <= usefulHeight + 1e-9;
  return {
    paper,
    bounds,
    usefulWidth,
    usefulHeight,
    terrainWidth,
    terrainHeight,
    needed,
    recommended,
    selected,
    drawingWidth,
    drawingHeight,
    fits,
  };
}

function renderDrawingScale(survey) {
  const details = drawingScaleDetails(survey);
  if (state.drawingScale.mode === "auto") state.drawingScale.denominator = details.selected;
  els.paperFormat.value = state.drawingScale.paper;
  els.paperOrientation.value = state.drawingScale.orientation;
  els.drawingScaleMode.value = state.drawingScale.mode;
  els.drawingScale.value = String(details.selected);
  els.drawingScale.disabled = state.drawingScale.mode === "auto";
  const orientation = state.drawingScale.orientation;
  const fitMessage = details.fits
    ? `El terreno cabe correctamente en ${state.drawingScale.paper} ${orientation} a escala 1:${details.selected}.`
    : `El terreno no cabe completamente en ${state.drawingScale.paper} ${orientation} a escala 1:${details.selected}. Seleccione una hoja más grande o una escala con mayor denominador.`;
  els.drawingScaleInfo.innerHTML = `
    <span>Formato: <strong>${state.drawingScale.paper} ${orientation}</strong></span>
    <span>Terreno: <strong>${formatNumber(details.terrainWidth, 2)} m × ${formatNumber(details.terrainHeight, 2)} m</strong></span>
    <span>Escala recomendada: <strong>1:${details.recommended}</strong></span>
    <span>Escala seleccionada: <strong>1:${details.selected}</strong></span>
    <span>Tamaño en papel: <strong>${formatNumber(details.drawingWidth, 2)} mm × ${formatNumber(details.drawingHeight, 2)} mm</strong></span>
    <span>Área útil: <strong>${formatNumber(details.usefulWidth, 0)} mm × ${formatNumber(details.usefulHeight, 0)} mm</strong></span>
    <strong class="drawing-scale-result ${details.fits ? "fits" : "does-not-fit"}">${escapeHtml(fitMessage)}</strong>`;
}

function createTechnicalPlanCanvas(survey) {
  const canvas = document.createElement("canvas");
  canvas.width = 1400;
  canvas.height = 1000;
  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;
  const station = { east: toNumber(state.station.east), north: toNumber(state.station.north), id: "BM" };
  const visibleZoneIds = new Set(state.zones.filter((zone) => zone.visible).map((zone) => zone.id));
  const visiblePoints = survey.points.filter((point) => point.hasCoordinates && visibleZoneIds.has(point.zoneId));
  const eastValues = [station, ...visiblePoints].map((point) => point.east);
  const northValues = [station, ...visiblePoints].map((point) => point.north);
  let eastAxis = niceAxis(Math.min(...eastValues), Math.max(...eastValues), station.east);
  let northAxis = niceAxis(Math.min(...northValues), Math.max(...northValues), station.north);
  const margin = { left: 90, right: 45, top: 45, bottom: 70 };
  const plotW = width - margin.left - margin.right;
  const plotH = height - margin.top - margin.bottom;
  ({ eastAxis, northAxis } = balancedAxes(eastAxis, northAxis, plotW, plotH, station));
  const x = (east) => margin.left + ((east - eastAxis.min) / (eastAxis.max - eastAxis.min)) * plotW;
  const y = (north) => margin.top + (1 - (north - northAxis.min) / (northAxis.max - northAxis.min)) * plotH;
  const colors = plotColors();
  ctx.fillStyle = colors.background;
  ctx.fillRect(0, 0, width, height);
  drawGrid(ctx, eastAxis, northAxis, x, y, margin, plotW, plotH, width, height);

  state.zones.forEach((zone) => {
    if (!zone.visible) return;
    const analysis = survey.analyses.get(zone.id);
    const displayColor = analysis.status === "Con errores" ? "#bd3c2f" : zone.color;
    if (state.showLines && zone.type !== "points") drawZoneGeometry(ctx, analysis, zone, displayColor, x, y);
    if (state.showPoints) {
      analysis.points.forEach((point) => drawPoint(
        ctx,
        x(point.east),
        y(point.north),
        state.showPointNumbers ? point.id : "",
        displayColor
      ));
    }
    if (state.showZoneNames && analysis.points.length) drawZoneName(ctx, analysis, zone, x, y);
  });
  drawStationGuides(ctx, x(station.east), y(station.north), margin, plotW, plotH);
  drawPoint(ctx, x(station.east), y(station.north), station.id, "#c64f32", true);
  drawStationCoords(ctx, x(station.east), y(station.north), station);
  drawLegend(ctx, state.zones.filter((zone) => zone.visible), survey, width, margin);
  ctx.fillStyle = colors.text;
  ctx.font = "700 18px Segoe UI, Arial";
  ctx.fillText("Este (E)", margin.left + plotW - 80, height - 18);
  ctx.fillText("Norte (N)", margin.left, 26);
  return canvas;
}

function syncControls() {
  els.projectName.value = state.projectName;
  els.stationEast.value = state.station.east;
  els.stationNorth.value = state.station.north;
  els.showLines.checked = state.showLines;
  els.showGrid.checked = state.showGrid;
  els.showZoneNames.checked = state.showZoneNames;
  els.showPointNumbers.checked = state.showPointNumbers;
  els.autoClosePolygons.checked = state.autoClosePolygons;
  els.units.value = state.units;
  els.gridSize.value = String(state.gridSize);
  els.appearance.value = state.appearance;
  document.body.dataset.theme = state.appearance;
  els.axisDecimals.value = String(state.axisDecimals);
  els.paperFormat.value = state.drawingScale.paper;
  els.paperOrientation.value = state.drawingScale.orientation;
  els.drawingScaleMode.value = state.drawingScale.mode;
  els.drawingScale.value = String(state.drawingScale.denominator);
  els.drawingScale.disabled = state.drawingScale.mode === "auto";
  els.distanceHeader.textContent = `Distancia (${unitSymbol()})`;
  renderProjectList();
  renderProjectsView();
  updateUndoButtons();
}

function update(renderTable = true) {
  const survey = computeSurvey();
  els.distanceHeader.textContent = `Distancia (${unitSymbol()})`;
  renderZoneSelectors();
  if (renderTable) renderRows(survey);
  else renderRowOutputs(survey);
  renderZones(survey);
  renderCalculations(survey);
  renderProjectsView();
  updateStats(survey);
  renderDrawingScale(survey);
  if (activeView === "plan") drawPlot(survey);
  saveLocalState();
  updateUndoButtons();
  return survey;
}

function loadProjects() {
  try {
    const parsed = JSON.parse(localStorage.getItem(PROJECTS_KEY));
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function writeProjects(projects) {
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
}

function saveLocalState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  const normalizedName = normalizeProjectName(state.projectName);
  if (loadedProjectName && normalizedName === loadedProjectName) {
    const projects = loadProjects();
    state.modifiedAt = new Date().toISOString();
    projects[loadedProjectName] = clone({ ...state, projectName: loadedProjectName, modifiedAt: state.modifiedAt });
    writeProjects(projects);
    localStorage.setItem(CURRENT_PROJECT_KEY, loadedProjectName);
    els.saveState.textContent = "Guardado automáticamente";
  } else if (loadedProjectName) {
    els.saveState.textContent = "Nombre nuevo: pulse Guardar";
  } else {
    els.saveState.textContent = "Cambios locales";
  }
}

function saveNamedProject() {
  const name = normalizeProjectName(els.projectName.value);
  const projects = loadProjects();
  const isDifferentProject = loadedProjectName !== name;
  if (isDifferentProject && projects[name] && !window.confirm(`Ya existe un levantamiento llamado "${name}". ¿Desea reemplazarlo?`)) return;
  state.projectName = name;
  state.modifiedAt = new Date().toISOString();
  projects[name] = clone(state);
  writeProjects(projects);
  loadedProjectName = name;
  localStorage.setItem(CURRENT_PROJECT_KEY, name);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  renderProjectList();
  renderProjectsView();
  els.saveState.textContent = `Guardado: ${name}`;
  showToast(`El levantamiento "${name}" se guardó correctamente.`);
}

function renderProjectList() {
  const projects = loadProjects();
  const names = Object.keys(projects).sort((a, b) => a.localeCompare(b, "es"));
  els.projectList.innerHTML = "";
  if (!names.length) {
    const option = document.createElement("option");
    option.value = "";
    option.textContent = "Sin levantamientos guardados";
    els.projectList.appendChild(option);
    return;
  }
  names.forEach((name) => {
    const option = document.createElement("option");
    option.value = name;
    option.textContent = name;
    option.selected = name === loadedProjectName;
    els.projectList.appendChild(option);
  });
}

function uniqueProjectName(baseName, projects = loadProjects()) {
  if (!projects[baseName]) return baseName;
  let suffix = 2;
  while (projects[`${baseName} ${suffix}`]) suffix += 1;
  return `${baseName} ${suffix}`;
}

function duplicateProjectByName(name) {
  const projects = loadProjects();
  if (!name || !projects[name]) return;
  const copyName = uniqueProjectName(`${name} copia`, projects);
  projects[copyName] = clone({ ...projects[name], projectName: copyName, modifiedAt: new Date().toISOString() });
  writeProjects(projects);
  renderProjectList();
  els.projectList.value = copyName;
  renderProjectsView();
  showToast(`Se creo la copia "${copyName}".`);
}

function renameProjectByName(name) {
  const projects = loadProjects();
  if (!name || !projects[name]) return;
  const proposed = window.prompt("Nuevo nombre del levantamiento:", name);
  if (proposed === null) return;
  const newName = normalizeProjectName(proposed);
  if (newName === name) return;
  if (projects[newName] && !window.confirm(`Ya existe "${newName}". Desea reemplazarlo?`)) return;
  projects[newName] = clone({ ...projects[name], projectName: newName, modifiedAt: new Date().toISOString() });
  delete projects[name];
  if (loadedProjectName === name) {
    loadedProjectName = newName;
    state.projectName = newName;
    state.modifiedAt = projects[newName].modifiedAt;
    localStorage.setItem(CURRENT_PROJECT_KEY, newName);
  }
  writeProjects(projects);
  syncControls();
  update(true);
  showToast(`El levantamiento ahora se llama "${newName}".`);
}

function deleteProjectByName(name) {
  const projects = loadProjects();
  if (!name || !projects[name]) return;
  if (!window.confirm(`Eliminar definitivamente el levantamiento "${name}"?`)) return;
  delete projects[name];
  writeProjects(projects);
  if (loadedProjectName === name) {
    state = createBlankState();
    loadedProjectName = null;
    localStorage.removeItem(CURRENT_PROJECT_KEY);
  }
  syncControls();
  update(true);
  showToast(`Se elimino el levantamiento "${name}".`);
}

function renderProjectsView() {
  const projects = loadProjects();
  const entries = Object.entries(projects).sort(([a], [b]) => a.localeCompare(b, "es"));
  if (!entries.length) {
    els.projectsViewList.innerHTML = '<p class="empty-state">Todavia no hay levantamientos guardados.</p>';
    return;
  }
  els.projectsViewList.innerHTML = entries.map(([name, project]) => {
    const zones = Array.isArray(project.zones) ? project.zones.length : 1;
    const points = Array.isArray(project.observations) ? project.observations.filter(hasMeasurementData).length : 0;
    const date = project.modifiedAt ? new Date(project.modifiedAt).toLocaleString("es-CO") : "Fecha no disponible";
    return `<article class="project-item ${name === loadedProjectName ? "is-current" : ""}" data-project-name="${escapeHtml(name)}">
      <div class="project-item-heading"><h2>${escapeHtml(name)}</h2>${name === loadedProjectName ? '<span class="status-ok">Abierto</span>' : ""}</div>
      <div class="project-meta"><span>${zones} zona(s)</span><span>${points} punto(s)</span><span>Modificado: ${escapeHtml(date)}</span></div>
      <div class="project-actions"><button type="button" data-project-action="open">Abrir</button><button type="button" data-project-action="rename">Cambiar nombre</button><button type="button" data-project-action="duplicate">Duplicar</button><button class="danger-outline" type="button" data-project-action="delete">Eliminar</button></div>
    </article>`;
  }).join("");
  els.projectsViewList.querySelectorAll("[data-project-name]").forEach((item) => {
    const name = item.dataset.projectName;
    item.querySelector('[data-project-action="open"]').addEventListener("click", () => loadProjectByName(name));
    item.querySelector('[data-project-action="rename"]').addEventListener("click", () => renameProjectByName(name));
    item.querySelector('[data-project-action="duplicate"]').addEventListener("click", () => duplicateProjectByName(name));
    item.querySelector('[data-project-action="delete"]').addEventListener("click", () => deleteProjectByName(name));
  });
}

function loadProjectByName(name) {
  const projects = loadProjects();
  if (!name || !projects[name]) return;
  state = migrateState(projects[name]);
  state.projectName = name;
  state.showPoints = true;
  state.showLines = true;
  loadedProjectName = name;
  undoStack.length = 0;
  redoStack.length = 0;
  syncControls();
  update(true);
  switchView("plan");
  showToast(`Se abrió el levantamiento "${name}".`);
}

function load() {
  const projects = loadProjects();
  const currentName = localStorage.getItem(CURRENT_PROJECT_KEY);
  let stored = null;
  if (currentName && projects[currentName]) {
    stored = projects[currentName];
    loadedProjectName = currentName;
  } else {
    try {
      stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }
  state = migrateState(stored || createBlankState());
  state.showPoints = true;
  state.showLines = true;
  if (loadedProjectName) state.projectName = loadedProjectName;
  syncControls();
  update(true);
}

function pushHistory() {
  const snapshot = JSON.stringify(state);
  if (undoStack.at(-1) !== snapshot) undoStack.push(snapshot);
  if (undoStack.length > HISTORY_LIMIT) undoStack.shift();
  redoStack.length = 0;
  updateUndoButtons();
}

function undo() {
  if (!undoStack.length) return;
  redoStack.push(JSON.stringify(state));
  state = migrateState(JSON.parse(undoStack.pop()));
  syncControls();
  update(true);
  showToast("Cambio deshecho.");
}

function redo() {
  if (!redoStack.length) return;
  undoStack.push(JSON.stringify(state));
  state = migrateState(JSON.parse(redoStack.pop()));
  syncControls();
  update(true);
  showToast("Cambio rehecho.");
}

function updateUndoButtons() {
  els.undo.disabled = undoStack.length === 0;
  els.redo.disabled = redoStack.length === 0;
}

function showToast(message, error = false) {
  window.clearTimeout(showToast.timer);
  els.toast.textContent = message;
  els.toast.classList.toggle("is-error", error);
  els.toast.classList.add("is-visible");
  showToast.timer = window.setTimeout(() => els.toast.classList.remove("is-visible"), 3200);
}

function setSample() {
  const currentName = state.projectName;
  pushHistory();
  const terrain = createZone({ name: "Terreno principal", color: "#0b6b5d", type: "polygon", closed: true });
  const house = createZone({ name: "Casa", color: "#2962a3", type: "polygon", closed: true });
  const road = createZone({ name: "Vía de acceso", color: "#6d7378", type: "line" });
  state = {
    ...createBlankState(currentName),
    projectName: currentName,
    station: { east: toNumber(els.stationEast.value || state.station.east), north: toNumber(els.stationNorth.value || state.station.north) },
    zones: [terrain, house, road],
    activeZoneId: terrain.id,
    observations: [
      { ...defaultObservation(1, terrain.id), degrees: 35, minutes: 0, seconds: 0, distance: 95, description: "Esquina norte" },
      { ...defaultObservation(2, terrain.id), degrees: 125, minutes: 0, seconds: 0, distance: 118, description: "Esquina este" },
      { ...defaultObservation(3, terrain.id), degrees: 215, minutes: 0, seconds: 0, distance: 104, description: "Esquina sur" },
      { ...defaultObservation(4, terrain.id), degrees: 305, minutes: 0, seconds: 0, distance: 86, description: "Esquina oeste" },
      { ...defaultObservation(1, house.id), degrees: 46, minutes: 0, seconds: 0, distance: 32, description: "Casa 1" },
      { ...defaultObservation(2, house.id), degrees: 76, minutes: 0, seconds: 0, distance: 43, description: "Casa 2" },
      { ...defaultObservation(3, house.id), degrees: 104, minutes: 0, seconds: 0, distance: 39, description: "Casa 3" },
      { ...defaultObservation(4, house.id), degrees: 132, minutes: 0, seconds: 0, distance: 29, description: "Casa 4" },
      { ...defaultObservation(1, road.id), degrees: 175, minutes: 20, seconds: 0, distance: 58, description: "Inicio de vía" },
      { ...defaultObservation(2, road.id), degrees: 188, minutes: 10, seconds: 0, distance: 91, description: "Final de vía" },
    ],
  };
  syncControls();
  update(true);
}

function safeFileName(name) {
  return normalizeProjectName(name).replace(/[\\/:*?"<>|]+/g, "-").replace(/\s+/g, "-").toLowerCase();
}

function downloadFile(content, filename, type) {
  const blob = content instanceof Blob ? content : new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 500);
}

function makeTextTable(headers, rows) {
  const allRows = [headers, ...rows];
  const widths = headers.map((_, columnIndex) => Math.max(...allRows.map((row) => String(row[columnIndex] ?? "").length)));
  const formatRow = (row) => row.map((cell, columnIndex) => String(cell ?? "").padEnd(widths[columnIndex], " ")).join(" | ");
  return [
    formatRow(headers),
    widths.map((width) => "-".repeat(width)).join("-|-"),
    ...rows.map(formatRow),
  ].join("\n");
}

function exportCoordinatesTxt() {
  const survey = computeSurvey();
  const points = survey.points.filter((point) => point.hasCoordinates);
  const protectValue = (value) => {
    const text = String(value ?? "");
    return /[",\r\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
  };
  const rows = points.map((point, index) => [
    index + 1,
    formatNumber(point.east),
    formatNumber(point.north),
    state.zones.find((zone) => zone.id === point.zoneId)?.name || "",
    state.zones.find((zone) => zone.id === point.zoneId)?.description || "",
  ]);
  const content = rows.map((row) => row.map(protectValue).join(", ")).join("\r\n");
  downloadFile(`\ufeff${content}`, `GeoTrazo_${safeFileName(state.projectName)}-coordenadas.txt`, "text/plain;charset=utf-8");
}

function exportCalculationProcess() {
  const survey = computeSurvey();
  const lines = [
    `Levantamiento: ${state.projectName}`,
    `Estación inicial: E ${formatNumber(toNumber(state.station.east))}, N ${formatNumber(toNumber(state.station.north))}`,
    `Método: ${state.mode === "poligonal" ? "Poligonal" : "Radiación"}`,
    "",
    "Proceso de conversión GMS, rumbos y proyecciones",
    "",
  ];
  state.zones.forEach((zone) => {
    const analysis = survey.analyses.get(zone.id);
    lines.push("=".repeat(72));
    lines.push(`Zona: ${zone.name}`);
    lines.push(`Tipo: ${zoneTypeLabel(zone.type)} | Color: ${zone.color}`);
    if (zone.description) lines.push(`Descripción: ${zone.description}`);
    lines.push("-".repeat(72));
    analysis.points.forEach((point) => {
      const observation = point.source;
      lines.push(`Punto ${point.id} - ${point.description || "Sin descripción"}`);
      lines.push(`GMS: ${formatPlainNumber(observation.degrees, 0)}° ${formatPlainNumber(observation.minutes, 0)}' ${formatPlainNumber(observation.seconds, 3)}"`);
      lines.push(`Azimut decimal: ${formatPlainNumber(observation.degrees, 0)} + (${formatPlainNumber(observation.minutes, 0)} / 60) + (${formatPlainNumber(observation.seconds, 3)} / 3600) = ${formatNumber(point.azimuth)}°`);
      lines.push(`Radianes: ${formatNumber(point.azimuth)} × PI / 180 = ${formatNumber(point.radians, 6)}`);
      lines.push(`Rumbo cardinal: ${point.bearing}`);
      lines.push(`Proyección Este: ${formatNumber(point.distance)} × sen(${formatNumber(point.azimuth)}°) = ${formatNumber(point.deltaEast)}`);
      lines.push(`Proyección Norte: ${formatNumber(point.distance)} × cos(${formatNumber(point.azimuth)}°) = ${formatNumber(point.deltaNorth)}`);
      lines.push(`Coordenada final: E ${formatNumber(point.east)}, N ${formatNumber(point.north)}, Z 0`);
      lines.push("");
    });
    lines.push(`Cantidad de puntos: ${analysis.count}`);
    if (zone.type === "polygon") lines.push(`Área: ${formatNumber(analysis.area)} ${areaUnitSymbol()}`);
    if (zone.type !== "points") lines.push(`${zone.type === "line" ? "Longitud" : "Perímetro"}: ${formatNumber(analysis.measure)} ${unitSymbol()}`);
    lines.push(`Estado de la figura: ${analysis.status}`);
    lines.push("");
  });
  downloadFile(lines.join("\n"), `GeoTrazo_${safeFileName(state.projectName)}-calculos.txt`, "text/plain;charset=utf-8");
}

function csvEscape(value) {
  return `"${String(value ?? "").replaceAll('"', '""')}"`;
}

function exportCsv() {
  const survey = computeSurvey();
  const headers = [
    "zona", "color_zona", "tipo_zona", "numero_punto", "grados", "minutos", "segundos", "distancia", "descripcion",
    "azimut_decimal", "rumbo", "proyeccion_este", "proyeccion_norte", "coordenada_este", "coordenada_norte", "estado_punto",
  ];
  const rows = state.observations.map((observation, index) => {
    const zone = state.zones.find((item) => item.id === observation.zoneId);
    const point = survey.points[index];
    return [
      zone?.name, zone?.color, zone?.type, observation.id, observation.degrees, observation.minutes, observation.seconds,
      observation.distance, observation.description, point.hasCoordinates ? point.azimuth : "", point.hasCoordinates ? point.bearing : "",
      point.hasCoordinates ? point.deltaEast : "", point.hasCoordinates ? point.deltaNorth : "", point.hasCoordinates ? point.east : "",
      point.hasCoordinates ? point.north : "", point.status,
    ];
  });
  const csv = [headers, ...rows].map((row) => row.map(csvEscape).join(",")).join("\r\n");
  downloadFile(`\ufeff${csv}`, `GeoTrazo_${safeFileName(state.projectName)}.csv`, "text/csv;charset=utf-8");
}

function normalizeHeader(value) {
  return String(value || "").trim().toLocaleLowerCase("es").normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function importCsv(file) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const lines = String(reader.result).replace(/^\ufeff/, "").split(/\r?\n/).filter((line) => line.trim());
      if (!lines.length) throw new Error("El archivo está vacío.");
      const parsedRows = lines.map(parseCsvLine);
      const header = parsedRows[0].map(normalizeHeader);
      const hasHeader = header.includes("numero_punto") || header.includes("numero del punto") || header.includes("numero");
      const dataRows = hasHeader ? parsedRows.slice(1) : parsedRows;
      const column = (names, fallback) => {
        for (const name of names) {
          const index = header.indexOf(name);
          if (index >= 0) return index;
        }
        return fallback;
      };
      const indexes = {
        zone: column(["zona", "nombre_zona"], -1),
        color: column(["color_zona", "color"], -1),
        type: column(["tipo_zona", "tipo"], -1),
        id: column(["numero_punto", "numero del punto", "numero"], 0),
        degrees: column(["grados"], 1),
        minutes: column(["minutos"], 2),
        seconds: column(["segundos"], 3),
        distance: column(["distancia"], 4),
        description: column(["descripcion"], 5),
      };
      pushHistory();
      const zonesByName = new Map();
      const importedZones = [];
      const getZone = (row) => {
        const name = indexes.zone >= 0 ? String(row[indexes.zone] || "Zona principal").trim() : "Zona principal";
        const key = name.toLocaleLowerCase("es");
        if (!zonesByName.has(key)) {
          const typeValue = indexes.type >= 0 ? row[indexes.type] : "polygon";
          const type = ["polygon", "line", "points"].includes(typeValue) ? typeValue : "polygon";
          const zone = createZone({
            name,
            color: indexes.color >= 0 ? row[indexes.color] : ZONE_COLORS[importedZones.length % ZONE_COLORS.length],
            type,
          });
          zonesByName.set(key, zone);
          importedZones.push(zone);
        }
        return zonesByName.get(key);
      };
      const observations = dataRows.map((row, index) => {
        const zone = getZone(row);
        return {
          ...defaultObservation(index + 1, zone.id),
          id: String(row[indexes.id] || index + 1),
          degrees: toNumber(row[indexes.degrees]),
          minutes: toNumber(row[indexes.minutes]),
          seconds: toNumber(row[indexes.seconds]),
          distance: toNumber(row[indexes.distance]),
          description: String(row[indexes.description] || ""),
        };
      });
      if (!observations.length) throw new Error("No se encontraron puntos para importar.");
      state.zones = importedZones;
      state.activeZoneId = importedZones[0].id;
      state.observations = observations;
      update(true);
      showToast(`Se importaron ${observations.length} puntos en ${importedZones.length} zona(s).`);
    } catch (error) {
      showToast(error.message || "No se pudo importar el archivo CSV.", true);
    }
  };
  reader.readAsText(file, "utf-8");
}

function parseCsvLine(line) {
  const cells = [];
  let current = "";
  let quoted = false;
  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];
    if (character === '"' && line[index + 1] === '"') {
      current += '"';
      index += 1;
    } else if (character === '"') {
      quoted = !quoted;
    } else if (character === "," && !quoted) {
      cells.push(current);
      current = "";
    } else {
      current += character;
    }
  }
  cells.push(current);
  return cells;
}

function exportGraphImage() {
  const survey = computeSurvey();
  const technicalCanvas = createTechnicalPlanCanvas(survey);
  technicalCanvas.toBlob((blob) => {
    if (!blob) return;
    downloadFile(blob, `GeoTrazo_${safeFileName(state.projectName)}-grafica.png`, "image/png");
  }, "image/png");
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;",
  })[character]);
}

function bearingComponents(azimuth) {
  const normalized = ((azimuth % 360) + 360) % 360;
  let northSouth = "N";
  let eastWest = "E";
  let angle = normalized;
  if (normalized > 90 && normalized <= 180) {
    northSouth = "S";
    angle = 180 - normalized;
  } else if (normalized > 180 && normalized <= 270) {
    northSouth = "S";
    eastWest = "W";
    angle = normalized - 180;
  } else if (normalized > 270) {
    eastWest = "W";
    angle = 360 - normalized;
  }
  return { northSouth, eastWest, ...decimalToDms(angle) };
}

function reportSegments(survey) {
  const segments = new Map();
  state.zones.forEach((zone) => {
    const points = survey.analyses.get(zone.id).points;
    points.forEach((point, index) => {
      const next = points[index + 1] || (zone.type === "polygon" && zone.closed && points.length > 2 ? points[0] : null);
      if (!next || zone.type === "points") return;
      segments.set(point.uid, {
        distance: Math.hypot(next.east - point.east, next.north - point.north),
        label: `d${point.id || index + 1}-${next.id || (index + 2)}`,
      });
    });
  });
  return segments;
}

function printReport() {
  const survey = computeSurvey();
  const scale = drawingScaleDetails(survey);
  const image = createTechnicalPlanCanvas(survey).toDataURL("image/png");
  const templateUrl = new URL("./assets/report-template.png", window.location.href).href;
  const segmentByPoint = reportSegments(survey);
  const validPoints = survey.points.filter((point) => point.hasCoordinates);
  const totalArea = state.zones.reduce((sum, zone) => sum + survey.analyses.get(zone.id).area, 0);
  const totalPerimeter = state.zones.reduce((sum, zone) => sum + survey.analyses.get(zone.id).measure, 0);
  const zoneRows = state.zones.map((zone) => {
    const analysis = survey.analyses.get(zone.id);
    return `<tr><td>${escapeHtml(zone.name)}</td><td>${escapeHtml(zoneTypeLabel(zone.type))}</td><td>${analysis.count}</td><td>${formatNumber(analysis.area)}</td><td>${formatNumber(analysis.measure)}</td></tr>`;
  }).join("");
  const pointRows = validPoints.map((point) => {
    const zone = state.zones.find((item) => item.id === point.zoneId);
    const source = point.source;
    const bearing = bearingComponents(point.azimuth);
    const segment = segmentByPoint.get(point.uid);
    const northProjection = point.deltaNorth >= 0 ? formatNumber(point.deltaNorth) : "";
    const southProjection = point.deltaNorth < 0 ? formatNumber(Math.abs(point.deltaNorth)) : "";
    const eastProjection = point.deltaEast >= 0 ? formatNumber(point.deltaEast) : "";
    const westProjection = point.deltaEast < 0 ? formatNumber(Math.abs(point.deltaEast)) : "";
    return `<tr>
      <td>${escapeHtml(point.id)}</td><td>${escapeHtml(zone?.name || "")}</td><td>${escapeHtml(point.description)}</td>
      <td>${formatPlainNumber(source.degrees, 0)}</td><td>${formatPlainNumber(source.minutes, 0)}</td><td>${formatPlainNumber(source.seconds, 3)}</td>
      <td>${formatNumber(point.distance)}</td><td>${formatNumber(Math.sin(point.radians), 6)}</td><td>${formatNumber(Math.cos(point.radians), 6)}</td>
      <td>${bearing.northSouth}</td><td>${bearing.degrees}</td><td>${bearing.minutes}</td><td>${formatPlainNumber(bearing.seconds, 3)}</td><td>${bearing.eastWest}</td>
      <td>${northProjection}</td><td>${southProjection}</td><td>${eastProjection}</td><td>${westProjection}</td>
      <td>${formatNumber(point.north)}</td><td>${formatNumber(point.east)}</td>
      <td>${segment ? formatNumber(segment.distance) : ""}</td><td>${segment ? escapeHtml(segment.label) : ""}</td>
    </tr>`;
  }).join("");
  const initialRow = `<tr class="initial-row"><td>BM</td><td>Referencia</td><td>Coordenada inicial</td><td colspan="15"></td><td>${formatNumber(toNumber(state.station.north))}</td><td>${formatNumber(toNumber(state.station.east))}</td><td colspan="2"></td></tr>`;
  const modifiedDate = new Date(state.modifiedAt);
  const dateText = Number.isNaN(modifiedDate.getTime()) ? "" : modifiedDate.toLocaleDateString("es-CO");
  const popup = window.open("", "_blank", "width=1100,height=800");
  if (!popup) {
    showToast("El navegador bloqueó la ventana de impresión. Permita las ventanas emergentes e inténtelo de nuevo.", true);
    return;
  }
  popup.document.write(`<!doctype html><html lang="es"><head><meta charset="utf-8"><title>Informe_TopoRay_${escapeHtml(safeFileName(state.projectName))}</title><style>
    @page{size:letter landscape;margin:0}
    *{box-sizing:border-box}html,body{width:11in;height:8.5in;margin:0;background:#fff;font-family:Segoe UI,Arial,sans-serif;color:#182126}body{-webkit-print-color-adjust:exact;print-color-adjust:exact}.print-command{position:fixed;top:8px;left:8px;z-index:20;padding:8px 12px}.report-page{position:relative;width:11in;height:8.5in;overflow:hidden;background:#fff}.template-background{position:absolute;inset:0;z-index:0;width:100%;height:100%;object-fit:fill}.report-content{position:absolute;z-index:2;top:1.34in;right:.64in;bottom:1.12in;left:.64in;overflow:hidden}h1{font-size:17px;margin:0 0 2px}p{margin:2px 0;color:#5d6d76}.general-data{margin-bottom:6px;font-size:7.5px;white-space:nowrap}.layout{display:grid;grid-template-columns:49% 51%;height:2.68in;gap:12px;align-items:start;margin-bottom:6px}.plan-image{display:block;width:100%;height:2.62in;border:1px solid #cbd6da;object-fit:contain;background:#0b1115}h2{font-size:11px;margin:0 0 4px}.zone-table,.main-table{width:100%;border-collapse:collapse;table-layout:fixed}.zone-table{font-size:7px}.main-table{font-size:5.35px}.zone-table th,.zone-table td{border:1px solid #cbd6da;padding:3px;text-align:left}.zone-table th{background:#eaf1ef}.main-table th,.main-table td{border:.5px solid #111;padding:1px;text-align:center;vertical-align:middle;overflow-wrap:anywhere;line-height:1.05}.main-table thead th{font-weight:700;background:#fff}.main-table thead tr:first-child th{font-size:5.7px}.main-table td:nth-child(2),.main-table td:nth-child(3){text-align:left}.initial-row td{height:10px}.table-title{margin-top:2px}.report-total{margin:4px 7% 0 0;text-align:right;font-size:7px;font-weight:700}@media screen{html,body{width:auto;height:auto;min-height:100%;background:#dfe5e7}body{padding:48px 16px 16px}.report-page{margin:0 auto;box-shadow:0 10px 30px rgba(0,0,0,.18)}}@media print{.print-command{display:none}body{padding:0}.report-page{margin:0;break-after:page}}
  </style></head><body><button class="print-command" onclick="window.print()">Imprimir o guardar como PDF</button>
    <main class="report-page">
      <img class="template-background" src="${escapeHtml(templateUrl)}" alt="Plantilla del informe">
      <section class="report-content">
        <h1>${escapeHtml(state.projectName)}</h1>
        <p>Estación inicial: E ${formatNumber(toNumber(state.station.east))} / N ${formatNumber(toNumber(state.station.north))}</p>
        <p class="general-data">Fecha: ${escapeHtml(dateText)} · Formato ${state.drawingScale.paper} ${state.drawingScale.orientation} · Escala 1:${scale.selected} · Área total: ${formatNumber(totalArea)} ${areaUnitSymbol()} · Perímetro / longitud: ${formatNumber(totalPerimeter)} ${unitSymbol()}</p>
        <div class="layout"><img class="plan-image" src="${image}" alt="Plano del levantamiento"><div><h2>Resumen por zonas</h2><table class="zone-table"><thead><tr><th>Zona</th><th>Tipo</th><th>Puntos</th><th>Área (${areaUnitSymbol()})</th><th>Perímetro / longitud (${unitSymbol()})</th></tr></thead><tbody>${zoneRows}</tbody></table></div></div>
        <h2 class="table-title">Puntos y resultados</h2>
        <table class="main-table"><thead><tr><th rowspan="2">Punto</th><th colspan="2">DATOS</th><th colspan="3">AZIMUT</th><th rowspan="2">DIST.</th><th rowspan="2">E-Sen-W</th><th rowspan="2">N-Cos-S</th><th colspan="5">RUMBO</th><th colspan="4">PROYECCIONES</th><th colspan="2">COORDENADAS</th><th colspan="2">PERÍMETRO</th></tr><tr><th>Zona</th><th>Descripción</th><th>GG</th><th>MM</th><th>SS</th><th>N-S</th><th>gg</th><th>mm</th><th>ss</th><th>E-W</th><th>N(+)</th><th>S(-)</th><th>E(+)</th><th>W(-)</th><th>N</th><th>E</th><th>Dist.</th><th>d[P-P(+1)]</th></tr></thead><tbody>${initialRow}${pointRows || '<tr><td colspan="22">No hay puntos calculados.</td></tr>'}</tbody></table>
        <div class="report-total">Perímetro / longitud total: ${formatNumber(totalPerimeter)} ${unitSymbol()}</div>
      </section>
    </main>
  </body></html>`);
  popup.document.close();
  popup.focus();
}

function switchView(view) {
  if (!els.viewPanels.some((panel) => panel.dataset.viewPanel === view)) return;
  activeView = view;
  els.viewPanels.forEach((panel) => panel.classList.toggle("is-active", panel.dataset.viewPanel === view));
  els.navButtons.forEach((button) => button.classList.toggle("is-active", button.dataset.view === view));
  els.mobileNavButtons.forEach((button) => button.classList.toggle("is-active", button.dataset.view === view));
  els.sidebar.classList.remove("is-mobile-open");
  els.sidebarBackdrop.classList.remove("is-visible");
  if (view === "plan" && state) window.requestAnimationFrame(() => drawPlot(computeSurvey()));
}

function toggleSidebar() {
  if (window.matchMedia("(max-width: 980px)").matches) {
    const open = els.sidebar.classList.toggle("is-mobile-open");
    els.sidebarBackdrop.classList.toggle("is-visible", open);
    return;
  }
  const collapsed = els.sidebar.classList.toggle("is-collapsed");
  document.body.classList.toggle("sidebar-collapsed", collapsed);
}

function selectedPointIndex() {
  return state.observations.findIndex((observation) => observation.uid === selectedPointUid);
}

function setQuickMode(mode) {
  quickMode = quickMode === mode ? null : mode;
  if (quickMode !== "measure") measurePointUids = [];
  [els.quickSelectPoint, els.quickMovePoint, els.quickClearPoint, els.quickMeasure].forEach((button) => {
    button.classList.toggle("is-active", button === {
      select: els.quickSelectPoint,
      move: els.quickMovePoint,
      clear: els.quickClearPoint,
      measure: els.quickMeasure,
    }[quickMode]);
  });
  updateStats(computeSurvey());
}

function clearPointValues(index) {
  const observation = state.observations[index];
  if (!observation) return;
  pushHistory();
  state.observations[index] = {
    ...defaultObservation(observation.id || nextPointNumber(observation.zoneId), observation.zoneId),
    uid: observation.uid,
    id: observation.id,
  };
  selectedPointUid = null;
  quickMode = null;
  update(true);
  showToast("Se limpiaron los valores del punto. Puede recuperarlos con Deshacer.");
}

function pointNearCanvasEvent(event) {
  if (!plotTransform) return null;
  const rect = els.canvas.getBoundingClientRect();
  const px = event.clientX - rect.left;
  const py = event.clientY - rect.top;
  const survey = computeSurvey();
  const visibleZones = new Set(state.zones.filter((zone) => zone.visible).map((zone) => zone.id));
  const candidates = survey.points.filter((point) => point.hasCoordinates && visibleZones.has(point.zoneId));
  let nearest = null;
  let nearestDistance = 20;
  candidates.forEach((point) => {
    const distance = Math.hypot(plotTransform.x(point.east) - px, plotTransform.y(point.north) - py);
    if (distance < nearestDistance) {
      nearest = point;
      nearestDistance = distance;
    }
  });
  return nearest;
}

function handleCanvasTool(event) {
  const point = pointNearCanvasEvent(event);
  if (!point) {
    showToast("No hay un punto cerca de esa posicion.", true);
    return;
  }
  selectedPointUid = point.uid;
  if (quickMode === "move") {
    const index = selectedPointIndex();
    quickMode = null;
    openPointDialog(index);
  } else if (quickMode === "clear") {
    clearPointValues(selectedPointIndex());
  } else if (quickMode === "measure") {
    if (!measurePointUids.includes(point.uid)) measurePointUids.push(point.uid);
    if (measurePointUids.length === 2) {
      const survey = computeSurvey();
      const [first, second] = measurePointUids.map((uid) => survey.points.find((item) => item.uid === uid));
      const distance = Math.hypot(second.east - first.east, second.north - first.north);
      showToast(`Distancia entre puntos ${first.id} y ${second.id}: ${formatNumber(distance)} ${unitSymbol()}`);
      measurePointUids = [];
      quickMode = null;
    }
  } else {
    quickMode = null;
  }
  update(false);
}

function openNewProjectDialog() {
  els.newProjectName.value = "Nuevo levantamiento";
  els.newProjectEast.value = "";
  els.newProjectNorth.value = "";
  els.newProjectDialog.showModal();
  els.newProjectName.focus();
  els.newProjectName.select();
}

function createProjectFromDialog() {
  const name = normalizeProjectName(els.newProjectName.value);
  const eastText = els.newProjectEast.value.trim();
  const northText = els.newProjectNorth.value.trim();
  const east = Number(eastText);
  const north = Number(northText);
  if (!eastText || !Number.isFinite(east)) {
    showToast("Ingrese una coordenada Este inicial válida.", true);
    return;
  }
  if (!northText || !Number.isFinite(north)) {
    showToast("Ingrese una coordenada Norte inicial válida.", true);
    return;
  }
  const projects = loadProjects();
  if (projects[name] && !window.confirm(`Ya existe "${name}". ¿Desea reemplazarlo con un proyecto nuevo?`)) return;
  state = createBlankState(name);
  state.station = { east, north };
  loadedProjectName = null;
  undoStack.length = 0;
  redoStack.length = 0;
  els.newProjectDialog.close();
  syncControls();
  update(true);
  saveNamedProject();
}

function setZoom(factor) {
  state.view.zoom = clampNumber(state.view.zoom * factor, 0.5, 20);
  update(false);
}

els.stationEast.addEventListener("focus", rememberInputState);
els.stationEast.addEventListener("input", () => {
  state.station.east = toNumber(els.stationEast.value);
  update(false);
});
els.stationNorth.addEventListener("focus", rememberInputState);
els.stationNorth.addEventListener("input", () => {
  state.station.north = toNumber(els.stationNorth.value);
  update(false);
});
els.projectName.addEventListener("focus", rememberInputState);
els.projectName.addEventListener("input", () => {
  state.projectName = els.projectName.value;
  saveLocalState();
});
els.showLines.addEventListener("change", () => {
  pushHistory();
  state.showLines = els.showLines.checked;
  update(false);
});
els.showGrid.addEventListener("change", () => {
  pushHistory();
  state.showGrid = els.showGrid.checked;
  update(false);
});
els.showZoneNames.addEventListener("change", () => {
  pushHistory();
  state.showZoneNames = els.showZoneNames.checked;
  update(false);
});
els.axisDecimals.addEventListener("change", () => {
  state.axisDecimals = Number.parseInt(els.axisDecimals.value, 10) || 0;
  update(false);
});
els.units.addEventListener("change", () => {
  pushHistory();
  state.units = els.units.value === "ft" ? "ft" : "m";
  update(false);
});
els.gridSize.addEventListener("change", () => {
  pushHistory();
  state.gridSize = Number(els.gridSize.value) || 0;
  update(false);
});
els.appearance.addEventListener("change", () => {
  pushHistory();
  state.appearance = els.appearance.value === "light" ? "light" : "dark";
  document.body.dataset.theme = state.appearance;
  update(false);
});
els.showPointNumbers.addEventListener("change", () => {
  pushHistory();
  state.showPointNumbers = els.showPointNumbers.checked;
  update(false);
});
els.autoClosePolygons.addEventListener("change", () => {
  pushHistory();
  state.autoClosePolygons = els.autoClosePolygons.checked;
  update(false);
});
els.activeZone.addEventListener("change", () => setActiveZone(els.activeZone.value));
els.activeZoneName.addEventListener("focus", rememberInputState);
els.activeZoneName.addEventListener("input", () => {
  const zone = state.zones.find((item) => item.id === state.activeZoneId);
  if (!zone) return;
  zone.name = els.activeZoneName.value;
  update(false);
});
els.activeZoneName.addEventListener("blur", () => {
  const zone = state.zones.find((item) => item.id === state.activeZoneId);
  if (!zone) return;
  let name = els.activeZoneName.value.trim() || "Zona sin nombre";
  const duplicate = state.zones.some(
    (item) => item.id !== zone.id && item.name.toLocaleLowerCase("es") === name.toLocaleLowerCase("es")
  );
  if (duplicate) {
    name = uniqueZoneName(name);
    showToast(`El nombre ya existía. La zona se guardó como "${name}".`);
  }
  zone.name = name;
  els.activeZoneName.value = name;
  update(true);
});
els.activeZoneColor.addEventListener("focus", rememberInputState);
els.activeZoneColor.addEventListener("input", () => {
  const zone = state.zones.find((item) => item.id === state.activeZoneId);
  if (!zone) return;
  zone.color = els.activeZoneColor.value;
  update(false);
});
els.activeZoneType.addEventListener("change", () => {
  const zone = state.zones.find((item) => item.id === state.activeZoneId);
  if (!zone) return;
  pushHistory();
  const previousType = zone.type;
  zone.type = els.activeZoneType.value;
  if (zone.type !== "polygon") zone.closed = false;
  if (zone.type === "polygon" && previousType !== "polygon") zone.closed = state.autoClosePolygons;
  update(true);
});
els.addRow.addEventListener("click", () => {
  if (!state.zones.some((zone) => zone.id === state.activeZoneId)) {
    showToast("Seleccione o cree una zona antes de agregar un punto.", true);
    return;
  }
  openPointDialog();
});
els.quickAddPoint.addEventListener("click", () => openPointDialog());
els.cancelPoint.addEventListener("click", () => els.pointDialog.close());
els.dismissPoint.addEventListener("click", () => els.pointDialog.close());
els.pointForm.addEventListener("submit", (event) => {
  event.preventDefault();
  savePointFromDialog();
});
els.pointNumber.addEventListener("input", () => {
  els.pointNumber.value = els.pointNumber.value.replace(/[^0-9]/g, "");
});
els.pointDegrees.addEventListener("input", () => {
  if (Number(els.pointDegrees.value) === 360) {
    els.pointMinutes.value = "0";
    els.pointSeconds.value = "0";
  }
  const locked = Number(els.pointDegrees.value) === 360;
  els.pointMinutes.disabled = locked;
  els.pointSeconds.disabled = locked;
});
els.pointZone.addEventListener("change", () => {
  if (editingPointIndex === null) els.pointNumber.value = String(nextPointNumber(els.pointZone.value));
});
els.addZone.addEventListener("click", () => openZoneDialog());
els.zoneReferenceType.addEventListener("change", syncReferenceFields);
els.cancelZone.addEventListener("click", () => els.zoneDialog.close());
els.dismissZone.addEventListener("click", () => els.zoneDialog.close());
els.zoneForm.addEventListener("submit", (event) => {
  event.preventDefault();
  saveZoneFromDialog();
});
els.fit.addEventListener("click", () => {
  state.view = { zoom: 1, panEast: 0, panNorth: 0 };
  update(false);
});
els.center.addEventListener("click", () => {
  state.view.panEast = 0;
  state.view.panNorth = 0;
  update(false);
});
els.zoomIn.addEventListener("click", () => setZoom(1.25));
els.zoomOut.addEventListener("click", () => setZoom(0.8));
els.sample.addEventListener("click", setSample);
els.exportCsv.addEventListener("click", exportCsv);
els.exportProcess.addEventListener("click", exportCalculationProcess);
els.exportTxt.addEventListener("click", exportCoordinatesTxt);
els.exportImage.addEventListener("click", exportGraphImage);
els.printReport.addEventListener("click", printReport);
els.importFile.addEventListener("change", () => {
  const [file] = els.importFile.files;
  if (file) importCsv(file);
  els.importFile.value = "";
});
els.newProject.addEventListener("click", openNewProjectDialog);
els.cancelNewProject.addEventListener("click", () => els.newProjectDialog.close());
els.dismissNewProject.addEventListener("click", () => els.newProjectDialog.close());
els.newProjectForm.addEventListener("submit", (event) => {
  event.preventDefault();
  createProjectFromDialog();
});
els.saveProject.addEventListener("click", saveNamedProject);
els.openProject.addEventListener("click", () => loadProjectByName(els.projectList.value));
els.duplicateProject.addEventListener("click", () => duplicateProjectByName(els.projectList.value));
els.deleteProject.addEventListener("click", () => deleteProjectByName(els.projectList.value));
els.undo.addEventListener("click", undo);
els.redo.addEventListener("click", redo);
els.navButtons.forEach((button) => button.addEventListener("click", () => switchView(button.dataset.view)));
els.mobileNavButtons.forEach((button) => button.addEventListener("click", () => switchView(button.dataset.view)));
els.viewTargets.forEach((button) => button.addEventListener("click", () => switchView(button.dataset.viewTarget)));
els.sidebarToggle.addEventListener("click", toggleSidebar);
els.sidebarBackdrop.addEventListener("click", toggleSidebar);
els.mobileMore.addEventListener("click", () => {
  els.sidebar.classList.add("is-mobile-open");
  els.sidebarBackdrop.classList.add("is-visible");
});
els.pointSearch.addEventListener("input", applyPointFilters);
els.pointZoneFilter.addEventListener("change", applyPointFilters);
els.pointStatusFilter.addEventListener("change", applyPointFilters);
els.clearPointFilters.addEventListener("click", () => {
  els.pointSearch.value = "";
  els.pointZoneFilter.value = "";
  els.pointStatusFilter.value = "";
  applyPointFilters();
});
els.calculationZoneFilter.addEventListener("change", () => renderCalculations(computeSurvey()));
els.calculationPointFilter.addEventListener("change", () => renderCalculations(computeSurvey()));
els.paperFormat.addEventListener("change", () => {
  pushHistory();
  state.drawingScale.paper = els.paperFormat.value;
  update(false);
});
els.paperOrientation.addEventListener("change", () => {
  pushHistory();
  state.drawingScale.orientation = els.paperOrientation.value;
  update(false);
});
els.drawingScaleMode.addEventListener("change", () => {
  pushHistory();
  state.drawingScale.mode = els.drawingScaleMode.value;
  update(false);
});
els.drawingScale.addEventListener("change", () => {
  pushHistory();
  state.drawingScale.denominator = Number(els.drawingScale.value);
  update(false);
});
els.quickSelectPoint.addEventListener("click", () => setQuickMode("select"));
els.quickMovePoint.addEventListener("click", () => {
  const index = selectedPointIndex();
  if (index >= 0) openPointDialog(index);
  else setQuickMode("move");
});
els.quickClearPoint.addEventListener("click", () => {
  const index = selectedPointIndex();
  if (index >= 0) clearPointValues(index);
  else setQuickMode("clear");
});
els.quickMeasure.addEventListener("click", () => {
  measurePointUids = [];
  setQuickMode("measure");
});
els.quickPoints.addEventListener("click", () => {
  pushHistory();
  state.showPoints = !state.showPoints;
  update(false);
});
els.quickLines.addEventListener("click", () => {
  pushHistory();
  state.showLines = !state.showLines;
  syncControls();
  update(false);
});
els.quickGrid.addEventListener("click", () => {
  pushHistory();
  state.showGrid = !state.showGrid;
  syncControls();
  update(false);
});

els.canvas.addEventListener("wheel", (event) => {
  event.preventDefault();
  setZoom(event.deltaY < 0 ? 1.12 : 0.89);
}, { passive: false });
els.canvas.addEventListener("pointerdown", (event) => {
  if (!plotTransform) return;
  if (quickMode) {
    handleCanvasTool(event);
    return;
  }
  dragState = {
    x: event.clientX,
    y: event.clientY,
    panEast: state.view.panEast,
    panNorth: state.view.panNorth,
  };
  els.canvas.setPointerCapture(event.pointerId);
  els.canvasWrap.classList.add("is-dragging");
});
els.canvas.addEventListener("pointermove", (event) => {
  if (!dragState || !plotTransform) return;
  const eastPerPixel = (plotTransform.eastAxis.max - plotTransform.eastAxis.min) / plotTransform.plotW;
  const northPerPixel = (plotTransform.northAxis.max - plotTransform.northAxis.min) / plotTransform.plotH;
  state.view.panEast = dragState.panEast - (event.clientX - dragState.x) * eastPerPixel;
  state.view.panNorth = dragState.panNorth + (event.clientY - dragState.y) * northPerPixel;
  drawPlot(computeSurvey());
});
function endDrag() {
  if (!dragState) return;
  dragState = null;
  els.canvasWrap.classList.remove("is-dragging");
  saveLocalState();
}
els.canvas.addEventListener("pointerup", endDrag);
els.canvas.addEventListener("pointercancel", endDrag);
window.addEventListener("resize", () => drawPlot(computeSurvey()));

load();

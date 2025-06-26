import * as d3 from "d3";
import { loadObjects } from "./loader";
import { findInvalidRouteIds } from "./error_detector";
import {
  countStart,
  addAnimationPlayEvent,
  addProgressEvent,
  initializeSimulation,
  generatePairRoutes,
} from "./simulation/runner";
import {
  routes,
  operators,
  facilities,
  addFacility,
  addRoute,
  deleteRoute,
  deleteFacility,
  setInitial,
  setParams,
} from "./simulation/params_setter";
import {
  inactivePlayButtons,
  // linkClicked,
  // nodeClicked,
  findClickedFacility,
  nodeMouseOver,
  nodeMouseOut,
  linkMouseOver,
  linkMouseOut,
  drawLink,
  activePlayButtons,
  // changeActiveObject,
  displayOperator,
  displayRaiseOperator,
  findClickedRoute,
} from "./render";

export let link, node, simulation;
export let facilityDialog,
  confirmBtn,
  routeDialog,
  routeConfirmBtn,
  facilityForm,
  routeForm;

let ghostNode, tempLine;

export async function setClickEventToObject(object) {
  const svg = d3.select("#svg02");
  switch (object.state) {
    case "edit":
      clearGhostObjects();
      removeSelectAttribute();
      changeActiveObject({ routes, facilities });
      svg.on("click", null);
      svg.on("mousemove", null);
      svg.selectAll("line").on("click", function () {
        const routeForEdit = findClickedRoute(this, routes);
        setRouteDataToModal(routeForEdit);
        routeDialog.showModal();
      });
      svg.selectAll("circle").on("click", function () {
        const facilityForEdit = findClickedFacility(this, facilities);
        setFacilityDataToModal(facilityForEdit);
        facilityDialog.showModal();
      });
      svg.selectAll("line").on("mouseover", linkMouseOver);
      svg.selectAll("line").on("mouseout", linkMouseOut);
      svg.selectAll("circle").on("mouseover", nodeMouseOver);
      svg.selectAll("circle").on("mouseout", nodeMouseOut);
      break;
    case "add-operator":
      svg.on("click", null);
      break;
    case "add-facility":
      switchAddFacilityMode();
      break;
    case "delete":
      switchDeleteObjectMode();
      break;
    case "link":
      switchAddRouteMode();
      break;
  }
}

function changeActiveObject(params) {
  const routes = params["routes"];
  const facilities = params["facilities"];
  d3.select("#svg02")
    .selectAll("line")
    .on("click", function () {
      const routeForEdit = findClickedRoute(this, routes);
      setRouteDataToModal(routeForEdit);
      routeDialog.showModal();
    });
  d3.select("#svg02")
    .selectAll("circle")
    .on("click", function () {
      const facilityForEdit = findClickedFacility(this, facilities);
      setFacilityDataToModal(facilityForEdit);
      facilityDialog.showModal();
    });
}

export function switchDeleteObjectMode() {
  const svg = d3.select("#svg02");
  clearGhostObjects();
  removeSelectAttribute();

  svg.on("click", null);
  svg.on("mousemove", null);
  svg.selectAll("line").on("mouseover", linkMouseOver);
  svg.selectAll("line").on("mouseout", linkMouseOut);
  svg.selectAll("circle").on("mouseover", nodeMouseOver);
  svg.selectAll("circle").on("mouseout", nodeMouseOut);
  svg.selectAll("line").on("click", function () {
    const params = deleteRoute(this);
    drawLink(params["routes"], params["facilities"]);
  });
  svg.selectAll("circle").on("click", function () {
    const params = deleteFacility(this);
    drawLink(params["routes"], params["facilities"]);
  });
}

export function switchAddFacilityMode() {
  const svg = d3.select("#svg02");
  clearGhostObjects();
  removeSelectAttribute();

  svg.selectAll("line").on("click", null);
  svg.selectAll("circle").on("click", null);
  svg.selectAll("line").on("mouseover", null);
  svg.selectAll("line").on("mouseout", null);
  svg.selectAll("circle").on("mouseover", null);
  svg.selectAll("circle").on("mouseout", null);
  svg.on("click", null);
  svg.on("click", function (e) {
    const [x, y] = d3.pointer(e, this);
    const params = addFacility([x, y]);
    drawLink(params["routes"], params["facilities"]);
  });

  svg.on("mousemove", function (e) {
    const [x, y] = d3.pointer(e, this);
    if (!ghostNode) {
      ghostNode = d3
        .select("#svg02")
        .append("circle")
        .attr("r", 15)
        .attr("fill", "gray");
    }
    ghostNode.attr("cx", x).attr("cy", y);
  });
}

export function switchAddRouteMode() {
  const svg = d3.select("#svg02");
  clearGhostObjects();
  removeSelectAttribute();

  svg.selectAll("circle").on("mouseover", nodeMouseOver);
  svg.selectAll("circle").on("mouseout", nodeMouseOut);

  tempLine = null;
  let isLinking = false;
  svg.on("click", null);
  svg.on("mousemove", null);

  svg.on("mousemove", function (e) {
    if (!isLinking) return;

    const [x, y] = d3.pointer(e);
    tempLine.attr("x2", x).attr("y2", y);
  });

  svg.selectAll("line").on("click", null);
  svg.selectAll("circle").on("click", function () {
    let targetId, sourceId;
    const sourceNode = document.querySelectorAll("circle[selected]");
    isLinking = true;
    const x = this.parentNode.getCTM().e;
    const y = this.parentNode.getCTM().f;

    tempLine = svg
      .insert("line", ":first-child")
      .attr("x1", x)
      .attr("y1", y)
      .attr("x2", x)
      .attr("y2", y)
      .attr("stroke", "gray")
      .attr("stroke-width", 5);

    if (this.hasAttribute("selected")) {
      this.removeAttribute("selected");
    } else {
      this.setAttribute("selected", "");
      if (sourceNode.length !== 0) {
        sourceId = sourceNode[0].id;
        targetId = this.id;
        const params = addRoute(targetId, sourceId);
        drawLink(params["routes"], params["facilities"]);
        isLinking = false;
      } else {
        sourceId = this.id;
      }
    }
  });
}

function clearGhostObjects() {
  if (ghostNode) {
    ghostNode.remove();
    ghostNode = null;
  }
  if (tempLine) {
    tempLine.remove();
    tempLine = null;
  }
}

function removeSelectAttribute() {
  document.querySelectorAll("circle[selected]").forEach((el) => {
    el.removeAttribute("selected");
  });
}
export function setObjectParams(e, params, objects) {
  const id = params.id;
  const selectedObject = objects.find((object) => object.id === id);
  for (const [key, value] of Object.entries(params)) {
    if (key !== "id") {
      selectedObject[key] = value;
    }
  }
  inactivePlayButtons();
}

export function setParamsToFacilityOnModal() {
  facilityDialog = document.getElementById("facilityDialog");
  confirmBtn = document.getElementById("confirmBtn");
  facilityForm = document.getElementById("facility-form");
  const cancelBtn = document.getElementById("cancel-btn");

  if (confirmBtn) {
    confirmBtn.addEventListener("click", (e) => {
      if (!facilityForm.checkValidity()) {
        facilityForm.reportValidity();
        return;
      }

      const params = {};
      params.id = document.getElementById("hidden-id").value;
      params.name = document.getElementById("name").value;
      params.processingTime = document.getElementById("processingTime").value;

      setObjectParams(e, params, facilities);
      drawLink(routes, facilities);
      facilityDialog.close();
    });
  }

  if (cancelBtn) {
    cancelBtn.addEventListener("click", () => {
      facilityDialog.close();
    });
  }
}

export function setParamsToRouteOnModal() {
  routeDialog = document.getElementById("route-dialog");
  routeConfirmBtn = document.getElementById("route-confirm-btn");
  routeForm = document.getElementById("route-form");
  const routeCancelBtn = document.getElementById("route-cancel-btn");

  if (routeConfirmBtn) {
    routeConfirmBtn.addEventListener("click", (e) => {
      if (!routeForm.checkValidity()) {
        routeForm.reportValidity();
        return;
      }
      const params = {};
      params.id = document.getElementById("route-hidden-id").value;
      params.routeLength = document.getElementById("route-length").value;

      setObjectParams(e, params, routes);
      routeDialog.close();
    });
  }

  if (routeCancelBtn) {
    routeCancelBtn.addEventListener("click", () => {
      routeDialog.close();
    });
  }
}

export async function setObjectParamsOnDetailModal() {
  const routesInForm = document.getElementById("simulation-routes");
  const facilitiesInForm = document.getElementById("simulation-facilities");
  const operatorsInForm = document.getElementById("simulation-operators");

  if (routesInForm) {
    routesInForm.value = JSON.stringify(routes);
  }
  if (facilitiesInForm) {
    facilitiesInForm.value = JSON.stringify(facilities);
  }
  if (operatorsInForm) {
    operatorsInForm.value = JSON.stringify(operators);
  }
}

export function addOpenHelpDialogEvent() {
  const helpDialog = document.getElementById("helpDialog");
  const helpDialogs = document.querySelectorAll(".help-button");
  const helpBtns = document.querySelectorAll(".help-button");
  const closeBtns = document.querySelectorAll(".close-button");

  if (helpDialogs.length === 0) {
    return;
  } else {
    helpDialogs.forEach((dialog) => {
      dialog.addEventListener("click", (e) => {
        if (e.target.closest("#help-dialog-container") === null) {
          helpDialog.close();
        }
      });
    });
  }

  if (helpBtns.length === 0) {
    return;
  } else {
    helpBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const targetId = btn.dataset.helpTargetId;
        const dialog = document.getElementById(`${targetId}`);
        dialog.showModal();
      });
    });
  }

  if (closeBtns.length !== 0) {
    closeBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const targetId = btn.dataset.targetId;
        const dialog = document.getElementById(`${targetId}`);
        dialog.close();
      });
    });
  }
}

export function setFacilityDataToModal(facility) {
  const id = document.getElementById("hidden-id");
  const name = document.getElementById("name");
  const processingTime = document.getElementById("processingTime");

  id.value = facility.id;
  name.value = facility.name;
  processingTime.value = facility.processingTime;
}

export function setRouteDataToModal(route) {
  const id = document.getElementById("route-hidden-id");
  const length = document.getElementById("route-length");

  id.value = route.id;
  length.value = route.routeLength;
}

export function displayResultBadge() {
  const badge = document.getElementById("simulation-result-badge");
  if (badge.classList.contains("hidden")) {
    badge.classList.remove("hidden");
  }
}

export function removeResultBadge() {
  const badge = document.getElementById("simulation-result-badge");
  if (!badge.classList.contains("hidden")) {
    badge.classList.add("hidden");
  }
}

function toggleUserMenu() {
  const userMenu = document.getElementById("userMenu");
  userMenu.classList.toggle("hidden");
}

function addToggleMenuEvent() {
  const userMenu = document.getElementById("user-menu-button");
  if (userMenu) {
    userMenu.addEventListener("click", toggleUserMenu, false);
  }
}

// 画面更新時のパラメータ再設定と描画を行う
export async function setupScene() {
  const simulationParameters = document.getElementById("simulation-data");
  if (simulationParameters) {
    const simulationId = simulationParameters.dataset.id;
    if (simulationId === "") {
      const params = setInitial();
      drawLink(params["routes"], params["facilities"]);
    } else {
      const params = await loadObjects();
      setParams(params);
      drawLink(params["routes"], params["facilities"]);
    }
  }
}

export async function setupEventListeners() {
  setupScene();
  await setParamsToFacilityOnModal();
  await setParamsToRouteOnModal();
  addToggleMenuEvent();
  addOpenHelpDialogEvent();
  const start = document.getElementById("startSimulation2");
  if (start) {
    start.addEventListener("click", startSimulation, false);
  }
  addAnimationPlayEvent();
}

export function isConsistency() {
  const result = findInvalidRouteIds(routes);
  if (result.ids.length === 0) {
    return true;
  } else {
    return false;
  }
}

async function startSimulation() {
  const invalidRoutesIds = findInvalidRouteIds(routes);

  if (invalidRoutesIds["ids"].length !== 0) {
    alert("異常なルートがあります。削除してください。");
    drawLink(routes, facilities, invalidRoutesIds);
    return;
  }

  drawLink(routes, facilities);
  await displayOperator();
  addProgressEvent();
  const params = initializeSimulation({ routes, facilities });
  const linksData = generatePairRoutes(params["formattedRoutes"]);

  await drawLink(linksData, params["copiedFacilities"]);
  await countStart(linksData, params["copiedFacilities"]);
  displayRaiseOperator();
  displayResultBadge();
  activePlayButtons();
  alert("シミュレーション終了");
}

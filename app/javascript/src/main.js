import * as d3 from "d3";
import { loadObjects } from "src/loader";
import { findInvalidRouteIds } from "src/error_detector";
import {
  runSimulation,
  addAnimationPlayEvent,
  initializeSimulation,
} from "src/simulation/runner";
import {
  routes,
  operators,
  facilities,
  addFacility,
  addRoute,
  deleteRoute,
  deleteFacility,
  setInitialParams,
  setParams,
} from "src/simulation/params_setter";
import {
  inactivatePlayButtons,
  nodeMouseOver,
  nodeMouseOut,
  linkMouseOver,
  linkMouseOut,
  drawLink,
  activatePlayButtons,
  displayOperator,
  displayRaiseOperator,
} from "src/render";

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
      changeActiveObject();
      svg.on("click", null);
      svg.on("mousemove", null);
      svg
        .selectAll("line")
        .attr("data-action", "click->params#showRouteDialog");
      svg
        .selectAll("circle")
        .attr("data-action", "click->params#showFacilityDialog");
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

function changeActiveObject() {
  d3.select("#svg02")
    .selectAll("line")
    .attr("data-action", "click->params#showRouteDialog");
  d3.select("#svg02")
    .selectAll("circle")
    .attr("data-action", "click->params#showFacilityDialog");
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
  svg.selectAll("line").on("click", async function () {
    const params = deleteRoute(this);
    await renderScene(params["routes"], params["facilities"]);
  });
  svg.selectAll("circle").on("click", async function () {
    const params = deleteFacility(this);
    await renderScene(params["routes"], params["facilities"]);
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
  svg.on("click", async function (e) {
    const [x, y] = d3.pointer(e, this);
    const params = addFacility([x, y]);
    await renderScene(params["routes"], params["facilities"]);
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
  svg.selectAll("circle").on("click", async function () {
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
        await renderScene(params["routes"], params["facilities"]);
        isLinking = false;
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
  inactivatePlayButtons();
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

  if (helpDialogs.length) {
    helpDialogs.forEach((dialog) => {
      dialog.addEventListener("click", (e) => {
        if (e.target.closest("#help-dialog-container")) {
          helpDialog.close();
        }
      });
    });
  }

  if (helpBtns.length) {
    helpBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const targetId = btn.dataset.helpTargetId;
        const dialog = document.getElementById(`${targetId}`);
        dialog.showModal();
      });
    });
  }

  if (closeBtns.length) {
    closeBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const targetId = btn.dataset.targetId;
        const dialog = document.getElementById(`${targetId}`);
        dialog.close();
      });
    });
  }
}

export function displayResultBadge() {
  const badge = document.getElementById("simulation-result-badge");
  badge.classList.remove("hidden");
}

export function removeResultBadge() {
  const badge = document.getElementById("simulation-result-badge");
  badge.classList.add("hidden");
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
      const params = setInitialParams();
      await renderScene(params["routes"], params["facilities"]);
    } else {
      const params = await loadObjects();
      setParams(params);
      await renderScene(params["routes"], params["facilities"]);
    }
  }
}

// 画面更新時に実行される一連の処理
// Stimulusのconnect()から呼ばれる
export async function setupEventListeners() {
  setupScene();
  addToggleMenuEvent();
  addOpenHelpDialogEvent();
  const start = document.getElementById("startSimulation2");
  if (start) {
    start.addEventListener("click", startSimulation, false);
  }
}

export function isConsistency() {
  const result = findInvalidRouteIds(routes);
  return result.ids.length === 0;
}

// シミュレーション実行が押された時の処理
async function startSimulation() {
  const invalidRoutesIds = findInvalidRouteIds(routes);

  if (invalidRoutesIds["ids"].length !== 0) {
    alert("異常なルートがあります。削除してください。");
    await renderScene(routes, facilities, invalidRoutesIds);
    return;
  }

  const params = initializeSimulation({ routes, facilities });

  await renderScene(params["routesWithPairs"], params["facilities"]);
  await displayOperator();

  const result = await runSimulation(params);
  addAnimationPlayEvent(result["timeLine"], result["countHistory"]);
  displayResult(result);
  displayRaiseOperator();
  displayResultBadge();
  activatePlayButtons();
  alert("シミュレーション終了");
}

function displayResult(result) {
  document.getElementById("simulation_cycle_time").value = result["cycleTime"];
  document.getElementById("simulation_bottleneck_process").value =
    result["bottleneckProcess"];
  document.getElementById("simulation_waiting_time").value =
    result["waitingTime"];
}

// 画面描画とmodeに応じたイベントリスナーの登録を行う
export async function renderScene(
  routes,
  facilities,
  invalidRoutesIds = { ids: [] }
) {
  await drawLink(routes, facilities, invalidRoutesIds);
  const selectMode = document.querySelector(
    'fieldset#modeSelection  input[type="radio"]:checked'
  );
  const selectModeName = selectMode ? selectMode.id : undefined;
  const modeState = {};

  switch (selectModeName) {
    case "add-facility":
      modeState.state = "add-facility";
      break;
    case "edit":
      modeState.state = "edit";
      break;
    case "add-link":
      modeState.state = "link";
      break;
    case "delete-object":
      modeState.state = "delete";
      break;
  }
  setClickEventToObject(modeState);
}

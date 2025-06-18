import * as d3 from "d3";
import { inactivePlayButtons } from "src/canvas";
import { routes, operators, facilities } from "src/set_simulation_params";
// データの初期値をロード

export let link, node, simulation;
export let facilityDialog,
  confirmBtn,
  routeDialog,
  routeConfirmBtn,
  facilityForm,
  routeForm;
import {
  addFacility,
  addRoute,
  deleteRoute,
  deleteFacility,
} from "src/set_simulation_params";
import {
  linkClicked,
  nodeClicked,
  nodeMouseOver,
  nodeMouseOut,
  linkMouseOver,
  linkMouseOut,
  drawLink,
} from "src/canvas";
let ghostNode, tempLine;
export async function setClickEventToObject(object) {
  const svg = d3.select("#svg02");
  switch (object.state) {
    case "edit":
      clearGhostObjects();
      removeSelectAttribute();

      svg.on("click", null);
      svg.on("mousemove", null);
      svg.selectAll("line").on("click", linkClicked);
      svg.selectAll("circle").on("click", nodeClicked);
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
  svg.selectAll("line").on("click", deleteRoute);
  svg.selectAll("circle").on("click", deleteFacility);
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
    addFacility([x, y]);
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
    let sourceNode = document.querySelectorAll("circle[selected]");
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
        addRoute(targetId, sourceId);
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
  let id = params.id;
  let selectedObject = objects.find((object) => object.id === id);
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

      let params = {};
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

      let params = {};
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

document.addEventListener("turbo:load", async () => {
  await setParamsToFacilityOnModal();
  await setParamsToRouteOnModal();
});

export async function setObjectParamsOnDetailModal() {
  let routesInForm = document.getElementById("simulation-routes");
  let facilitiesInForm = document.getElementById("simulation-facilities");
  let operatorsInForm = document.getElementById("simulation-operators");

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

document.addEventListener("turbo:load", () => {
  // ヘルプボタンの実装
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
});

export function setFacilityDataToModal(facility) {
  let id = document.getElementById("hidden-id");
  let name = document.getElementById("name");
  let processingTime = document.getElementById("processingTime");

  id.value = facility.id;
  name.value = facility.name;
  processingTime.value = facility.processingTime;
}

export function setRouteDataToModal(route) {
  let id = document.getElementById("route-hidden-id");
  let length = document.getElementById("route-length");

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
  let userMenu = document.getElementById("userMenu");
  userMenu.classList.toggle("hidden");
}

document.addEventListener("turbo:load", () => {
  const userMenu = document.getElementById("user-menu-button");
  if (userMenu) {
    userMenu.addEventListener("click", toggleUserMenu, false);
  }
});

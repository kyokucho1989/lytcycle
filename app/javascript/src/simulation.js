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
// import { changeInactiveObject } from "src/canvas";
import {
  linkClicked,
  nodeClicked,
  nodeMouseOver,
  nodeMouseOut,
  linkMouseOver,
  linkMouseOut,
} from "src/canvas";
let ghostNode, tempLine;
export async function setClickEventToObject(object) {
  const svg = d3.select("#svg02");
  switch (object.state) {
    case "edit":
      console.log("edit");
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
      console.log("add-operator");
      break;
    case "add-facility":
      switchAddFacilityMode();
      console.log("add-facility");
      break;
    case "delete":
      switchDeleteObjectMode();
      console.log("delete");
      break;
    case "link":
      switchAddRouteMode();
      console.log("link");
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
      if (sourceNode.length != 0) {
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
export function setObjectparams(e, params, objects) {
  let id = params.id;
  let selectedObject = objects.find((object) => object.id == id);
  for (const [key, value] of Object.entries(params)) {
    if (key != "id") {
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

      setObjectparams(e, params, facilities);
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

      setObjectparams(e, params, routes);
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

document.addEventListener("turbo:load", () => {
  // シミュレーション保存ボタンを押したときの処理
  setSimulationSaveEvent();

  // ヘルプボタンの実装
  const closeBtn = document.getElementById("help-close");
  const helpDialog = document.getElementById("helpDialog");
  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      helpDialog.close();
    });
  }

  helpDialog.addEventListener("click", (e) => {
    if (e.target.closest("#help-dialog-container") === null) {
      helpDialog.close();
    }
  });
  if (document.querySelectorAll(".help-button")) {
    document.querySelectorAll(".help-button").forEach((btn) => {
      btn.addEventListener("click", () => {
        const title = btn.dataset.helpTitle;
        const text = btn.dataset.helpText;

        helpDialog.querySelector("#help-title").textContent = title;
        helpDialog.querySelector("#help-text").textContent = text;
        helpDialog.showModal();
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

export async function setSimulationSaveEvent() {
  const saveSimulationButton = document.getElementById("savesimulation");
  if (saveSimulationButton) {
    saveSimulationButton.addEventListener("click", (event) => {
      event.preventDefault();
      const form = document.getElementById("simulationForm");
      const formData = new FormData(form);
      formData.append("js_routes", JSON.stringify(routes));
      formData.append("js_operators", JSON.stringify(operators));
      formData.append("js_facilities", JSON.stringify(facilities));

      fetch(form.action, {
        method: "POST",
        headers: {
          "X-CSRF-Token": document
            .querySelector("meta[name='csrf-token']")
            .getAttribute("content"),
          Accept: "application/json",
        },
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Success:", data);
          // 成功時の処理（ページ遷移など）
          window.location.href = data.location;
        })
        .catch((error) => {
          console.error("Error:", error);
          // エラー時の処理
        });
    });
  }
}

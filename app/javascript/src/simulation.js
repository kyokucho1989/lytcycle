import * as d3 from "d3";
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
import { changeInactiveObject } from "src/canvas";
import { linkClicked, nodeClicked } from "src/canvas";

export function setClickEventToObject(object) {
  if (object.mainState == "running") {
    console.log("run");
    changeInactiveObject();
  } else {
    switch (object.subState) {
      case "select":
        // d3.select("#svg02").on("click", null);
        console.log("select");
        d3.select("#svg02").selectAll("line").on("click", linkClicked);
        d3.select("#svg02").selectAll("circle").on("click", nodeClicked);
        break;
      case "add-operator":
        d3.select("#svg02").on("click", null);
        console.log("add-operator");
        break;
      case "add-facility":
        switchAddFacilityMode();
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
}

export function switchDeleteObjectMode() {
  d3.select("#svg02").on("click", null);
  d3.select("#svg02").selectAll("line").on("click", deleteRoute);
  d3.select("#svg02").selectAll("circle").on("click", deleteFacility);
}

export function switchAddFacilityMode() {
  const svg = d3.select("#svg02");
  svg.on("click", null);
  svg.on("click", function (e) {
    const [x, y] = d3.pointer(e, this);
    addFacility([x, y]);
  });
}

export function switchAddRouteMode() {
  d3.select("#svg02").on("click", null);
  d3.select("#svg02").selectAll("line").on("click", null);
  d3.select("#svg02").selectAll("circle").on("click", addRoute);
}

export function setObjectparams(e, params, objects) {
  let id = params.id;
  let selectedObject = objects.find((object) => object.id == id);
  for (const [key, value] of Object.entries(params)) {
    if (key != "id") {
      selectedObject[key] = value;
    }
  }
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

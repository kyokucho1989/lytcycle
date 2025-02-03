import * as d3 from "d3";
import { routes, operators, facilities } from "src/set_simulation_params";
// データの初期値をロード

export let link, node, simulation;
export let facilityDialog, confirmBtn, routeDialog, routeConfirmBtn;
import { addFacility } from "src/set_simulation_params";
import { changeInactiveObject } from "src/canvas";
import { linkClicked, nodeClicked } from "src/canvas";

export function setClickEventToObject(object) {
  if (object.mainState == "running") {
    console.log("run");
    changeInactiveObject();
  } else {
    switch (object.subState) {
      case "select":
        d3.select("#svg02").on("click", null);
        console.log("select");
        break;
      case "add-operator":
        d3.select("#svg02").on("click", null);
        console.log("add-operator");
        break;
      case "add-facility":
        switchAddFacilityMode();
        break;
      case "delete":
        d3.select("#svg02").on("click", null);
        console.log("delete");
        break;
      case "link":
        d3.select("#svg02").on("click", null);
        console.log("link");
        break;
    }
    d3.select("#svg02").selectAll("line").on("click", linkClicked);
    d3.select("#svg02").selectAll("circle").on("click", nodeClicked);
  }
}

export function switchAddFacilityMode() {
  const svg = d3.select("#svg02");
  svg.on("click", null);
  svg.on("click", function (e) {
    const [x, y] = d3.pointer(e, this);
    addFacility([x, y]);
  });
}

export function setObjectparams(e, params, objects) {
  e.preventDefault(); // この偽フォームを送信しない
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
  if (confirmBtn) {
    confirmBtn.addEventListener("click", (e) => {
      // e.preventDefault();
      let params = {};
      params.id = document.getElementById("hidden-id").value;
      params.name = document.getElementById("name").value;
      params.processingTime = document.getElementById("processingTime").value;

      setObjectparams(e, params, facilities);
      facilityDialog.close();
    });
  }
}

export function setParamsToRouteOnModal() {
  routeDialog = document.getElementById("route-dialog");
  routeConfirmBtn = document.getElementById("route-confirm-btn");
  if (routeConfirmBtn) {
    // ［確認］ボタンが既定でフォームを送信しないようにし、`close()` メソッドでダイアログを閉じ、"close" イベントを発生させる
    routeConfirmBtn.addEventListener("click", (e) => {
      let params = {};
      params.id = document.getElementById("route-hidden-id").value;
      params.routeLength = document.getElementById("route-length").value;

      setObjectparams(e, params, routes);
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

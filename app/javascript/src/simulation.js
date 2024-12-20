import * as d3 from "d3";
import { routes, operators, facilities } from "src/set_simulation_params";
// データの初期値をロード

export let link, node, simulation;
import { addFacility } from "src/set_simulation_params";
let facilityDialog, confirmBtn, routeDialog, routeConfirmBtn;
export async function drawLink(linksData, nodesData) {
  d3.select("#svg02").selectAll("line").remove();
  d3.select("#svg02").selectAll("circle").remove();

  link = d3
    .select("#svg02")
    .selectAll("line")
    .data(linksData)
    .enter()
    .append("line")
    .attr("stroke-width", 8)
    .attr("stroke", "black")
    .attr("id", function (d) {
      return d.id;
    });

  node = d3
    .select("#svg02")
    .selectAll("circle")
    .data(nodesData)
    .enter()
    .append("circle")
    .attr("r", function (d) {
      return d.r;
    })
    .attr("stroke", "black")
    .attr("fill", "LightSalmon")
    .attr("id", function (d) {
      return d.id;
    });

  const simurateSvg = document.getElementById("svg02");
  if (simurateSvg) {
    // シミュレーション描画
    simulation = d3
      .forceSimulation()
      .force("link", d3.forceLink().strength(0))
      .force("charge", d3.forceManyBody().strength(0))
      .force("x", null)
      .force("y", null);

    simulation.nodes(nodesData).on("tick", ticked);
    node
      .call(
        d3
          .drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended)
      )
      .on("click", nodeClicked);
    link.on("click", linkClicked);
    simulation
      .force("link")
      .links(linksData)
      .id(function (d) {
        return d.index;
      });
  }
}

export function changeInactiveObject() {
  d3.select("#svg02").selectAll("line").on("click", null);
  d3.select("#svg02").selectAll("circle").on("click", null);
}

export function changeActiveObject() {
  d3.select("#svg02").selectAll("line").on("click", linkClicked);
  d3.select("#svg02").selectAll("circle").on("click", nodeClicked);
}

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
  }

  d3.select("#svg02").selectAll("line").on("click", linkClicked);
  d3.select("#svg02").selectAll("circle").on("click", nodeClicked);
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

document.addEventListener("turbo:load", async () => {
  facilityDialog = document.getElementById("facilityDialog");
  confirmBtn = document.getElementById("confirmBtn");
  routeDialog = document.getElementById("route-dialog");
  routeConfirmBtn = document.getElementById("route-confirm-btn");
  if (confirmBtn) {
    // ［確認］ボタンが既定でフォームを送信しないようにし、`close()` メソッドでダイアログを閉じ、"close" イベントを発生させる
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

  if (routeConfirmBtn) {
    // ［確認］ボタンが既定でフォームを送信しないようにし、`close()` メソッドでダイアログを閉じ、"close" イベントを発生させる
    routeConfirmBtn.addEventListener("click", (e) => {
      let params = {};
      params.id = document.getElementById("route-hidden-id").value;
      params.routeLength = document.getElementById("route-length").value;

      setObjectparams(e, params, routes);
      let selectedRoute = routes.find((route) => route.id == params.id);
      let pairRoute = routes.find(
        (route) =>
          route.target == selectedRoute.source &&
          route.source == selectedRoute.target
      );
      params.id = pairRoute.id;
      setObjectparams(e, params, routes);
      routeDialog.close();
    });
  }
});

function nodeClicked() {
  let facilityForEdit = facilities.find((facility) => facility.id == this.id);
  setFacilityDataToModal(facilityForEdit);
  facilityDialog.showModal();
}

function linkClicked() {
  const canvasController = document.querySelector(
    "[data-controller='simulationmode']"
  ).controller;
  console.log(canvasController);

  let routeForEdit = routes.find((route) => route.id == this.id);
  console.log(routeForEdit);
  setRouteDataToModal(routeForEdit);
  routeDialog.showModal();
}

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

function dragstarted(event) {
  if (!event.active) simulation.alphaTarget(0.3).restart();
  event.subject.fx = event.subject.x;
  event.subject.fy = event.subject.y;
}

// Update the subject (dragged node) position during drag.
function dragged(event) {
  event.subject.fx = event.x;
  event.subject.fy = event.y;
}

function dragended(event) {
  if (!event.active) simulation.alphaTarget(0);
  event.subject.fx = null;
  event.subject.fy = null;
}

function ticked() {
  link
    .attr("x1", (d) => d.source.x)
    .attr("y1", (d) => d.source.y)
    .attr("x2", (d) => d.target.x)
    .attr("y2", (d) => d.target.y);

  node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
}

document.addEventListener("turbo:load", () => {
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
});

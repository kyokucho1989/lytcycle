import * as d3 from "d3";

// データの初期値をロード

let routes;
let operators;
let facilities;
let link, node;
const routesInitial = [
  { source: 0, target: 1, l: 20, id: "root10" },
  { source: 1, target: 2, l: 20, id: "root11" },
  { source: 2, target: 0, l: 20, id: "root12" },
  { source: 0, target: 2, l: 20, id: "re_root10" },
  { source: 1, target: 0, l: 20, id: "re_root11" },
  { source: 2, target: 1, l: 20, id: "re_root12" },
];
let operatorsInitial = [{ name: "Alice" }];
const facilitiesInitial = [
  {
    index: 0,
    x: 230,
    y: 310,
    r: 10,
    id: "n0",
    processingTime: 1,
    type: "start",
    name: "startPoint",
  },
  {
    index: 1,
    x: 330,
    y: 60,
    r: 15,
    id: "n1",
    processingTime: 15,
    type: "machine",
    name: "machine-no-1",
    isProcessing: false,
    hasMaterial: false,
    storageSize: 0,
    processingEndTime: 0,
  },
  {
    index: 2,
    x: 430,
    y: 310,
    r: 10,
    id: "n2",
    processingTime: 1,
    type: "goal",
    name: "goalPoint",
  },
];

let simulation;

export async function drawLink(linksData, nodesData) {
  console.log("draw link");
  d3.select("#svg02").selectAll("line").remove();
  d3.select("#svg02").selectAll("circle").remove();

  link = d3
    .select("#svg02")
    .selectAll("line")
    .data(linksData)
    .enter()
    .append("line")
    .attr("stroke-width", 1)
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
      .force("link", d3.forceLink().strength(0).iterations(1))
      .force("charge", d3.forceManyBody().strength(0))
      .force(
        "x",
        d3
          .forceX()
          .strength(0.01)
          .x(400 / 2)
      )
      .force(
        "y",
        d3
          .forceY()
          .strength(0.01)
          .y(100 / 2)
      );

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

    simulation
      .force("link")
      .links(linksData)
      .id(function (d) {
        return d.index;
      });
  }
}

let facilityDialog, confirmBtn;
document.addEventListener("turbo:load", async () => {
  facilityDialog = document.getElementById("facilityDialog");
  confirmBtn = document.getElementById("confirmBtn");

  // ［確認］ボタンが既定でフォームを送信しないようにし、`close()` メソッドでダイアログを閉じ、"close" イベントを発生させる
  confirmBtn.addEventListener("click", (event) => {
    event.preventDefault(); // この偽フォームを送信しない
    let id = document.getElementById("hidden-id");
    let name = document.getElementById("name");
    let processingTime = document.getElementById("processingTime");

    let selectedFacility = facilities.find(
      (facility) => facility.id == id.value
    );
    selectedFacility.name = name.value;
    selectedFacility.processingTime = processingTime.value;

    facilityDialog.close();
  });
});
function nodeClicked() {
  let facilityForEdit = facilities.find((facility) => facility.id == this.id);
  console.log(facilityForEdit);
  setFacilityDataToModal(facilityForEdit);
  facilityDialog.showModal();
}

function setFacilityDataToModal(facility) {
  let id = document.getElementById("hidden-id");
  let name = document.getElementById("name");
  let processingTime = document.getElementById("processingTime");

  id.value = facility.id;
  name.value = facility.name;
  processingTime.value = facility.processingTime;
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

document.addEventListener("turbo:load", async () => {
  let simulationParameters = document.getElementById("simulation-data");
  console.log("シミュレーション");
  if (simulationParameters) {
    let simulationId = simulationParameters.dataset.id;
    if (simulationId == "") {
      // 初期値設定
      routes = routesInitial;
      operators = operatorsInitial;
      facilities = facilitiesInitial;
      console.log("初期値設定終了");
    } else {
      try {
        const response = await fetch("edit.json");
        if (!response.ok) {
          throw new Error(`レスポンスステータス: ${response.status}`);
        }
        const json = await response.json();
        console.log(json);
        routes = JSON.parse(json.routes);
        facilities = JSON.parse(json.facilities);
        operators = JSON.parse(json.operators);

        // routesのsourceとtargetをインデックスに修正
        routes.forEach((route) => {
          if (typeof route.source === "object") {
            route.source = route.source.index;
          }
          if (typeof route.target === "object") {
            route.target = route.target.index;
          }
        });

        drawLink(routes, facilities);
        return json;
      } catch (error) {
        console.error(error.message);
      }

      console.log("ロード完了");
    }

    // シミュレーション画面の描画
  }

  // データ整形
});
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

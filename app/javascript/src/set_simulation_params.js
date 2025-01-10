// import * as d3 from "d3";
// import { routesInitial, operatorsInitial, simulation } from "./simulation.js";
export let routes, operators, facilities;
// export const parametersetEvent
import { drawLink } from "src/canvas";

const routesInitial = [
  { source: "start", target: 1, routeLength: 20, id: "root10" },
  { source: 1, target: "goal", routeLength: 20, id: "root1-1" },
  { source: "goal", target: "start", routeLength: 20, id: "root-10" },
];
const operatorsInitial = [{ name: "Alice" }];
const facilitiesInitial = [
  {
    x: 430,
    y: 310,
    r: 10,
    id: "goal",
    processingTime: 1,
    type: "goal",
    name: "goalPoint",
  },
  {
    x: 230,
    y: 310,
    r: 10,
    id: "start",
    processingTime: 1,
    type: "start",
    name: "startPoint",
  },
  {
    x: 330,
    y: 60,
    r: 15,
    id: 1,
    processingTime: 15,
    type: "machine",
    name: "machine-no-1",
    isProcessing: false,
    hasMaterial: false,
    storageSize: 0,
    processingEndTime: 0,
  },
];

export function addFacility([x, y]) {
  let lastIdObject = facilities.find((el) => el.lastId);
  let lastId;
  if (lastIdObject === undefined) {
    lastId = facilities.length;
    facilities.unshift({ lastId: lastId });
  } else {
    lastId = lastIdObject.lastId;
  }

  lastId = lastId + 1;
  facilities[0] = { lastId: lastId };
  let facility = {
    index: lastId,
    x: x,
    y: y,
    r: 15,
    id: `n${lastId}`,
    processingTime: 15,
    type: "machine",
    name: `machine-no-${lastId}`,
    isProcessing: false,
    hasMaterial: false,
    storageSize: 0,
    processingEndTime: 0,
  };

  facilities.push(facility);
  drawLink(routes, facilities);
}

document.addEventListener("turbo:load", async () => {
  let simulationParameters = document.getElementById("simulation-data");
  if (simulationParameters) {
    let simulationId = simulationParameters.dataset.id;
    if (simulationId == "") {
      // 初期値設定
      routes = routesInitial;
      operators = operatorsInitial;
      facilities = facilitiesInitial;
      console.log("初期値設定終了");
      drawLink(routes, facilities);
    } else {
      try {
        const response = await fetch("edit.json");
        if (!response.ok) {
          throw new Error(`レスポンスステータス: ${response.status}`);
        }
        const json = await response.json();
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

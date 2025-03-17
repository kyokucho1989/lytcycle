export let routes, operators, facilities;
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

export function deleteRoute() {
  let selectedRoute = routes.find((route) => route.id == this.id);
  if (selectedRoute.source.id == "goal" && selectedRoute.target.id == "start") {
    alert("スタートとゴールの間のルートは削除できません。");
  } else {
    if (window.confirm("削除しますか？")) {
      routes = routes.filter((route) => route.id != selectedRoute.id);
      drawLink(routes, facilities);
    }
  }
}

export function deleteFacility() {
  let selectedFacility = facilities.find((facility) => facility.id == this.id);
  let unConnectedRoutes = routes.filter(
    (route) =>
      route.target.id != selectedFacility.id &&
      route.source.id != selectedFacility.id
  );

  let unConnectedRoutesIds = unConnectedRoutes.map((route) => route.id);

  if (window.confirm("削除しますか？")) {
    facilities = facilities.filter(
      (facility) => facility.id != selectedFacility.id
    );
    routes = routes.filter((route) => unConnectedRoutesIds.includes(route.id));
    drawLink(routes, facilities);
  }
}

export function addRoute() {
  // let selectedFacility = facilities.find((facility) => facility.id == this.id);
  if (this.hasAttribute("selected")) {
    this.removeAttribute("selected");
  } else {
    this.setAttribute("selected", "");
  }
  let selectedNodes = document.querySelectorAll("circle[selected]");
  if (selectedNodes.length == 2) {
    let targetId = this.id;
    let source = [...selectedNodes].find((element) => element.id != targetId);
    let sourceId = source.id;
    console.log("2つ以上のnodeあり");
    let targetNode = facilities.find((element) => element.id == targetId);
    let sourceNode = facilities.find((element) => element.id == sourceId);
    let idName = `root${sourceId}${targetId}`;
    let route = {
      source: sourceNode,
      target: targetNode,
      routeLength: 20,
      id: idName,
      index: routes.length,
    };

    let dupicatedLogic = (route) =>
      (route.target.id == targetId && route.source.id == sourceId) ||
      (route.target.id == sourceId && route.source.id == targetId);

    if (routes.some(dupicatedLogic)) {
      console.log("重複");
    } else {
      routes = routes.concat(route);
      drawLink(routes, facilities);
    }

    [...selectedNodes].forEach((element) => {
      element.removeAttribute("selected");
    });
  }
  console.log(selectedNodes);
}

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
            route.source = route.source.id;
          }
          if (typeof route.target === "object") {
            route.target = route.target.id;
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

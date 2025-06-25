import { drawLink } from "../render";

export let routes, operators, facilities;

const routesInitial = [
  { source: "start", target: "n1", routeLength: 20, id: "root10" },
  { source: "n1", target: "goal", routeLength: 20, id: "root1-1" },
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
    name: "goal",
  },
  {
    x: 230,
    y: 310,
    r: 10,
    id: "start",
    processingTime: 1,
    type: "start",
    name: "start",
  },
  {
    x: 330,
    y: 60,
    r: 15,
    id: "n1",
    processingTime: 15,
    type: "machine",
    name: "machine-1",
    isProcessing: false,
    hasMaterial: false,
    storageSize: 0,
    processingEndTime: 0,
  },
];

export function deleteRoute() {
  const selectedRoute = routes.find((route) => route.id === this.id);
  if (
    selectedRoute.source.id === "goal" &&
    selectedRoute.target.id === "start"
  ) {
    alert("スタートとゴールの間のルートは削除できません。");
  } else {
    if (window.confirm("削除しますか？")) {
      routes = routes.filter((route) => route.id !== selectedRoute.id);
      drawLink(routes, facilities);
    }
  }
}

export function deleteFacility() {
  const selectedFacility = facilities.find(
    (facility) => facility.id === this.id
  );
  if (selectedFacility.id === "goal" || selectedFacility.id === "start") {
    alert("スタートとゴールは削除できません。");
    return;
  }
  const unConnectedRoutes = routes.filter(
    (route) =>
      route.target.id !== selectedFacility.id &&
      route.source.id !== selectedFacility.id
  );

  const unConnectedRoutesIds = unConnectedRoutes.map((route) => route.id);

  if (window.confirm("削除しますか？")) {
    facilities = facilities.filter(
      (facility) => facility.id !== selectedFacility.id
    );
    routes = routes.filter((route) => unConnectedRoutesIds.includes(route.id));
    drawLink(routes, facilities);
  }
}

export function addRoute(targetId, sourceId) {
  const targetNode = facilities.find((element) => element.id === targetId);
  const sourceNode = facilities.find((element) => element.id === sourceId);
  const idName = `root${sourceId}${targetId}`;
  const route = {
    source: sourceNode,
    target: targetNode,
    routeLength: 20,
    id: idName,
    index: routes.length,
  };

  const duplicatedLogic = (route) =>
    (route.target.id === targetId && route.source.id === sourceId) ||
    (route.target.id === sourceId && route.source.id === targetId);

  if (routes.some(duplicatedLogic)) {
    alert("すでにリンクが作成されています");
  } else {
    routes = routes.concat(route);
    drawLink(routes, facilities);
  }
  const selectedNodes = document.querySelectorAll("circle[selected]");

  [...selectedNodes].forEach((element) => {
    element.removeAttribute("selected");
  });
}

export function addFacility([x, y]) {
  const lastIdObject = facilities.find((el) => el.lastId);
  let lastId;
  if (lastIdObject === undefined) {
    lastId = facilities.length;
    facilities.unshift({ lastId: lastId });
  } else {
    lastId = lastIdObject.lastId;
  }

  lastId = lastId + 1;
  facilities[0] = { lastId: lastId, x: 0, y: 0 };
  const facility = {
    index: lastId,
    x: x,
    y: y,
    r: 15,
    id: `n${lastId}`,
    processingTime: 15,
    type: "machine",
    name: `machine-${lastId}`,
    isProcessing: false,
    hasMaterial: false,
    storageSize: 0,
    processingEndTime: 0,
  };

  facilities.push(facility);
  drawLink(routes, facilities);
}

document.addEventListener("turbo:load", async () => {
  const simulationParameters = document.getElementById("simulation-data");
  if (simulationParameters) {
    const simulationId = simulationParameters.dataset.id;

    if (simulationId === "") {
      routes = routesInitial;
      operators = operatorsInitial;
      facilities = facilitiesInitial;
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
    }
  }
});

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

export function deleteRoute(element) {
  const selectedRoute = routes.find((route) => route.id === element.id);
  if (
    selectedRoute.source.id === "goal" &&
    selectedRoute.target.id === "start"
  ) {
    alert("スタートとゴールの間のルートは削除できません。");
  } else {
    if (window.confirm("削除しますか？")) {
      routes = routes.filter((route) => route.id !== selectedRoute.id);
    }
  }
  return { routes, facilities };
}

export function deleteFacility(element) {
  const selectedFacility = facilities.find(
    (facility) => facility.id === element.id
  );
  if (selectedFacility.id === "goal" || selectedFacility.id === "start") {
    alert("スタートとゴールは削除できません。");
    return;
  }
  const unconnectedRoutes = routes.filter(
    (route) =>
      route.target.id !== selectedFacility.id &&
      route.source.id !== selectedFacility.id
  );

  const unconnectedRoutesIds = unconnectedRoutes.map((route) => route.id);

  if (window.confirm("削除しますか？")) {
    facilities = facilities.filter(
      (facility) => facility.id !== selectedFacility.id
    );
    routes = routes.filter((route) => unconnectedRoutesIds.includes(route.id));
  }
  return { routes, facilities };
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

  const duplicatedLinks = (route) =>
    (route.target.id === targetId && route.source.id === sourceId) ||
    (route.target.id === sourceId && route.source.id === targetId);

  if (routes.some(duplicatedLinks)) {
    alert("すでにリンクが作成されています");
  } else {
    routes = routes.concat(route);
  }
  const selectedNodes = document.querySelectorAll("circle[selected]");

  selectedNodes.forEach((element) => {
    element.removeAttribute("selected");
  });
  return { routes, facilities };
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
  return { routes, facilities };
}

export function setInitialParams() {
  routes = routesInitial;
  operators = operatorsInitial;
  facilities = facilitiesInitial;
  return { routes, operators, facilities };
}

export function setParams(params) {
  ({ routes, operators, facilities } = params);
}

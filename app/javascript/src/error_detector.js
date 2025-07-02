export let invalidRoutesIds = { ids: [] };

export function findInvalidRouteIds(routes) {
  const copiedRoutes = JSON.parse(JSON.stringify(routes)); // routesをディープコピーする
  const filteredRoutes = copiedRoutes.filter((el) => !el["lastId"]);
  filteredRoutes.forEach((route) => {
    if (typeof route.source === "object") {
      route.source = route.source.id;
    }
    if (typeof route.target === "object") {
      route.target = route.target.id;
    }
  });
  const groupedRoutes = formatBySource(filteredRoutes);
  const startNode = "start";
  const goalNode = "goal";
  const invalidRoutesSet = findInvalidRoutesSetByDFS(
    groupedRoutes,
    startNode,
    goalNode
  );
  const invalidRoutes = filteredRoutes.filter((route) =>
    invalidRoutesSet.has(`${route.source}->${route.target}`)
  );
  invalidRoutesIds.ids = invalidRoutes.map((route) => route["id"]);
  return invalidRoutesIds;
}

export function findInvalidRoutesSetByDFS(groupedRoutes, startNode, goalNode) {
  const visitedRoutes = [];
  const validRoutes = new Set();

  const keys = Object.keys(groupedRoutes);
  const allRoutes = [];
  keys.forEach((key) => {
    groupedRoutes[key].forEach((el) => {
      allRoutes.push(`${key}->${el}`);
    });
  });
  function depthFirstSearch(node, startNode, path) {
    if (path.includes(startNode) && node === startNode) {
      return;
    } else {
      path.push(node);
    }
    const neighbors = groupedRoutes[node] || [];
    for (const neighbor of neighbors) {
      const routeKey = `${node}->${neighbor}`;
      if (!visitedRoutes.includes(routeKey)) {
        visitedRoutes.push(routeKey);
        depthFirstSearch(neighbor, startNode, path);
      }
      const routesConvertFromPath = [];
      path.slice(1).forEach((el, i) => {
        routesConvertFromPath.push(`${path[i]}->${el}`);
      });
      if (neighbor === startNode && node === goalNode) {
        routesConvertFromPath.push(`${path.at(-1)}->${startNode}`);
        routesConvertFromPath.forEach((el) => {
          validRoutes.add(el);
        });
      }
    }
    path.pop();
  }

  depthFirstSearch(startNode, startNode, []);

  const allRoutesSet = new Set(allRoutes);
  return allRoutesSet.difference(validRoutes);
}

// formatBySource(routes)
// routesをsourceごとにtargetをまとめた形式に変換
// 例：
// routes = [
//   { source: "start", target: 1 },
//   { source: "start", target: 2 },
//   { source: "start", target: 3 }]
// formatBySource(routes) => { start: [1, 2, 3]}

export function formatBySource(routes) {
  return routes.reduce((routesBySource, route) => {
    if (!routesBySource[route["source"]]) {
      routesBySource[route["source"]] = [];
    }
    routesBySource[route["source"]].push(route["target"]);
    return routesBySource;
  }, {});
}

export default invalidRoutesIds;

export let invalidRoutesIds = { ids: [] };

export function findInvalidRouteIds(routes) {
  const copiedRoutes = JSON.parse(JSON.stringify(routes));
  const filteredRoute = copiedRoutes.filter((el) => !el["lastId"]);
  filteredRoute.forEach((route) => {
    if (typeof route.source === "object") {
      route.source = route.source.id;
    }
    if (typeof route.target === "object") {
      route.target = route.target.id;
    }
  });
  const groupedRoutes = formatBySource(filteredRoute);
  const startNode = "start";
  const goalNode = "goal";
  const invalidRoutesSet = findInvalidRoutesSetByDFS(
    groupedRoutes,
    startNode,
    goalNode
  );
  const invalidRoutes = filteredRoute.filter((route) =>
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

export function formatBySource(routes) {
  return routes.reduce((a, x) => {
    if (!a[x["source"]]) {
      a[x["source"]] = [];
    }
    a[x["source"]].push(x["target"]);
    return a;
  }, {});
}

export default invalidRoutesIds;

export let invalidRoutesIds = { ids: [] };
export function findInvalidRouteIds(routes) {
  const copiedRoutes = JSON.parse(JSON.stringify(routes));
  let filterdRoute = copiedRoutes.filter((el) => !el["lastId"]);

  filterdRoute.forEach((route) => {
    if (typeof route.source === "object") {
      route.source = route.source.id;
    }
    if (typeof route.target === "object") {
      route.target = route.target.id;
    }
  });
  let groupedRoutes = formatBySource(filterdRoute);
  let startNode = "start";
  let goalNode = "goal";
  let invalidRoutesSet = findInvalidRoutesSetByDFS(
    groupedRoutes,
    startNode,
    goalNode
  );
  const invalidRoutes = filterdRoute.filter((route) =>
    invalidRoutesSet.has(`${route.source}->${route.target}`)
  );
  invalidRoutesIds.ids = invalidRoutes.map((route) => route["id"]);
  return invalidRoutesIds;
}

export function findInvalidRoutesSetByDFS(groupedRoutes, startNode, goalNode) {
  const visitedRoutes = [];
  let invalidRoutes = new Set();
  let validRoutes = new Set();

  // すべてのルートを配列として保管
  let keys = Object.keys(groupedRoutes);
  let allRoutes = [];
  keys.forEach((key) => {
    groupedRoutes[key].forEach((el) => {
      allRoutes.push(`${key}->${el}`);
    });
  });
  function dfs(node, startNode, path) {
    if (path.includes(startNode) && node == startNode) {
      path.length == 0;
      return;
    } else {
      path.push(node);
    }

    const neighbors = groupedRoutes[node] || [];
    let routeKey;
    let routesConvertFromPath = [];
    for (const neighbor of neighbors) {
      routeKey = `${node}->${neighbor}`;
      if (!visitedRoutes.includes(routeKey)) {
        visitedRoutes.push(routeKey);
        dfs(neighbor, startNode, path);
      }
      // path -> routeに変換
      routesConvertFromPath = [];
      path.slice(1).forEach((el, i) => {
        routesConvertFromPath.push(`${path[i]}->${el}`);
      });

      if (neighbor == startNode && node == goalNode) {
        routesConvertFromPath.push(`${path.at(-1)}->${startNode}`);
        routesConvertFromPath.forEach((el) => {
          validRoutes.add(el);
        });
      }
    }

    path.pop();
  }

  dfs(startNode, startNode, []);

  const allRoutesSet = new Set(allRoutes);
  invalidRoutes = allRoutesSet.difference(validRoutes);
  return invalidRoutes;
}

export function formatBySource(routes) {
  let groupedRoutes = routes.reduce((a, x) => {
    if (!a[x["source"]]) {
      a[x["source"]] = [];
    }
    a[x["source"]].push(x["target"]);
    return a;
  }, {});
  return groupedRoutes;
}

export default invalidRoutesIds;

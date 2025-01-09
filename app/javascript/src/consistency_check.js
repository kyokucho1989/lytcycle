// import { routes } from "src/set_simulation_params";

export function detectGraphIssue(routes) {
  let filterdRoute = routes.filter((el) => !el["lastId"]);
  let groupedRoutes = formatBySource(filterdRoute);
  let startNode = 0;
  let InvalidRoutes = findInvalidRoutesSetByDFS(groupedRoutes, startNode);
  return InvalidRoutes;
}

export function findInvalidRoutesSetByDFS(groupedRoutes, startNode) {
  const visitedRoutes = [];
  let InvalidRoutes = new Set();
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
    path.push(node);

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
      if (neighbor != startNode) {
        routesConvertFromPath.forEach((el) => {
          InvalidRoutes.add(el);
        });
      } else {
        routesConvertFromPath.forEach((el) => {
          validRoutes.add(el);
        });
      }
    }

    if (neighbors.length == 0) {
      routesConvertFromPath = [];
      path.slice(1).forEach((el, i) => {
        routesConvertFromPath.push(`${path[i]}->${el}`);
      });
      // console.log(`孤立したルートが存在します/path:${path}`);

      routesConvertFromPath.forEach((el) => {
        InvalidRoutes.add(el);
      });
    }
    path.pop();
  }

  dfs(startNode, startNode, []);

  const visitedRoutesSet = new Set(visitedRoutes);
  const allRoutesSet = new Set(allRoutes);

  const notVisitedRoutesSet = allRoutesSet.difference(visitedRoutesSet);
  if (notVisitedRoutesSet.size == 0) {
    // console.log("すべてのルートを訪れています。");
  } else {
    notVisitedRoutesSet.forEach((el) => {
      InvalidRoutes.add(el);
    });
  }
  InvalidRoutes = InvalidRoutes.difference(validRoutes);
  return InvalidRoutes;
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

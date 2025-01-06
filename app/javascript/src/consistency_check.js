// import { routes } from "src/set_simulation_params";

export function findNgRoutesIds(routes, startNode) {
  let filterdRoute = routes.filter((el) => !el["lastId"]);
  let groupRoutes = groupBySource(filterdRoute);
  const visitedRoutes = new Set();
  const allRoutes = filterdRoute.map(
    (route) => `${route.source}->${route.target}`
  );
  let closedLoopDetected = false;

  function dfs(node, startNode, path) {
    if (path.has(node)) {
      if (node === startNode) {
        closedLoopDetected = true;
        return;
      }
      throw new Error(`ループ検出: ${node}に戻る不正な閉ループがあります`);
    }

    path.add(node);

    const neighbors = groupRoutes[node] || [];
    for (const neighbor of neighbors) {
      const routeKey = `${node}->${neighbor}`;
      if (!visitedRoutes.has(routeKey)) {
        visitedRoutes.add(routeKey);
        dfs(neighbor, startNode, new Set(path));
      }
    }
    console.log(visitedRoutes);
  }

  dfs(startNode, startNode, new Set());

  if (visitedRoutes.size !== allRoutes.length) {
    throw new Error("孤立したルートが存在します");
  }

  if (!closedLoopDetected) {
    throw new Error("スタート地点に戻る閉ループが存在しません");
  }

  console.log("すべてのルートが整合しています");
  return [];
}

export function groupBySource(routes) {
  let groupedRoutes = routes.reduce((a, x) => {
    if (!a[x["source"]]) {
      a[x["source"]] = [];
    }
    a[x["source"]].push(x["target"]);
    return a;
  }, {});
  return groupedRoutes;
}

/*

const routesInitial = [
  { source: 0, target: 1, routeLength: 20, id: "root10" },
  { source: 1, target: 2, routeLength: 20, id: "root11" },
  { source: 2, target: 0, routeLength: 20, id: "root12" },
];

const groupBySource = [
0: [{ source: 0, target: 1, routeLength: 20, id: "root10" }],
1: [{ source: 1, target: 2, routeLength: 20, id: "root11" }],
2: [{ source: 2, target: 0, routeLength: 20, id: "root12" }],
];

const routesInitial = [
  { source: 0, target: 1, id: "root10" },
  { source: 1, target: 2, routeLength: 20, id: "root11" },
  { source: 2, target: 0, routeLength: 20, id: "root12" },
];



// グラフ構造を表す
const graph = {
  start: ["A", "B"],
  A: ["C"],
  B: ["C"],
  C: ["goal"],
  goal: []
};

// 深さ優先探索を使って整合性を確認する関数
function validateNetwork(graph, startNode, goalNode) {
  // 訪問済みノードを記録
  const visited = new Set();
  let allNodes = new Set(Object.keys(graph)); // 全ノード

  // スタートからゴールまでの経路が存在するか確認
  function dfs(node, path) {
    if (path.has(node)) {
      throw new Error(`ループ検出: ${node}を複数回訪問しています`);
    }

    path.add(node);
    visited.add(node);

    // ゴールに到達したらtrue
    if (node === goalNode) {
      return true;
    }

    for (const neighbor of graph[node] || []) {
      if (dfs(neighbor, new Set(path))) {
        return true;
      }
    }

    return false;
  }

  // スタートからゴールまでの経路が正しいかチェック
  if (!dfs(startNode, new Set())) {
    throw new Error("スタートからゴールまでの有効な経路がありません");
  }

  // 孤立ノードがないか確認
  const connectedNodes = visited;
  if (allNodes.size !== connectedNodes.size) {
    throw new Error("孤立したノードが存在します");
  }

  console.log("ネットワークの整合性が確認されました");
  return true;
}

// 実行例
try {
  validateNetwork(graph, "start", "goal");
} catch (error) {
  console.error(error.message);
}

*/

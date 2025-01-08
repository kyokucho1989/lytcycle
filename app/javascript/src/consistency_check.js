// import { routes } from "src/set_simulation_params";

export function detectGraphIssue(routes) {
  let filterdRoute = routes.filter((el) => !el["lastId"]);
  let groupedRoutes = formatBySource(filterdRoute);
  let startNode = 0;
  let InvalidRoutes = findInvalidRoutesIdsByDFS(groupedRoutes, startNode);
}

export function findInvalidRoutesIdsByDFS(groupedRoutes, startNode) {
  const visitedRoutes = [];
  let InvalidPath = [];

  let closedLoopDetected = false;

  function dfs(node, startNode, path) {
    // let currentNode;
    if (path.includes(node)) {
      if (node === startNode) {
        closedLoopDetected = true;
        path.length = 0;
        return;
      }
    }
    if (path.length == 0 && node != startNode) {
      path.push(startNode);
    }
    path.push(node);

    // currentNode = node;
    const neighbors = groupedRoutes[node] || [];
    let routeKey;
    for (const neighbor of neighbors) {
      routeKey = `${node}->${neighbor}`;
      if (path.includes(neighbor)) {
        console.log(`閉ループ検出 ${neighbor}:${node}`);
      }
      if (!visitedRoutes.includes(routeKey)) {
        visitedRoutes.push(routeKey);
        dfs(neighbor, startNode, path);
      } else if (neighbor != startNode && !InvalidPath.includes(path)) {
        console.log(
          `不適切な閉ループ:neighbor ${neighbor}/node:${node}/path:${path}/visitedRoute: ${visitedRoutes}`
        );
        InvalidPath.push([...path]);
      }
    }
    if (neighbors.length == 0) {
      console.log(`孤立したルートが存在します/path:${path}`);
      InvalidPath.push([...path]);
    }
    path.pop();
  }

  dfs(startNode, startNode, []);

  if (!closedLoopDetected) {
    throw new Error("スタート地点に戻る閉ループが存在しません");
  }

  // console.log("すべてのルートが整合しています");
  return InvalidPath;
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

/*

const routesInitial = [
  { source: 0, target: 1, routeLength: 20, id: "root10" },
  { source: 1, target: 2, routeLength: 20, id: "root11" },
  { source: 2, target: 0, routeLength: 20, id: "root12" },
];

const formatBySource = [
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

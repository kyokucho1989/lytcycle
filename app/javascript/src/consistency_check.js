// import { routes } from "src/set_simulation_params";

export function findNgRoutesIds(routes) {
  console.log(routes);
  // const groupBySource = Object.groupBy(routes, ({ source }) => source);
  // console.log(groupBySource);
  // { odd: [1, 3, 5], even: [2, 4] }
  // routes を深さ優先探索を行いやすいように整形
  // 整形したroutesを引数にして探索
  // かならずスタートとゴールまでつながっていること
}

export function groupBySource(routes) {
  let groupedRoutes = routes.reduce((a, x) => {
    console.log(a);
    console.log(x);
    if (!a[x["source"]]) {
      a[x["source"]] = [];
    }
    a[x["source"]].push(x);
    // console.log(a[x["source"]]);
    return a;
  }, []);
  // console.log(groupedRoutes);
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

// query utilities:
// import {
//   // Tip: all queries are also exposed on an object
//   // called "queries" which you could import here as well
//   waitFor,
// } from "@testing-library/dom";
// adds special assertions like toHaveTextContent
import "@testing-library/jest-dom";

import {
  formatBySource,
  findInvalidRoutesSetByDFS,
  findInvalidRouteIds,
} from "../src/consistency_check";

let routesInitial;
beforeEach(() => {
  routesInitial = [
    { source: 0, target: 1, l: 20, id: "root10" },
    { source: 1, target: 2, l: 20, id: "root11" },
    { source: 2, target: 0, l: 20, id: "root12" },
  ];
});

test("group correct route", async () => {
  routesInitial = [
    { source: "start", target: 1, l: 20, id: "root-s1" },
    { source: "start", target: 2, l: 20, id: "root-s2" },
    { source: "start", target: 3, l: 20, id: "root-s3" },
    { source: 1, target: 4, l: 20, id: "root-14" },
    { source: 2, target: 4, l: 20, id: "root-24" },
    { source: 3, target: 5, l: 20, id: "root-35" },
    { source: 4, target: "goal", l: 20, id: "root-4g" },
    { source: 5, target: "goal", l: 20, id: "root-5g" },
    { source: "goal", target: "start", l: 20, id: "root-gs" },
  ];

  let groupedRoute1 = {
    start: [1, 2, 3],
    1: [4],
    2: [4],
    3: [5],
    4: ["goal"],
    5: ["goal"],
    goal: ["start"],
  };

  let result = formatBySource(routesInitial);
  expect(result).toStrictEqual(groupedRoute1);
});

test("findInvalidRoutesSetByDFS", async () => {
  // 正常
  let groupedRoute1 = {
    start: [1, 2, 3],
    1: [4],
    2: [4],
    3: [5],
    4: ["goal"],
    5: ["goal"],
    goal: ["start"],
  };
  // ゴールにたどりつけないルートあり
  let groupedRoute2 = {
    start: [1, 2, 3],
    1: [4],
    2: [7],
    3: [5],
    4: ["goal"],
    5: ["goal"],
    goal: ["start"],
    7: [],
  };

  // ゴール以外で閉ループ
  let groupedRoute3 = {
    start: [1, 3],
    1: [2, 4],
    2: [7],
    3: [5],
    4: ["goal"],
    5: ["goal", 1, "start"],
    goal: ["start"],
    7: [],
  };

  // スタートからたどれないルート
  let groupedRoute4 = {
    start: [1, 3],
    1: [2, 4],
    2: [7],
    3: [5],
    4: ["goal"],
    5: ["goal", 1],
    goal: ["start"],
    7: [],
    8: ["goal"],
  };

  // スタート地点に戻れない
  let groupedRoute5 = {
    start: [1],
    1: [2],
    2: [3],
    3: [],
  };

  let result1 = findInvalidRoutesSetByDFS(groupedRoute1, "start", "goal");
  let result2 = findInvalidRoutesSetByDFS(groupedRoute2, "start", "goal");
  let result3 = findInvalidRoutesSetByDFS(groupedRoute3, "start", "goal");
  let result4 = findInvalidRoutesSetByDFS(groupedRoute4, "start", "goal");
  let result5 = findInvalidRoutesSetByDFS(groupedRoute5, "start", "goal");

  expect(result1).toMatchObject({});
  expect(result2).toMatchObject(new Set(["start->2", "2->7"]));
  expect(result3).toMatchObject(new Set(["1->2", "2->7", "5->1", "5->start"]));
  expect(result4).toMatchObject(new Set(["1->2", "2->7", "5->1", "8->goal"]));
  expect(result5).toMatchObject(new Set(["start->1", "1->2", "2->3"]));
});

test("findInvalidRouteIds", async () => {
  routesInitial = [
    { lastId: 10 },
    { source: "start", target: 1, l: 20, id: "root-s1" },
    { source: "start", target: 2, l: 20, id: "root-s2" },
    { source: "start", target: 3, l: 20, id: "root-s3" },
    { source: 1, target: 4, l: 20, id: "root-14" },
    { source: 2, target: 4, l: 20, id: "root-24" },
    { source: 3, target: 5, l: 20, id: "root-35" },
    { source: 4, target: 1, l: 20, id: "root-41" },
    { source: 5, target: "goal", l: 20, id: "root-5g" },
    { source: "goal", target: "start", l: 20, id: "root-gs" },
  ];

  let Ids = ["root-s1", "root-s2", "root-14", "root-24", "root-41"];

  let result = findInvalidRouteIds(routesInitial);
  expect(result).toStrictEqual(Ids);
});

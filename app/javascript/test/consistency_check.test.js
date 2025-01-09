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
    { source: 0, target: 1, l: 20, id: "root10" },
    { source: 0, target: 2, l: 20, id: "root11" },
    { source: 0, target: 3, l: 20, id: "root12" },
    { source: 1, target: 4, l: 20, id: "root11" },
    { source: 2, target: 4, l: 20, id: "root12" },
    { source: 3, target: 5, l: 20, id: "root11" },
    { source: 4, target: 6, l: 20, id: "root12" },
    { source: 5, target: 6, l: 20, id: "root11" },
    { source: 6, target: 0, l: 20, id: "root12" },
  ];

  let groupedRoute1 = {
    0: [1, 2, 3],
    1: [4],
    2: [4],
    3: [5],
    4: [6],
    5: [6],
    6: [0],
  };

  let result = formatBySource(routesInitial);
  expect(result).toStrictEqual(groupedRoute1);
});

test("findInvalidRoutesSetByDFS", async () => {
  // 正常
  let groupedRoute1 = {
    0: [1, 2, 3],
    1: [4],
    2: [4],
    3: [5],
    4: [6],
    5: [6],
    6: [0],
  };
  // ゴールにたどりつけないルートあり
  let groupedRoute2 = {
    0: [1, 2, 3],
    1: [4],
    2: [7],
    3: [5],
    4: [6],
    5: [6],
    6: [0],
    7: [],
  };

  // ゴール以外で閉ループ
  let groupedRoute3 = {
    0: [1, 3],
    1: [2, 4],
    2: [7],
    3: [5],
    4: [6],
    5: [6, 1, 0],
    6: [0],
    7: [],
  };

  // スタートからたどれないルート
  let groupedRoute4 = {
    0: [1, 3],
    1: [2, 4],
    2: [7],
    3: [5],
    4: [6],
    5: [6, 1],
    6: [0],
    7: [],
    8: [6],
  };

  // スタート地点に戻れない
  let groupedRoute5 = {
    0: [1],
    1: [2],
    2: [3],
    3: [],
  };

  let result1 = findInvalidRoutesSetByDFS(groupedRoute1, 0);
  let result2 = findInvalidRoutesSetByDFS(groupedRoute2, 0);
  let result3 = findInvalidRoutesSetByDFS(groupedRoute3, 0);
  let result4 = findInvalidRoutesSetByDFS(groupedRoute4, 0);
  let result5 = findInvalidRoutesSetByDFS(groupedRoute5, 0);

  expect(result1).toMatchObject({});
  expect(result2).toMatchObject(new Set(["0->2", "2->7"]));
  expect(result3).toMatchObject(new Set(["1->2", "2->7", "5->1", "5->0"]));
  expect(result4).toMatchObject(new Set(["1->2", "2->7", "5->1", "8->6"]));
  expect(result5).toMatchObject(new Set(["0->1", "1->2", "2->3"]));
});

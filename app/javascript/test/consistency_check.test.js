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
  findInvalidRoutesIdsByDFS,
} from "../src/consistency_check";
// import { group } from "d3";
let routesInitial, routesInitial2, routesInitialIncludeLastID;
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

test("findInvalidRoutesIdsByDFS", async () => {
  let groupedRoute1 = {
    0: [1, 2, 3],
    1: [4],
    2: [4],
    3: [5],
    4: [6],
    5: [6],
    6: [0],
  };

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

  // let result1 = findInvalidRoutesIdsByDFS(groupedRoute1, 0);
  // let result2 = findInvalidRoutesIdsByDFS(groupedRoute2, 0);
  let result3 = findInvalidRoutesIdsByDFS(groupedRoute3, 0);
  // expect(result1).toMatchObject({});
  // expect(result2).toMatchObject(new Set([new Set([0, 2, 7])]));
  expect(result3).toMatchObject([
    [2, 7],
    [3, 5],
  ]);

  // let result2 = findInvalidRoutesIdsByDFS(routesInitial2, 0);
  // expect(result2).toStrictEqual([]);
});

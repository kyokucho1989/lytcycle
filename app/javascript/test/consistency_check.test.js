// query utilities:
// import {
//   // Tip: all queries are also exposed on an object
//   // called "queries" which you could import here as well
//   waitFor,
// } from "@testing-library/dom";
// adds special assertions like toHaveTextContent
import "@testing-library/jest-dom";

import { groupBySource, findNgRoutesIds } from "../src/consistency_check";
// import { group } from "d3";
let routesInitial, routesInitial2, routesInitialIncludeLastID;
beforeEach(() => {
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

  // routesInitial = [
  //   { source: 0, target: 1, l: 20, id: "root10" },
  //   { source: 1, target: 2, l: 20, id: "root11" },
  //   { source: 2, target: 0, l: 20, id: "root12" },
  // ];
});

test("group correct route", async () => {
  let groupedRoute = {
    0: [1, 2, 3],
    1: [4],
    2: [4],
    3: [5],
    4: [6],
    5: [6],
    6: [0],
  };

  let result = groupBySource(routesInitial);
  expect(result).toStrictEqual(groupedRoute);
});

test("find NG route Ids", async () => {
  routesInitialIncludeLastID = [
    { lastId: 6 },
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

  routesInitial2 = [
    { lastId: 6 },
    { source: 0, target: 1, l: 20, id: "root10" },
    { source: 0, target: 2, l: 20, id: "root11" },
    { source: 0, target: 3, l: 20, id: "root12" },
    { source: 1, target: 4, l: 20, id: "root11" },
    { source: 2, target: 4, l: 20, id: "root12" },
    { source: 3, target: 5, l: 20, id: "root11" },
    { source: 4, target: 6, l: 20, id: "root12" },
    { source: 4, target: 7, l: 20, id: "root12" },
    { source: 5, target: 6, l: 20, id: "root11" },
    { source: 6, target: 0, l: 20, id: "root12" },
  ];
  // let fileterdRoute = [
  //   { source: 0, target: 1, l: 20, id: "root10" },
  //   { source: 1, target: 2, l: 20, id: "root11" },
  //   { source: 2, target: 0, l: 20, id: "root12" },
  // ];

  let result = findNgRoutesIds(routesInitialIncludeLastID, 0);
  expect(result).toStrictEqual([]);

  let result2 = findNgRoutesIds(routesInitial2, 0);
  expect(result2).toStrictEqual([]);
});

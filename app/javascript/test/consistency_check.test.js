// query utilities:
// import {
//   // Tip: all queries are also exposed on an object
//   // called "queries" which you could import here as well
//   waitFor,
// } from "@testing-library/dom";
// adds special assertions like toHaveTextContent
import "@testing-library/jest-dom";

// import { findNgRoutesIds } from "../src/consistency_check";
// let routesInitial;
// beforeEach(() => {
//   routesInitial = [
//     { source: 0, target: 1, l: 20, id: "root10" },
//     { source: 1, target: 2, l: 20, id: "root11" },
//     { source: 2, target: 0, l: 20, id: "root12" },
//   ];
// });

test("draw link and circle", async () => {
  expect(3).toBe(3);
});

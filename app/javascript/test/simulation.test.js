// query utilities:
import {
  getByLabelText,
  getByText,
  getByTestId,
  queryByTestId,
  // Tip: all queries are also exposed on an object
  // called "queries" which you could import here as well
  waitFor,
} from "@testing-library/dom";
// adds special assertions like toHaveTextContent
import "@testing-library/jest-dom";

import * as d3 from "d3";
import { drawLink } from "../simulation.js";

test("SVG Snapshot Test", () => {
  document.body.innerHTML = '<div id="chart"></div>';

  const svg = d3
    .select("#chart")
    .append("svg")
    .attr("width", 100)
    .attr("height", 100);

  svg
    .append("circle")
    .attr("cx", 50)
    .attr("cy", 50)
    .attr("r", 40)
    .attr("fill", "blue");

  expect(document.body.innerHTML).toMatchSnapshot();
});

test("draw link and circle", async () => {
  const routesInitial = [
    { source: 0, target: 1, l: 20, id: "root10" },
    { source: 1, target: 2, l: 20, id: "root11" },
    { source: 2, target: 0, l: 20, id: "root12" },
    { source: 0, target: 2, l: 20, id: "re_root10" },
    { source: 1, target: 0, l: 20, id: "re_root11" },
    { source: 2, target: 1, l: 20, id: "re_root12" },
  ];

  const facilitiesInitial = [
    {
      index: 0,
      x: 230,
      y: 310,
      r: 10,
      id: "n0",
      processingTime: 1,
      type: "start",
      name: "startPoint",
    },
    {
      index: 1,
      x: 330,
      y: 60,
      r: 15,
      id: "n1",
      processingTime: 15,
      type: "machine",
      name: "machine-no-1",
      isProcessing: false,
      hasMaterial: false,
      storageSize: 0,
      processingEndTime: 0,
    },
    {
      index: 2,
      x: 430,
      y: 310,
      r: 10,
      id: "n2",
      processingTime: 1,
      type: "goal",
      name: "goalPoint",
    },
  ];

  await drawLink(routesInitial, facilitiesInitial);

  const div = document.createElement("div");
  div.innerHTML = `
    <svg id="svg02" xmlns="http://www.w3.org/2000/svg" width="700" height="800">
    </svg>
  `;

  document.body.innerHTML = '<svg id="svg02"></div>';

  expect(div).toMatchSnapShot();
});

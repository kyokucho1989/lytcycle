// query utilities:
import {
  // Tip: all queries are also exposed on an object
  // called "queries" which you could import here as well
  waitFor,
} from "@testing-library/dom";
// adds special assertions like toHaveTextContent
import "@testing-library/jest-dom";

import { drawLink } from "../src/canvas.js";
let facilitiesInitial, routesInitial;
beforeEach(() => {
  facilitiesInitial = [
    {
      index: 0,
      x: 230,
      y: 310,
      r: 10,
      id: "start",
      processingTime: 1,
      type: "start",
      name: "startPoint",
    },
    {
      index: 1,
      x: 330,
      y: 60,
      r: 15,
      id: 1,
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
      id: "goal",
      processingTime: 1,
      type: "goal",
      name: "goalPoint",
    },
  ];

  routesInitial = [
    { source: "start", target: 1, l: 20, id: "root10" },
    { source: 1, target: "goal", l: 20, id: "root11" },
    { source: "goal", target: "start", l: 20, id: "root12" },
    { source: "start", target: "goal", l: 20, id: "re_root10" },
    { source: 1, target: "start", l: 20, id: "re_root11" },
    { source: "goal", target: 1, l: 20, id: "re_root12" },
  ];
});

test("draw link and circle", async () => {
  const div = document.createElement("div");
  div.innerHTML = `
    <svg id="svg02" xmlns="http://www.w3.org/2000/svg" width="700" height="800">
    </svg>
  `;
  document.body.appendChild(div); // これを追加して、Jest の仮想 DOM に反映

  await drawLink(routesInitial, facilitiesInitial);

  await waitFor(() => {
    const group = document.querySelector("g");
    expect(group).toHaveAttribute("transform");
  });

  expect(div).toMatchSnapshot();
});

import {
  calculateCycleTime,
  calculateWaitingTime,
  judgeBottleneckProcess,
} from "../src/simulation/runner.js";
// adds special assertions like toHaveTextContent
import "@testing-library/jest-dom";

let goalPoint;

beforeEach(() => {
  goalPoint = {
    index: 2,
    x: 430,
    y: 310,
    r: 10,
    id: "n2",
    processingTime: 1,
    type: "goal",
    name: "goalPoint",
  };
  goalPoint.history = [
    { productionCount: 1, time: 143 },
    { productionCount: 2, time: 244 },
    { productionCount: 3, time: 345 },
  ];
});

test("calculate correct cycle time", () => {
  expect(calculateCycleTime(goalPoint)).toBe(101);
});

test("calculate correct waiting time", () => {
  expect(
    calculateWaitingTime([
      ["n1", 10],
      ["n2", 30],
      ["n3", 40],
    ])
  ).toBe(40);
});

test("judge correct bottleneck process", () => {
  expect(
    judgeBottleneckProcess([
      ["n1", 10],
      ["n2", 30],
      ["n3", 40],
    ])
  ).toBe("n3");
});

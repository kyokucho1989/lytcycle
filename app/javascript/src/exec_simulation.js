import anime from "animejs";
import { routes, facilities } from "src/set_simulation_params";
import { drawLink } from "src/canvas";

class Location {
  constructor(parameters) {
    this.name = parameters.name;
    this.id = parameters.id;
    this.processingTime = parseInt(parameters.processingTime) ?? 1;
    this.storageSize = parameters.storageSize ?? 0;
    this.isProcessing = false;
    this.processingEndTime = 0;
    this.type = parameters.type ?? "machine";
    this.history = [];
  }

  addStateToHistory(t, state) {
    this.history.push({ t: t, state: state });
  }

  addCountToHistory(t, count) {
    this.history.push({ t: t, productionCount: count });
  }
}

class Operator {
  constructor(parameters) {
    this.name = parameters.name;

    this.destination = 0;
    this.hasMaterial = false;
    this.arriveUpToDuration = 20;
    this.arrivalTime = 20;
    this.isMoving = false;
    this.isWaiting = false;
    this.history = [];
  }

  addStateToHistory(t, state) {
    this.history.push({
      t: t,
      state: state,
      locationId: this.currentLocation.id,
    });
  }
}

class Controller {
  constructor() {
    this.lastId = 0;
    this.route = [];
  }

  assignId() {
    this.lastId++;
    return this.lastId;
  }

  setRoutes(routes) {
    this.route = routes;
  }

  determineRoute(operator) {
    let selectedRoot, rootName, destination, roots, currentLocation;
    roots = this.route;
    currentLocation = operator.currentLocation;
    switch (operator.currentLocation.type) {
      case "start":
      // break;
      case "goal":
        selectedRoot = roots.find(
          (element) => element.source.index == currentLocation.index
        );
        destination = selectedRoot.target;
        break;
      case "machine":
        if (operator.hasMaterial) {
          // console.log("持ってる");
          selectedRoot = roots.find(
            (element) => element.source.id == currentLocation.id
          );
          destination = selectedRoot.target;
        } else {
          // console.log("もってない");
          selectedRoot = roots.find(
            (element) =>
              element.source.id == currentLocation.id &&
              element.id.includes("re")
          );
          destination = selectedRoot.target;
        }
        break;
    }

    rootName = selectedRoot.id;
    return { destination, rootName };
  }
}

function generatePairRoutes(routes) {
  let lastIds = routes.filter((element) => element.lastId);
  let filterdRoutes = routes.filter((element) => element.routeLength);
  let routesWithPairs = filterdRoutes;

  let converdRoutes = filterdRoutes.map((element) => {
    return {
      ...element,
      source: element.target,
      target: element.source,
      id: `re-${element.id}`,
    };
  });
  routesWithPairs = filterdRoutes.concat(converdRoutes);
  if (lastIds.length == 0) {
    return routesWithPairs;
  } else {
    return routesWithPairs.unshift(lastIds);
  }
}
async function countStart() {
  let linksData = generatePairRoutes(routes);
  let nodesData1 = facilities;
  await drawLink(linksData, nodesData1);

  const contoller = new Controller();
  let locations = [];

  nodesData1.forEach((facility) => {
    locations.push(new Location(facility));
  });
  contoller.setRoutes(linksData);
  // let startPoint = locations.find((object) => object.type == "start");
  let goalPoint = locations.find((object) => object.type == "goal");
  const operator1 = new Operator({ name: "Alice" });
  operator1.currentLocation = nodesData1.find(
    (object) => object.type == "start"
  );
  let endTime = 400;
  let t = 0;
  let object1, object2, object3;
  let totalCount = 0;

  let tl = anime.timeline({
    easing: "easeOutExpo",
  });
  object3 = getCountObject(totalCount);
  tl.add(object3, t * 100);

  let machine;
  while (t < endTime) {
    // console.log(`:t= ${t}`);
    if (operator1.isMoving) {
      operator1.addStateToHistory(t, "移動中");
      if (operator1.arrivalTime == t) {
        operator1.isMoving = false;
        operator1.currentLocation = operator1.destination;

        // console.log("現在地セット");
        // console.log(operator1.currentLocation);
      } else {
        // operator1.arrivalTime = operator1.arrivalTime - 1;
      }
    } else {
      switch (operator1.currentLocation.type) {
        case "machine":
          console.log(`加工地点 :t=${t}`);
          machine = locations.find(
            (elemnt) => elemnt.id == operator1.currentLocation.id
          );
          if (!machine.isProcessing || machine.processingEndTime < t) {
            operator1.addStateToHistory(t, "脱着中");
            if (!machine.hasMaterial) {
              operator1.hasMaterial = false;
            }
            machine.isProcessing = true;
            machine.hasMaterial = true;
            operator1.isWaiting = false;
            machine.processingEndTime = t + machine.processingTime;
            object2 = getMachineAnimeObject();
            tl.add(object2, t * 100)
              .add({
                targets: "circle#n1",
                easing: "steps(1)",
                fill: "#00f",
                duration: 3000,
              })
              .add({
                targets: "circle#n1",
                easing: "steps(1)",
                fill: "#000",
                duration: 100,
              });
            // console.log(tl);
          } else {
            operator1.isWaiting = true;
            // if ()
            operator1.addStateToHistory(t, "待機中");
            console.log("待機中");
          }
          break;

        case "start":
          operator1.hasMaterial = true;
          operator1.addStateToHistory(t, "脱着中");
          console.log(`start :t= ${t}`);
          break;

        case "goal":
          // console.log(`goal :t=${t}`);
          operator1.addStateToHistory(t, "脱着中");
          operator1.hasMaterial = false;
          totalCount = totalCount + 1;
          goalPoint.storageSize++;
          goalPoint.addCountToHistory(t, goalPoint.storageSize);
          object3 = getCountObject(totalCount);
          tl.add(object3, t * 100);
          break;
      }

      if (!operator1.isWaiting) {
        operator1.arrivalTime = t + 20;
        let { destination, rootName } = contoller.determineRoute(operator1);
        object1 = getAnimeObject(rootName);
        tl.add(object1, t * 100);
        operator1.destination = destination;
        operator1.isMoving = true;
      }
    }

    locations.forEach((machine) => {
      if (machine.isProcessing) {
        if (machine.processingEndTime == t) {
          // console.log("加工終了");
          machine.isProcessing = false;
        }
      }
    });
    t = t + 1;
  }

  // 結果出力

  let cycleTime = calculateCycleTime(goalPoint);
  let waitingArray = formatStateHistory(operator1);
  let waitingTime = calculateWaitingTime(waitingArray);
  let bottleneck_process = judgeBottleneckProcess(waitingArray);
  document.getElementById("simulation_cycle_time").value = cycleTime;
  document.getElementById("simulation_bottleneck_process").value =
    bottleneck_process;
  document.getElementById("simulation_waiting_time").value = waitingTime;
}

function formatStateHistory(operator) {
  let statesEachLocation = Map.groupBy(
    operator.history,
    ({ locationId }) => locationId
  );
  let array = Array.from(statesEachLocation);
  let waitingArray = array.map((element) => {
    let states = element[1];
    let filterdStates = states.filter((element) => element.state == "待機中");
    return [element[0], filterdStates.length];
  });
  return waitingArray;
}

export function calculateWaitingTime(waitingArray) {
  let waitingTimeArray = waitingArray.map((element) => element[1]);
  const waitingTime = waitingTimeArray.reduce(
    (a, b) => Math.max(a, b),
    -Infinity
  );

  return waitingTime;
}

export function judgeBottleneckProcess(waitingArray) {
  let waitingTimeArray = waitingArray.map((element) => element[1]);
  const waitingTime = waitingTimeArray.reduce(
    (a, b) => Math.max(a, b),
    -Infinity
  );

  let bottleneck_map = waitingArray.find(
    (element) => element[1] == waitingTime
  );
  let bottleneck_process = bottleneck_map[0];
  return bottleneck_process;
}

export function calculateCycleTime(goalPoint) {
  let history = goalPoint.history;
  let timeSet = history.map((element) => element.t);
  let slicedSet;
  let cycleTime;
  if (timeSet.length == 1) {
    cycleTime = timeSet;
    return cycleTime;
  } else {
    slicedSet = timeSet.slice(1);
  }
  let deferenceArray = [];
  deferenceArray = slicedSet.map((element, index) => {
    let answer = element - timeSet[index];
    return answer;
  });
  let init = 0;
  let totalTime = deferenceArray.reduce(
    (sum, currentValue) => sum + currentValue,
    init
  );
  cycleTime = totalTime / deferenceArray.length;
  return cycleTime;
}

function getCountObject(countSize) {
  let count = {
    totalCount: countSize,
  };
  let JSobjectProp = anime({
    targets: count,
    totalCount: countSize,
    easing: "linear",
    round: 1,
    update: function () {
      var el = document.querySelector("#JSobjectProp pre");
      el.innerHTML = JSON.stringify(count);
    },
  });

  return JSobjectProp;
}

function getAnimeObject(rootName) {
  let path = anime.path(`#svg02 line#${rootName}`);
  let animeObject = {
    targets: "#ob1",
    translateX: path("x"),
    translateY: path("y"),
    // direction: "alternate",
    // duration: 500,
    direction: "reverse",
    // loop: true,
    // easing: "easeInOutSine",
  };

  return animeObject;
}

function getMachineAnimeObject() {
  // const path = anime.path(`#svg01 path.${rootName}`);
  let animeObject = {
    targets: "circle#n1",
    direction: "alternate",
    // loop: true,
    easing: "linear",
    fill: "#00f",
    duration: 100,
  };

  return animeObject;
}

document.addEventListener("turbo:load", () => {
  const start = document.getElementById("startSimulation2");
  if (start) {
    start.addEventListener("click", countStart, false);
  }
});

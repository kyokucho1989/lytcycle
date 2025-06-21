import anime from "animejs";
import { routes, facilities } from "src/set_simulation_params";
import { drawLink } from "src/canvas";
import { displayResultBadge } from "src/simulation";
import { displayOperator, displayRaiseOperator } from "src/canvas";

class Location {
  constructor(parameters) {
    this.name = parameters.name;
    this.id = parameters.id;
    this.processingTime = parseInt(parameters.processingTime) ?? 1;
    this.storageSize = parameters.storageSize ?? 0;
    this.isProcessing = false;
    this.processingEndTime = 0;
    this.hasMaterial = false;
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

  determineRoute(operator, locations) {
    let selectedRoute, destination;
    const routes = this.route;
    const currentLocation = operator.currentLocation;
    const linkedRoutes = routes.filter(
      (route) =>
        route.source.index === currentLocation.index && !route.id.includes("re")
    );

    selectedRoute = linkedRoutes.find((route) => {
      let notProcessingMachine = locations.find(
        (machine) => machine.id === route.target.id && !machine.isProcessing
      );
      if (notProcessingMachine) {
        return route;
      }
    });
    if (!selectedRoute) {
      selectedRoute = linkedRoutes[0];
    }
    switch (operator.currentLocation.type) {
      case "start":
        destination = selectedRoute.target;
        break;
      case "goal":
        selectedRoute = routes.find(
          (element) => element.source.index === currentLocation.index
        );
        destination = selectedRoute.target;
        break;
      case "machine":
        if (operator.hasMaterial) {
          destination = selectedRoute.target;
        } else {
          selectedRoute = routes.find(
            (element) =>
              element.source.id === currentLocation.id &&
              element.id.includes("re")
          );
          destination = selectedRoute.target;
        }
        break;
    }

    return { destination, selectedRoute };
  }
}

function generatePairRoutes(routes) {
  const lastIds = routes.filter((element) => element.lastId);
  const filteredRoutes = routes.filter((element) => element.routeLength);
  let routesWithPairs = filteredRoutes;

  const convertedRoutes = filteredRoutes.map((element) => {
    return {
      ...element,
      source: element.target,
      target: element.source,
      id: `re-${element.id}`,
    };
  });
  routesWithPairs = filteredRoutes.concat(convertedRoutes);
  if (lastIds.length === 0) {
    return routesWithPairs;
  } else {
    return routesWithPairs.unshift(lastIds);
  }
}

let tl = anime.timeline({
  autoplay: false,
});

let countHistory = [{ t: 0, productionCount: 0 }];
const simulationSpeedRatio = 10;

document.addEventListener("turbo:load", () => {
  const start = document.getElementById("startSimulation2");
  const play = document.getElementById("play");
  const pause = document.getElementById("pause");

  let controlsProgress = document.querySelector("#simulation input.progress");
  if (controlsProgress) {
    tl = anime.timeline({
      easing: "easeOutExpo",
      autoplay: false,
      update: function () {
        let targetAnimationSecond =
          tl.duration * (controlsProgress.value / 100);
        let targetSecond =
          (targetAnimationSecond / 1000) * simulationSpeedRatio;
        controlsProgress.value = tl.progress;
        dispCount(targetSecond);
      },
    });

    controlsProgress.addEventListener("input", function () {
      let targetAnimationSecond = tl.duration * (controlsProgress.value / 100);
      let targetSecond = (targetAnimationSecond / 1000) * simulationSpeedRatio;
      tl.seek(targetAnimationSecond);
      dispCount(targetSecond);
    });
  }

  if (start) {
    start.addEventListener("click", countStart, false);
  }
  if (play) {
    play.addEventListener("click", function () {
      tl.play();
    });
  }
  if (pause) {
    pause.addEventListener("click", function () {
      tl.pause();
    });
  }
});

function dispCount(t) {
  let closestTime, count;
  let timeSeries = countHistory.map((el) => el.t);
  if (timeSeries[0] > t) {
    closestTime = 0;
    count = 0;
  } else {
    closestTime = timeSeries.reduce((a, current) => {
      if (Math.abs(current - t) < Math.abs(a - t) && current < t) {
        return current;
      } else {
        return a;
      }
    });
    count = countHistory.filter((el) => el.t === closestTime)[0]
      .productionCount;
  }

  let el = document.querySelector("#JSobjectProp pre");
  el.innerHTML = JSON.stringify(`t: ${Math.trunc(t)} / total:${count}`);
}

export async function countStart() {
  const controlsProgress = document.querySelector("#simulation input.progress");
  await displayOperator();

  if (controlsProgress) {
    controlsProgress.value = 0;
    tl = anime.timeline({
      easing: "easeOutExpo",
      autoplay: false,
      update: function () {
        let targetAnimationSecond =
          tl.duration * (controlsProgress.value / 100);
        let targetSecond =
          (targetAnimationSecond / 1000) * simulationSpeedRatio;
        controlsProgress.value = tl.progress;
        dispCount(targetSecond);
      },
    });
  }

  tl.children = [];
  const nodesData1 = facilities;
  const controller = new Controller();
  let locations = [];

  nodesData1.forEach((facility) => {
    locations.push(new Location(facility));
  });

  nodesData1.forEach((el) => (el.hasMaterial = false));
  nodesData1.forEach((el) => (el.isProcessing = false));
  nodesData1.forEach((el) => (el.processingEndTime = 0));
  const copyLinks = routes;
  const linksData2 = copyLinks.map((route) => {
    return {
      ...route,
      source: nodesData1.find((facility) => facility.id === route.source.id),
      target: nodesData1.find((facility) => facility.id === route.target.id),
      id: `${route.id}`,
    };
  });

  const linksData = generatePairRoutes(linksData2);
  await drawLink(linksData, nodesData1);

  controller.setRoutes(linksData);
  const goalPoint = locations.find((object) => object.type === "goal");
  const operator1 = new Operator({ name: "Alice" });
  operator1.currentLocation = nodesData1.find(
    (object) => object.type === "start"
  );

  const endTime = 400;
  let t = 0;
  let object1, material, machineMaterial, machine;
  let totalCount = 0;

  tl.add({ targets: "#ob1 rect", opacity: 0 }, 0);
  nodesData1.forEach((machine) => {
    const object = toggleFacilityHasMaterial(machine);
    const object2 = { targets: `circle#${machine.id}`, fill: "#99aaee" };
    tl.add(object, 0);
    tl.add(object2, 0);
  });

  while (t < endTime) {
    if (operator1.isMoving) {
      operator1.addStateToHistory(t, "移動中");
      if (operator1.arrivalTime === t) {
        operator1.isMoving = false;
        operator1.currentLocation = operator1.destination;
      }
    } else {
      switch (operator1.currentLocation.type) {
        case "machine":
          machine = nodesData1.find(
            (element) => element.id === operator1.currentLocation.id
          );
          if (!machine.isProcessing || Number(machine.processingEndTime) < t) {
            operator1.addStateToHistory(t, "脱着中");
            if (!machine.hasMaterial) {
              operator1.hasMaterial = false;
            }
            machine.isProcessing = true;
            machine.hasMaterial = true;
            machineMaterial = toggleFacilityHasMaterial(machine);
            tl.add(machineMaterial, (t * 1000) / simulationSpeedRatio);
            operator1.isWaiting = false;
            machine.processingEndTime = t + Number(machine.processingTime);
            let lightingAnime = getMachineLightingAnime(
              machine,
              simulationSpeedRatio
            );
            let lightOutAnime = getMachineLightOutAnime(
              machine,
              simulationSpeedRatio
            );
            tl.add(lightingAnime, (t * 1000) / simulationSpeedRatio).add(
              lightOutAnime
            );
          } else {
            operator1.isWaiting = true;
            operator1.addStateToHistory(t, "待機中");
          }
          break;

        case "start":
          operator1.hasMaterial = true;
          operator1.addStateToHistory(t, "脱着中");
          break;

        case "goal":
          operator1.addStateToHistory(t, "脱着中");
          operator1.hasMaterial = false;
          totalCount = totalCount + 1;
          goalPoint.storageSize++;
          goalPoint.addCountToHistory(t, goalPoint.storageSize);
          break;
      }

      if (!operator1.isWaiting) {
        let { destination, selectedRoute } = controller.determineRoute(
          operator1,
          nodesData1
        );
        operator1.arrivalTime = t + Number(selectedRoute.routeLength);
        object1 = getAnimeObject(selectedRoute);
        tl.add(object1, (t * 1000) / simulationSpeedRatio);
        material = toggleOperatorHasMaterial(operator1.hasMaterial);
        tl.add(material, (t * 1000) / simulationSpeedRatio);
        operator1.destination = destination;
        operator1.isMoving = true;
      }
    }

    nodesData1.forEach((machine) => {
      if (machine.isProcessing) {
        if (Number(machine.processingEndTime) === t) {
          machine.isProcessing = false;
        }
      }
    });
    t = t + 1;
  }

  countHistory = goalPoint.history;
  let cycleTime = calculateCycleTime(goalPoint);
  let waitingArray = formatStateHistory(operator1);
  let waitingTime = calculateWaitingTime(waitingArray);
  let bottleneck_process = judgeBottleneckProcess(waitingArray);
  document.getElementById("simulation_cycle_time").value = cycleTime;
  document.getElementById("simulation_bottleneck_process").value =
    bottleneck_process;
  document.getElementById("simulation_waiting_time").value = waitingTime;
  displayRaiseOperator();
  displayResultBadge();
  alert("シミュレーション終了");
}

function formatStateHistory(operator) {
  const statesEachLocation = Map.groupBy(
    operator.history,
    ({ locationId }) => locationId
  );
  const array = Array.from(statesEachLocation);
  const waitingArray = array.map((element) => {
    const states = element[1];
    const filteredStates = states.filter(
      (element) => element.state === "待機中"
    );
    return [element[0], filteredStates.length];
  });
  return waitingArray;
}

export function calculateWaitingTime(waitingArray) {
  const waitingTimeArray = waitingArray.map((element) => element[1]);
  const waitingTime = waitingTimeArray.reduce(
    (a, b) => Math.max(a, b),
    -Infinity
  );

  return waitingTime;
}

export function judgeBottleneckProcess(waitingArray) {
  const waitingTimeArray = waitingArray.map((element) => element[1]);
  const waitingTime = waitingTimeArray.reduce(
    (a, b) => Math.max(a, b),
    -Infinity
  );

  const bottleneck_map = waitingArray.find(
    (element) => element[1] === waitingTime
  );
  let bottleneck_process = bottleneck_map[0];
  if (bottleneck_process === "start") {
    bottleneck_process = "なし(移動ネック)";
  }
  return bottleneck_process;
}

export function calculateCycleTime(goalPoint) {
  const history = goalPoint.history;
  const timeSet = history.map((element) => element.t);
  let slicedSet;
  let cycleTime;
  if (timeSet.length === 1) {
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
  const init = 0;
  const totalTime = deferenceArray.reduce(
    (sum, currentValue) => sum + currentValue,
    init
  );
  cycleTime = totalTime / deferenceArray.length;
  return cycleTime;
}

function getAnimeObject(root) {
  const path = anime.path(`#svg02 line#${root.id}`);
  const animeObject = {
    targets: "#ob1",
    translateX: path("x"),
    translateY: path("y"),
    duration: (root.routeLength * 1000) / simulationSpeedRatio,
    direction: "reverse",
    easing: "linear",
  };
  return animeObject;
}

function toggleOperatorHasMaterial(hasState) {
  const animeObject = {
    targets: "#ob1 rect",
    opacity: hasState ? 1 : 0,
    easing: "steps(1)",
  };
  return animeObject;
}

function toggleFacilityHasMaterial(machine) {
  const animeObject = {
    targets: `rect#material-${machine.id}`,
    opacity: machine.hasMaterial ? 1 : 0,
    easing: "steps(1)",
  };
  return animeObject;
}

function getMachineLightingAnime(machine, simulationSpeedRatio) {
  return {
    targets: `circle#${machine.id}`,
    easing: "steps(1)",
    fill: "#00f",
    duration: (machine.processingTime * 1000) / simulationSpeedRatio,
  };
}

function getMachineLightOutAnime(machine, simulationSpeedRatio) {
  return {
    targets: `circle#${machine.id}`,
    easing: "steps(1)",
    fill: "#000",
    duration: 100 / simulationSpeedRatio,
  };
}

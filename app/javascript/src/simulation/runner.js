import anime from "animejs";

const RETURN_PREFIX = "re";
const SPEED_RATIO = 10;
const END_TIME = 400;

let timeLine = anime.timeline({
  autoplay: false,
});

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

  addStateToHistory(time, state) {
    this.history.push({ time: time, state: state });
  }

  addCountToHistory(time, count) {
    this.history.push({ time: time, productionCount: count });
  }
}

class Operator {
  constructor(parameters) {
    this.name = parameters.name;
    this.destination = 0;
    this.hasMaterial = false;
    this.arrivalTime = 20;
    this.isMoving = false;
    this.isWaiting = false;
    this.history = [];
  }

  addStateToHistory(time, state) {
    this.history.push({
      time: time,
      state: state,
      locationId: this.currentLocation.id,
    });
  }
}

class Controller {
  constructor() {
    this.lastId = 0;
    this.routes = [];
  }

  setRoutes(routes) {
    this.routes = routes;
  }

  determineRoute(operator, locations) {
    let selectedRoute, destination;
    const routes = this.routes;
    const currentLocation = operator.currentLocation;
    const linkedRoutes = routes.filter(
      (route) =>
        route.source.index === currentLocation.index &&
        !route.id.includes(RETURN_PREFIX)
    );

    selectedRoute = linkedRoutes.find((route) => {
      const notProcessingMachine = locations.find(
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
              element.id.includes(RETURN_PREFIX)
          );
          destination = selectedRoute.target;
        }
        break;
    }
    return { destination, selectedRoute };
  }
}

export function generatePairRoutes(routes) {
  const lastIds = routes.filter((route) => route.lastId);
  const filteredRoutes = routes.filter((route) => route.routeLength);

  const convertedRoutes = filteredRoutes.map((route) => {
    return {
      ...route,
      source: route.target,
      target: route.source,
      id: `${RETURN_PREFIX}-${route.id}`,
    };
  });
  const routesWithPairs = filteredRoutes.concat(convertedRoutes);
  return lastIds.length ? routesWithPairs.unshift(lastIds) : routesWithPairs;
}

export function addAnimationPlayEvent(countHistory) {
  const play = document.getElementById("play");
  const pause = document.getElementById("pause");

  const controlsProgress = document.querySelector("#simulation input.progress");
  const maxTime = (timeLine.duration / 1000) * SPEED_RATIO;
  if (controlsProgress) {
    controlsProgress.value = 0;
    displayCount(0, maxTime, countHistory);
    timeLine.update = function () {
      const targetAnimationSecond =
        timeLine.duration * (controlsProgress.value / 100);
      const targetSecond = (targetAnimationSecond / 1000) * SPEED_RATIO;
      controlsProgress.value = timeLine.progress;
      displayCount(targetSecond, maxTime, countHistory);
    };

    controlsProgress.addEventListener("input", function () {
      const targetAnimationSecond =
        timeLine.duration * (controlsProgress.value / 100);
      const targetSecond = (targetAnimationSecond / 1000) * SPEED_RATIO;
      timeLine.seek(targetAnimationSecond);
      displayCount(targetSecond, maxTime, countHistory);
    });
  }

  if (play) {
    play.addEventListener("click", function () {
      timeLine.play();
    });
  }
  if (pause) {
    pause.addEventListener("click", function () {
      timeLine.pause();
    });
  }
}

function displayCount(time, maxTime, countHistory) {
  let closestTime, count;
  const timeSeries = countHistory.map((record) => record.time);
  if (timeSeries[0] > time) {
    closestTime = 0;
    count = 0;
  } else {
    closestTime = timeSeries.reduce((latestPastTime, current) => {
      if (
        Math.abs(current - time) < Math.abs(latestPastTime - time) &&
        current < time
      ) {
        return current;
      } else {
        return latestPastTime;
      }
    });
    count = countHistory.filter((record) => record.time === closestTime)[0]
      .productionCount;
  }

  const el = document.querySelector("#count-window pre");
  el.innerHTML = JSON.stringify(
    `t: ${Math.trunc(time)}:${maxTime} / total:${count}`
  );
}

export function initializeSimulation(params) {
  const { routes, facilities } = params;

  // timeLineを初期化（初期化しないとseekバーを動かした時にエラーが起きるため）
  timeLine = anime.timeline({
    autoplay: false,
  });
  timeLine.children = [];

  facilities.forEach((facility) => {
    facility.hasMaterial = false;
    facility.isProcessing = false;
    facility.processingEndTime = 0;
  });

  const formattedRoutes = routes.map((route) => {
    return {
      ...route,
      source: facilities.find((facility) => facility.id === route.source.id),
      target: facilities.find((facility) => facility.id === route.target.id),
      id: String(route.id),
    };
  });

  const routesWithPairs = generatePairRoutes(formattedRoutes);
  const locations = facilities.map((facility) => new Location(facility));

  const controller = new Controller();
  controller.setRoutes(routesWithPairs);
  const goalPoint = locations.find((object) => object.type === "goal");
  const operator1 = new Operator({ name: "Alice" });
  operator1.currentLocation = facilities.find(
    (object) => object.type === "start"
  );

  return {
    facilities,
    routesWithPairs,
    goalPoint,
    operator1,
    controller,
  };
}

export async function runSimulation(params) {
  const { facilities, controller, goalPoint } = params;
  let operator1 = params["operator1"];
  facilities.forEach((facility) => {
    const facilityInitialAnimation = toggleFacilityHasMaterial(facility);
    const materialInitialAnimation = {
      targets: `circle#${facility.id}`,
      fill: "#99aaee",
    };
    timeLine.add(facilityInitialAnimation, 0);
    timeLine.add(materialInitialAnimation, 0);
  });

  let time = 0;
  let machine;
  let totalCount = 0;

  while (time < END_TIME) {
    if (operator1.isMoving) {
      operator1.addStateToHistory(time, "移動中");
      if (operator1.arrivalTime === time) {
        operator1.isMoving = false;
        operator1.currentLocation = operator1.destination;
      }
    } else {
      // 作業者の現在地によって動作を変更
      switch (operator1.currentLocation.type) {
        case "machine":
          machine = facilities.find(
            (element) => element.id === operator1.currentLocation.id
          );
          if (
            !machine.isProcessing ||
            Number(machine.processingEndTime) < time
          ) {
            const result = attachMaterialSequence(operator1, machine, time);
            ({ operator1, machine } = result);
          } else {
            operator1.isWaiting = true;
            operator1.addStateToHistory(time, "待機中");
          }
          break;

        case "start":
          operator1.hasMaterial = true;
          operator1.addStateToHistory(time, "脱着中");
          break;

        case "goal":
          operator1.addStateToHistory(time, "脱着中");
          operator1.hasMaterial = false;
          totalCount = totalCount + 1;
          goalPoint.storageSize++;
          goalPoint.addCountToHistory(time, goalPoint.storageSize);
          break;
      }

      if (!operator1.isWaiting) {
        operator1 = travelOperatorSequence(
          controller,
          operator1,
          facilities,
          time
        );
      }
    }

    // 設備の稼働状況を更新
    facilities.forEach((machine) => {
      if (machine.isProcessing) {
        if (Number(machine.processingEndTime) === time) {
          machine.isProcessing = false;
        }
      }
    });

    time++;
  }

  // 結果算出
  const countHistory = goalPoint.history;
  const cycleTime = calculateCycleTime(goalPoint);
  const waitingArray = formatStateHistory(operator1);
  const waitingTime = calculateWaitingTime(waitingArray);
  const bottleneckProcess = judgeBottleneckProcess(waitingArray);

  return { countHistory, cycleTime, bottleneckProcess, waitingTime };
}

function travelOperatorSequence(controller, operator1, facilities, time) {
  const { destination, selectedRoute } = controller.determineRoute(
    operator1,
    facilities
  );
  operator1.arrivalTime = time + Number(selectedRoute.routeLength);
  const travelingAnimation = getAnimeObject(selectedRoute);
  const materialHeldByOperator = toggleOperatorHasMaterial(
    operator1.hasMaterial
  );

  operator1.destination = destination;
  operator1.isMoving = true;

  timeLine.add(travelingAnimation, (time * 1000) / SPEED_RATIO);
  timeLine.add(materialHeldByOperator, (time * 1000) / SPEED_RATIO);

  return operator1;
}

function attachMaterialSequence(operator1, machine, time) {
  operator1.addStateToHistory(time, "脱着中");
  if (!machine.hasMaterial) {
    operator1.hasMaterial = false;
  }
  machine.isProcessing = true;
  machine.hasMaterial = true;
  operator1.isWaiting = false;

  const machineAnimation = buildMachineAnimation(machine, time);
  addMachineToTimeLine(machineAnimation, time);

  return { operator1, machine };
}

function addMachineToTimeLine(animation, time) {
  const {
    materialInMachine,
    processedMaterial,
    processingMaterial,
    lightOutAnime,
    lightingAnime,
  } = animation;

  timeLine.add(materialInMachine, (time * 1000) / SPEED_RATIO);
  timeLine
    .add(processingMaterial, (time * 1000) / SPEED_RATIO)
    .add(lightingAnime, "-=1000")
    .add(lightOutAnime)
    .add(processedMaterial);
}

function buildMachineAnimation(machine, time) {
  const materialInMachine = toggleFacilityHasMaterial(machine);

  machine.processingEndTime = time + Number(machine.processingTime);

  const lightingAnime = getMachineLightingAnime(machine);
  const lightOutAnime = getMachineLightOutAnime(machine);
  const processingMaterial = getProcessingMaterial(machine);
  const processedMaterial = getProcessedMaterial(machine);

  return {
    materialInMachine,
    lightingAnime,
    lightOutAnime,
    processedMaterial,
    processingMaterial,
  };
}

function formatStateHistory(operator) {
  const statesEachLocation = Map.groupBy(
    operator.history,
    ({ locationId }) => locationId
  );
  const array = Array.from(statesEachLocation);
  return array.map((element) => {
    const states = element[1];
    const filteredStates = states.filter(
      (element) => element.state === "待機中"
    );
    return [element[0], filteredStates.length];
  });
}

export function calculateWaitingTime(waitingArray) {
  const waitingTimeArray = waitingArray.map((element) => element[1]);
  return waitingTimeArray.reduce((a, b) => Math.max(a, b), -Infinity);
}

export function judgeBottleneckProcess(waitingArray) {
  const waitingTimeArray = waitingArray.map((element) => element[1]);
  const waitingTime = waitingTimeArray.reduce(
    (a, b) => Math.max(a, b),
    -Infinity
  );

  const bottleneckMap = waitingArray.find(
    (element) => element[1] === waitingTime
  );
  return bottleneckMap[0] === "start" ? "なし(移動ネック)" : bottleneckMap[0];
}

export function calculateCycleTime(goalPoint) {
  const history = goalPoint.history;
  const timeSet = history.map((element) => element.time);
  let slicedSet;
  let cycleTime;
  if (timeSet.length === 1) {
    cycleTime = timeSet;
    return cycleTime;
  } else {
    slicedSet = timeSet.slice(1);
  }
  const deferenceArray = slicedSet.map((element, index) => {
    return element - timeSet[index];
  });
  const totalTime = deferenceArray.reduce(
    (sum, currentValue) => sum + currentValue,
    0
  );
  return totalTime / deferenceArray.length;
}

function getAnimeObject(root) {
  const path = anime.path(`#svg02 line#${root.id}`);
  return {
    targets: "#ob1",
    translateX: path("x"),
    translateY: path("y"),
    duration: (root.routeLength * 1000) / SPEED_RATIO,
    direction: "reverse",
    easing: "linear",
  };
}

function toggleOperatorHasMaterial(hasState) {
  return {
    targets: "#ob1 rect",
    opacity: hasState ? 1 : 0,
    easing: "steps(1)",
  };
}

function toggleFacilityHasMaterial(machine) {
  return {
    targets: `rect#material-${machine.id}`,
    opacity: machine.hasMaterial ? 1 : 0,
    easing: "steps(1)",
  };
}

function getProcessedMaterial(machine) {
  return {
    targets: `rect#material-${machine.id}`,
    translateX: +30,
    duration: 10,
  };
}

function getProcessingMaterial(machine) {
  return {
    targets: `rect#material-${machine.id}`,
    translateX: -10,
    duration: 10,
  };
}

function getMachineLightingAnime(machine) {
  return {
    targets: `circle#${machine.id}`,
    easing: "steps(1)",
    fill: "#00f",
    duration: (machine.processingTime * 1000) / SPEED_RATIO,
  };
}

function getMachineLightOutAnime(machine) {
  return {
    targets: `circle#${machine.id}`,
    easing: "steps(1)",
    fill: "#000",
    duration: 100 / SPEED_RATIO,
  };
}

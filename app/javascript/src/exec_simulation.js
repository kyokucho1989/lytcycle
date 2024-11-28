import anime from "animejs";
// import * as d3 from "d3";
// import { routes, operators, facilities } from "src/set_simulation_params";
// データの初期値をロード

let linksData = [
  { source: 0, target: 1, l: 20, id: "root10" },
  { source: 1, target: 2, l: 20, id: "root11" },
  { source: 2, target: 0, l: 20, id: "root12" },
  { source: 0, target: 2, l: 20, id: "re_root10" },
  { source: 1, target: 0, l: 20, id: "re_root11" },
  { source: 2, target: 1, l: 20, id: "re_root12" },
];

let nodesData1 = [
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
    this.history.push({ t: t, state: state });
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
    console.log(currentLocation);
    switch (operator1.currentLocation.type) {
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
          console.log("持ってる");
          selectedRoot = roots.find(
            (element) => element.source.index == currentLocation.index
          );
          destination = selectedRoot.target;
        } else {
          console.log("もってない");
          selectedRoot = roots.find(
            (element) =>
              element.source.index == currentLocation.index &&
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

const contoller = new Controller();

contoller.setRoutes(linksData);

const operator1 = new Operator({ name: "Alice" });
operator1.currentLocation = nodesData1.find((object) => object.type == "start");
// console.log(operator1.currentLocation);

function countStart() {
  let endTime = 90;
  let t = 0;
  let object1, object2, object3;
  let totalCount = 0;

  let tl = anime.timeline({
    easing: "easeOutExpo",
  });
  object3 = getCountObject(totalCount);
  tl.add(object3, t * 100);

  let machine = nodesData1.find((object) => object.type == "machine");

  while (t < endTime) {
    // console.log(`:t= ${t}`);
    if (operator1.isMoving) {
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
          if (!machine.isProcessing || machine.processingEndTime < t) {
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
            console.log("待機中");
          }
          break;

        case "start":
          operator1.hasMaterial = true;
          console.log(`start :t= ${t}`);
          break;

        case "goal":
          console.log(`goal :t=${t}`);
          operator1.hasMaterial = false;
          totalCount = totalCount + 1;

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
    if (machine.isProcessing) {
      // console.log(`加工終了時間:t= ${location1.processingEndTime}`);
      if (machine.processingEndTime == t) {
        // console.log("加工終了");
        machine.isProcessing = false;
      }
    }
    t = t + 1;
  }
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
  let path = anime.path(`#svg01 line#${rootName}`);
  let animeObject = {
    targets: "#ob1",
    translateX: path("x"),
    translateY: path("y"),
    // direction: "alternate",
    // duration: 500,
    direction: "reverse",
    // loop: true,
    // easing: "linear",
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
    alert("e");
    start.addEventListener("click", countStart, false);
  }
});

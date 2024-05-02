import anime from "animejs";

/*

*/

class Operator {
  constructor(parameters) {
    this.name = parameters.name;
    this.currentLocation = 0;
    this.destination = 1;
    this.hasMaterial = false;
    this.arriveUpToDuration = 20;
    this.arrivalTime = 0;
    this.history = [];
  }

  addStateToHistory(t, state) {
    this.history.push({ t: t, state: state });
  }
}

class Location {
  constructor(parameters) {
    this.name = parameters.name;
    this.id = parameters.id;
    this.processingTime = parameters.processingTime ?? 1;
    this.storageSize = parameters.storageSize ?? 0;
    this.isProcessing = false;
    this.processingEndTime = 0;
    this.type = parameters.type ?? "machine";
  }
}

class Controller {
  constructor() {
    this.lastId = 0;
  }

  assignId() {
    this.lastId++;
    return this.lastId;
  }
}
const contoller = new Controller();

const startPoint = new Location({
  name: "startPoint",
  id: contoller.assignId(),
  storageSize: 20,
  type: "start",
});

const location1 = new Location({
  name: "spot1",
  id: contoller.assignId(),
  processingTime: 20,
});

const goalPoint = new Location({
  name: "goalPoint",
  id: contoller.assignId(),
  type: "goal",
});

const operator1 = new Operator({ name: "Alice" });
console.log(startPoint);
console.log(location1);
console.log(goalPoint);
console.log(operator1);

function countStart() {
  let endTime = 100;
  let t = 0;
  if (operator1.arrivalTime == 0) {
    operator1;
  } else {
  }
  animeStart();
  let x = 0;
  let positions = [];
  while (t < endTime) {
    x = t * 2;
    positions.push({ t: t, x: x });
    t = t + 1;
  }
  // console.log(positions);
  // alert("end");
}

function countOne(count) {
  // return new Promise(function (resoleve, reject) {
  console.log("%d aaa", count);
  xc;
  // setTimeout(() => {
  //   resoleve(console.log("count.."));
  // }, 1000);
  // });
}

function animeStart() {
  const path = anime.path("#svg01 path");
  let object1 = {
    targets: "#ob1",
    translateX: path("x"),
    translateY: path("y"),
    direction: "alternate",
    duration: 4000,
    loop: true,
    easing: "linear",
  };

  let object2 = {
    targets: "#ob2",
    translateX: path("x"),
    translateY: path("y"),
    direction: "alternate",
    duration: 4000,
    loop: true,
    easing: "easeInOutSine",
  };

  var tl = anime.timeline({
    easing: "easeOutExpo",
    duration: 500,
  });

  // let tl = anime.timeline(object1);
  tl.add(object1).add(object2, "-=2000");
}

document.addEventListener("DOMContentLoaded", () => {
  const start = document.getElementById("startbutton");
  if (start) {
    start.addEventListener("click", countStart, false);
  }
});

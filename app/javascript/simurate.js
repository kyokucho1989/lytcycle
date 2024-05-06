import anime from "animejs";

class Operator {
  constructor(parameters) {
    this.name = parameters.name;
    this.currentLocation = 0;
    this.destination = 0;
    this.hasMaterial = false;
    this.arriveUpToDuration = 20;
    this.arrivalTime = 20;
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
  let object1, object2, object3;
  var tl = anime.timeline({
    easing: "easeOutExpo",
  });
  while (t < endTime) {
    if (operator1.arrivalTime == 0) {
      console.log(operator1.destination);
      operator1.arrivalTime = 20;
      object1 = getAnimeObject(`root${operator1.destination}`);
      tl.add(object1, t * 100);
      operator1.destination = (operator1.destination + 1) % 3;
    } else {
      operator1.arrivalTime = operator1.arrivalTime - 1;
    }
    t = t + 1;
  }
}

function getAnimeObject(rootName) {
  const path = anime.path(`#svg01 path.${rootName}`);
  let animeObject = {
    targets: "#ob1",
    translateX: path("x"),
    translateY: path("y"),
    direction: "alternate",
    duration: 500,
    loop: true,
    easing: "linear",
  };

  return animeObject;
}

document.addEventListener("DOMContentLoaded", () => {
  const start = document.getElementById("startbutton");
  if (start) {
    start.addEventListener("click", countStart, false);
  }
});

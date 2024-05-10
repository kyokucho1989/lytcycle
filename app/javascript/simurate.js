import anime from "animejs";

class Operator {
  constructor(parameters) {
    this.name = parameters.name;

    this.destination = 0;
    this.hasMaterial = false;
    this.arriveUpToDuration = 20;
    this.arrivalTime = 20;
    this.isMoving = false;
    this.history = [];
  }

  // set currentLocation(name) {
  //   this.currentLocation = name;
  // }
  // get currentLocation() {
  //   return this.currentLocation;
  // }

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
    this.route = [
      { name: "root0", to: 0 },
      { name: "root1", to: 1 },
      { name: "root2", to: 2 },
    ];
  }

  assignId() {
    this.lastId++;
    return this.lastId;
  }

  determineRoute(operator) {
    let destination, rootName;
    destination = (operator.destination + 1) % 3;
    rootName = `root${operator.destination}`;
    return { destination, rootName };
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
operator1.currentLocation = startPoint;
console.log(operator1.currentLocation);
startPoint.name = "aaa";
console.log(operator1.currentLocation);
// operator1.currentLocation = "startPoint";
// console.log(startPoint);
// console.log(location1);
// console.log(goalPoint);
// console.log(operator1);

function countStart() {
  let endTime = 100;
  let t = 0;
  let object1, object2, object3;

  /*
 オペレーターは移動中か
    No ->
    オペレータの現在地とその種類を取得
    もしその地点が機械か
      機械は停止中か？
        -> 機械のスイッチON
        　  機械を動かす

          オペレータのステータスを移動中に変更
            目的地を設定

    YES ->
      到着地点についているか？
        No -> 移動させる


    オペレーターの現在地を代入 idを代入する?
    到着したら現在地に目的地のidを代入
    　目的地を
　オペレーターの現在の状態を取得
　

*/

  var tl = anime.timeline({
    easing: "easeOutExpo",
  });
  while (t < endTime) {
    if (operator1.isMoving) {
      console.log("moving");
      if (operator1.arrivalTime == 0) {
        operator1.isMoving = false;
        operator1.currentLocation = operator1.destination;
        // console.log(operator1.destination);
      } else {
        operator1.arrivalTime = operator1.arrivalTime - 1;
      }
    } else {
      operator1.arrivalTime = 20;
      let { destination, rootName } = contoller.determineRoute(operator1);
      // object1 = getAnimeObject(`root${operator1.destination}`);
      object1 = getAnimeObject(rootName);
      tl.add(object1, t * 100);
      operator1.destination = (operator1.destination + 1) % 3;

      if (operator1.currentLocation == startPoint) {
        console.log("start");
      } else if (operator1.currentLocation == goalPoint) {
        console.log("goal");
      }

      operator1.isMoving = true;
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

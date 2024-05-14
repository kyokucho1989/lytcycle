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
    selectedRoot = roots.filter((root) => {
      let fromPoint = Object.values(root)[1];
      if (fromPoint.id == currentLocation.id) {
        return root;
      }
    });
    destination = selectedRoot[0].to;
    rootName = selectedRoot[0].name;
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

contoller.setRoutes([
  { name: "root0", from: startPoint, to: location1 },
  { name: "root1", form: location1, to: goalPoint },
  { name: "root2", from: goalPoint, to: startPoint },
]);

console.log(contoller.route);
const operator1 = new Operator({ name: "Alice" });
operator1.currentLocation = startPoint;
console.log(operator1.currentLocation);

function countStart() {
  let endTime = 90;
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
    console.log(`:t= ${t}`);
    if (operator1.isMoving) {
      // console.log(`:到着時間= ${operator1.arrivalTime}`);
      if (operator1.arrivalTime == t) {
        operator1.isMoving = false;
        operator1.currentLocation = operator1.destination;

        // console.log("現在地セット");
        // console.log(operator1.currentLocation);
      } else {
        // operator1.arrivalTime = operator1.arrivalTime - 1;
      }
    } else {
      operator1.arrivalTime = t + 20;
      let { destination, rootName } = contoller.determineRoute(operator1);
      object1 = getAnimeObject(rootName);
      tl.add(object1, t * 100);
      operator1.destination = destination;
      if (operator1.currentLocation == startPoint) {
        // console.log(`start :t= ${t}`);
      } else if (operator1.currentLocation == goalPoint) {
        // console.log(`goal :t=${t}`);
      } else if (operator1.currentLocation == location1) {
        // console.log(`加工地点 :t=${t}`);
        if (!location1.isProcessing) {
          location1.isProcessing = true;
          location1.processingEndTime = t + location1.processingTime;
          object2 = getMachineAnimeObject();
          console.log(`加工地点 :t=${t}`);
          tl.add(object2, t * 100)
            .add({
              targets: "#machine1",
              easing: "steps(1)",
              fill: "#00f",
              duration: 3000,
            })
            .add({
              targets: "#machine1",
              easing: "steps(1)",
              fill: "#000",
              duration: 100,
            });
          console.log(tl);
        }
      }
      operator1.isMoving = true;
    }
    if (location1.isProcessing) {
      // console.log(`加工終了時間:t= ${location1.processingEndTime}`);
      if (location1.processingEndTime == t) {
        // console.log("加工終了");
        location1.isProcessing = false;
      }
    } else {
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

function getMachineAnimeObject() {
  // const path = anime.path(`#svg01 path.${rootName}`);
  let animeObject = {
    targets: "#machine1",
    direction: "alternate",
    // loop: true,
    easing: "linear",
    fill: "#00f",
    duration: 100,
  };

  return animeObject;
}

document.addEventListener("DOMContentLoaded", () => {
  const start = document.getElementById("startbutton");
  if (start) {
    start.addEventListener("click", countStart, false);
  }
});

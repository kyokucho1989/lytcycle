import anime from "animejs";
import * as d3 from "d3";

const width = 640;
const height = 800;

const svg = d3
  .select("body")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

// const sim = d3.forceSimulation(nodes)

// this.name = parameters.name;
// this.id = parameters.id;
// this.processingTime = parameters.processingTime ?? 1;
// this.storageSize = parameters.storageSize ?? 0;
// this.isProcessing = false;
// this.processingEndTime = 0;
// this.type = parameters.type ?? "machine";

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

let linksData = [
  { source: 0, target: 1, l: 20, id: "root10" },
  { source: 1, target: 2, l: 20, id: "root11" },
  { source: 2, target: 0, l: 20, id: "root12" },
];

var link = d3
  .select("svg")
  .selectAll("line")
  .data(linksData)
  .enter()
  .append("line")
  .attr("stroke-width", 1)
  .attr("stroke", "black")
  .attr("id", function (d) {
    return d.id;
  });

svg
  .insert("g")
  .selectAll("line")
  .data(linksData)
  .enter()
  .append("line")
  .attr("stroke-width", 1)
  .attr("stroke", "black")
  .attr("id", function (d) {
    return d.id;
  });

var node = d3
  .select("svg")
  .selectAll("circle")
  .data(nodesData1)
  .enter()
  .append("circle")
  .attr("r", function (d) {
    return d.r;
  })
  .attr("stroke", "black")
  .attr("fill", "LightSalmon")
  .attr("id", function (d) {
    return d.id;
  });

// シミュレーション描画
let simulation = d3
  .forceSimulation()
  .force("link", d3.forceLink().strength(0).iterations(1))
  .force("charge", d3.forceManyBody().strength(0))
  .force(
    "x",
    d3
      .forceX()
      .strength(-0.01)
      .x(100 / 2)
  )
  .force(
    "y",
    d3
      .forceY()
      .strength(-0.001)
      .y(100 / 2)
  );

simulation.nodes(nodesData1).on("tick", ticked);

simulation
  .force("link")
  .links(linksData)
  .id(function (d) {
    return d.index;
  });

function ticked() {
  link
    .attr("x1", (d) => d.source.x)
    .attr("y1", (d) => d.source.y)
    .attr("x2", (d) => d.target.x)
    .attr("y2", (d) => d.target.y);

  node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
}

// クラス宣言

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
    console.log(currentLocation);
    selectedRoot = roots.find(
      (element) => element.source.index == currentLocation.index
    );
    console.log(selectedRoot);
    destination = selectedRoot.target;
    rootName = selectedRoot.id;
    return { destination, rootName };
  }
}

const contoller = new Controller();

// const startPoint = new Location({
//   name: "startPoint",
//   id: contoller.assignId(),
//   storageSize: 20,
//   type: "start",
// });

// const location1 = new Location({
//   name: "spot1",
//   id: contoller.assignId(),
//   processingTime: 20,
// });

// const goalPoint = new Location({
//   name: "goalPoint",
//   id: contoller.assignId(),
//   type: "goal",
// });

contoller.setRoutes(linksData);

console.log(contoller.route);
const operator1 = new Operator({ name: "Alice" });
operator1.currentLocation = nodesData1.find((object) => object.type == "start");
console.log(operator1.currentLocation);

function countStart2() {
  const path = anime.path(`line#l0`);
  let animeObject = {
    targets: "text#ob1",
    translateX: path("x"),
    translateY: path("y"),
    direction: "alternate",
    duration: 500,
    loop: true,
    easing: "linear",
  };

  var tl = anime.timeline({
    easing: "easeOutExpo",
  });

  tl.add(animeObject);
}

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
  let machine = nodesData1.find((object) => object.type == "machine");

  while (t < endTime) {
    // console.log(`:t= ${t}`);
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
      if (operator1.currentLocation.type == "start") {
        console.log(`start :t= ${t}`);
      } else if (operator1.currentLocation.type == "goal") {
        console.log(`goal :t=${t}`);
      } else if (operator1.currentLocation.type == "machine") {
        console.log(`加工地点 :t=${t}`);
        if (!machine.isProcessing) {
          machine.isProcessing = true;
          machine.processingEndTime = t + machine.processingTime;
          object2 = getMachineAnimeObject();
          // console.log(`加工地点 :t=${t}`);
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
        }
      }
      operator1.isMoving = true;
    }
    if (machine.isProcessing) {
      // console.log(`加工終了時間:t= ${location1.processingEndTime}`);
      if (machine.processingEndTime == t) {
        // console.log("加工終了");
        machine.isProcessing = false;
      }
    } else {
    }
    t = t + 1;
  }
}

function getAnimeObject(rootName) {
  const path = anime.path(`#svg01 line#${rootName}`);
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
    targets: "circle#n1",
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

  const start2 = document.getElementById("startbutton2");
  if (start2) {
    start2.addEventListener("click", countStart2, false);
  }
});

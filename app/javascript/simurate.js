import anime from "animejs";
import * as d3 from "d3";

const width = 640;
const height = 300;
const step = 14;
const marginTop = 20;
const marginRight = 20;
const marginBottom = 20;
const marginLeft = 130;
let nodes = [
  { id: 1, name: "start" },
  { id: 2, name: "goal" },
];

let links = [{ source: 1, target: 2, distance: 2 }];
const orders = { byname: [1, 2] };
// const height = (nodes.length - 1) * step + marginTop + marginBottom;
const x = d3.scalePoint([1, 2], [100, 400]);
console.log(x);
const X = new Map(nodes.map(({ id }) => [id, x(id)]));

function arc(d) {
  console.log(X);
  const x1 = X.get(d.source);
  const x2 = X.get(d.target);
  console.log(`M${x1} ${marginTop} L ${x2} ${marginTop}`);
  return `M${x1} ${marginTop} L ${x2} ${marginTop}`;
  // const r = Math.abs(x/y2 - y1) / 2;
  // return `M${marginLeft},${y1}A${r},${r} 0,0,${
  //   y1 < y2 ? 1 : 0
  // } ${marginLeft},${y2}`;
}

const svg = d3
  .select("body")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

const path = svg
  .insert("g", "*")
  .selectAll("path")
  .data(links)
  .join("path")
  .attr("d", arc);

const label = svg
  .append("g")
  .attr("font-family", "sans-serif")
  .attr("font-size", 16)
  .attr("text-anchor", "end")
  .selectAll("g")
  .data(nodes)
  .join("g")
  .attr("transform", (d) => `translate(${X.get(d.id)},${marginTop})`)
  .call((g) =>
    g
      .append("text")
      .attr("x", -16)
      .text((d) => d.name)
  )
  .call((g) => g.append("circle").attr("r", 12));

function update() {
  // label
  //   .sort((a, b) => d3.ascending(X.get(a.id), X.get(b.id)))
  //   .transition()
  //   .duration(750)
  //   .delay((d, i) => i * 20) // Make the movement start from the top.
  //   .attrTween("transform", (d) => {
  //     const i = d3.interpolateNumber(X.get(d.id), x(d.id));
  //     return (t) => {
  //       const y = i(t);
  //       X.set(d.id, x);
  //       return `translate(${X.get(d.id)},${marginTop})`;
  //     };
  //   });

  path
    .transition()
    .duration(750 + nodes.length * 20) // Cover the maximum delay of the label transition.
    .attrTween("d", (d) => () => arc(d));
}

// update();
// d3.select("body")
//   .append("table")
//   .selectAll("tr")
//   .data(matrix)
//   .join("tr")
//   .selectAll("td")
//   .data((d) => d)
//   .join("td")
//   .text((d) => d);

// var g = svg.append("g");
// var link = d3.select("svg");
// .selectAll("line")
// .data(linksData)
// .enter()
// .append("line")
// .attr("stroke-width", 10)
// .attr("stroke", "orange");

let svg2 = d3.select("div.myclass").append("span").text("from D3.js");
// .append("svg")
//     .attr("width", width).attr("height", height)
// 要素の描画

// function chart() {
// // Specify the dimensions of the chart.
// const width = 928;
// const height = 600;

// // Specify the color scale.
// const color = d3.scaleOrdinal(d3.schemeCategory10);

// // The force simulation mutates links and nodes, so create a copy
// // so that re-evaluating this cell produces the same result.
// const links = data.links.map((d) => ({ ...d }));
// const nodes = data.nodes.map((d) => ({ ...d }));

// // Create a simulation with several forces.
// const simulation = d3
//   .forceSimulation(nodes)
//   .force(
//     "link",
//     d3.forceLink(links).id((d) => d.id)
//   )
//   .force("charge", d3.forceManyBody())
//   .force("center", d3.forceCenter(width / 2, height / 2))
//   .on("tick", ticked);

// // Create the SVG container.
// const svg = d3
//   .create("svg")
//   .attr("width", width)
//   .attr("height", height)
//   .attr("viewBox", [0, 0, width, height])
//   .attr("style", "max-width: 100%; height: auto;");

// // Add a line for each link, and a circle for each node.
// const link = svg
//   .append("g")
//   .attr("stroke", "#999")
//   .attr("stroke-opacity", 0.6)
//   .selectAll()
//   .data(links)
//   .join("line")
//   .attr("stroke-width", (d) => Math.sqrt(d.value));

// const node = svg
//   .append("g")
//   .attr("stroke", "#fff")
//   .attr("stroke-width", 1.5)
//   .selectAll()
//   .data(nodes)
//   .join("circle")
//   .attr("r", 5)
//   .attr("fill", (d) => color(d.group));

// node.append("title").text((d) => d.id);

// // Set the position attributes of links and nodes each time the simulation ticks.
// function ticked() {
//   link
//     .attr("x1", (d) => d.source.x)
//     .attr("y1", (d) => d.source.y)
//     .attr("x2", (d) => d.target.x)
//     .attr("y2", (d) => d.target.y);

//   node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
// }

// // When this cell is re-run, stop the previous simulation. (This doesn’t
// // really matter since the target alpha is zero and the simulation will
// // stop naturally, but it’s a good practice.)
// invalidation.then(() => simulation.stop());

// return svg.node();
// }

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

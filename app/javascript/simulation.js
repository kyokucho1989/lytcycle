// データの初期値をロード

let routes;
let operators;
let facilities;

const routesInitial = [
  { source: 0, target: 1, l: 20, id: "root10" },
  { source: 1, target: 2, l: 20, id: "root11" },
  { source: 2, target: 0, l: 20, id: "root12" },
  { source: 0, target: 2, l: 20, id: "re_root10" },
  { source: 1, target: 0, l: 20, id: "re_root11" },
  { source: 2, target: 1, l: 20, id: "re_root12" },
];
let operatorsInitial = [{ name: "Alice" }];
const facilitiesInitial = [
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

document.addEventListener("DOMContentLoaded", () => {
  let simulationParameters = document.getElementById("simulation-data");
  if (simulationParameters) {
    let simulationId = simulationParameters.dataset.id;
    if (simulationId == "") {
      // 初期値設定
      routes = routesInitial;
      operators = operatorsInitial;
      facilities = facilitiesInitial;
      console.log("初期値設定終了");
    } else {
      // データロード
      routes = simulationParameters.dataset.routes;
      operators = simulationParameters.dataset.operators;
      facilities = simulationParameters.dataset.facilities;
      console.log(simulationParameters.dataset);
      console.log("ロード完了");
    }
  }

  // データ整形
});

document.addEventListener("DOMContentLoaded", () => {
  const saveSimulationButton = document.getElementById("savesimulation");
  if (saveSimulationButton) {
    saveSimulationButton.addEventListener(
      "click",
      addSimulationParameters,
      false
    );
  }
});

function addSimulationParameters() {
  document.getElementById("simulation_parameters_routes").value =
    JSON.stringify(routes);
  document.getElementById("simulation_parameters_operators").value =
    JSON.stringify(operators);
  document.getElementById("simulation_parameters_facilities").value =
    JSON.stringify(facilities);
}

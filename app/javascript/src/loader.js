// import { drawLink } from "./render";

export let routes, operators, facilities;
// const routesInitial = [
//   { source: "start", target: "n1", routeLength: 20, id: "root10" },
//   { source: "n1", target: "goal", routeLength: 20, id: "root1-1" },
//   { source: "goal", target: "start", routeLength: 20, id: "root-10" },
// ];
// const operatorsInitial = [{ name: "Alice" }];
// const facilitiesInitial = [
//   {
//     x: 430,
//     y: 310,
//     r: 10,
//     id: "goal",
//     processingTime: 1,
//     type: "goal",
//     name: "goal",
//   },
//   {
//     x: 230,
//     y: 310,
//     r: 10,
//     id: "start",
//     processingTime: 1,
//     type: "start",
//     name: "start",
//   },
//   {
//     x: 330,
//     y: 60,
//     r: 15,
//     id: "n1",
//     processingTime: 15,
//     type: "machine",
//     name: "machine-1",
//     isProcessing: false,
//     hasMaterial: false,
//     storageSize: 0,
//     processingEndTime: 0,
//   },
// ];

export async function loadObjects() {
  const response = await fetch("edit.json");
  console.log(response);
  if (!response.ok) {
    throw new Error(`レスポンスステータス: ${response.status}`);
  }
  const json = await response.json();
  routes = JSON.parse(json.routes);
  facilities = JSON.parse(json.facilities);
  operators = JSON.parse(json.operators);

  routes.forEach((route) => {
    if (typeof route.source === "object") {
      route.source = route.source.id;
    }
    if (typeof route.target === "object") {
      route.target = route.target.id;
    }
  });
  return { routes, facilities, operators };
}

// document.addEventListener("turbo:load", async () => {
//   const simulationParameters = document.getElementById("simulation-data");
//   if (simulationParameters) {
//     const simulationId = simulationParameters.dataset.id;

//     if (simulationId === "") {
//       routes = routesInitial;
//       operators = operatorsInitial;
//       facilities = facilitiesInitial;
//       drawLink(routes, facilities);
//     } else {
//       try {
//         const response = await fetch("edit.json");
//         if (!response.ok) {
//           throw new Error(`レスポンスステータス: ${response.status}`);
//         }
//         const json = await response.json();
//         routes = JSON.parse(json.routes);
//         facilities = JSON.parse(json.facilities);
//         operators = JSON.parse(json.operators);

//         routes.forEach((route) => {
//           if (typeof route.source === "object") {
//             route.source = route.source.id;
//           }
//           if (typeof route.target === "object") {
//             route.target = route.target.id;
//           }
//         });

//         drawLink(routes, facilities);
//         return json;
//       } catch (error) {
//         console.error(error.message);
//       }
//     }
//   }
// });

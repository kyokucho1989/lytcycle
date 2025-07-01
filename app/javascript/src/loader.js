export async function loadObjects() {
  const simulationData = document.getElementById("simulation-data");
  if (simulationData) {
    const routes = JSON.parse(simulationData.dataset.routes);
    const facilities = JSON.parse(simulationData.dataset.facilities);
    const operators = JSON.parse(simulationData.dataset.operators);

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
}

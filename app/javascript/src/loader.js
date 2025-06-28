export async function loadObjects() {
  try {
    const response = await fetch("edit.json");
    if (!response.ok) {
      throw new Error(`レスポンスステータス: ${response.status}`);
    }
    const json = await response.json();
    const routes = JSON.parse(json.routes);
    const facilities = JSON.parse(json.facilities);
    const operators = JSON.parse(json.operators);

    routes.forEach((route) => {
      if (typeof route.source === "object") {
        route.source = route.source.id;
      }
      if (typeof route.target === "object") {
        route.target = route.target.id;
      }
    });
    return { routes, facilities, operators };
  } catch (error) {
    console.error(error.message);
  }
}

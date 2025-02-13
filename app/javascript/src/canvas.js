import * as d3 from "d3";
import { routes, facilities } from "src/set_simulation_params";
// データの初期値をロード

export let link, node, simulation;
import { setFacilityDataToModal } from "src/simulation";
import { setRouteDataToModal } from "src/simulation";
import { facilityDialog, routeDialog } from "src/simulation";
export async function drawLink(linksData, nodesData) {
  return new Promise((resolve) => {
    d3.select("#svg02").selectAll("line").remove();
    d3.select("#svg02").selectAll("circle").remove();
    function ticked() {
      link
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => adjustLinkEnd(d).x)
        .attr("y2", (d) => adjustLinkEnd(d).y);

      node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
    }

    function adjustLinkEnd(link) {
      let x1 = link.source.x;
      let x2 = link.target.x;
      let y1 = link.source.y;
      let y2 = link.target.y;
      const offsetLength = 30;
      const distance = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
      const ratio = (distance - offsetLength) / distance;
      const adjustedX = ratio * (x2 - x1) + x1;
      const adjustedY = ratio * (y2 - y1) + y1;
      return { x: adjustedX, y: adjustedY };
    }

    const simurateSvg = document.getElementById("svg02");
    if (simurateSvg) {
      link = d3
        .select("#svg02")
        .selectAll("line")
        .data(linksData)
        .enter()
        .append("line")
        .attr("stroke-width", 8)
        .attr("stroke", "black")
        .attr("id", function (d) {
          return d.id;
        })
        .attr("marker-end", "url(#arr)");

      node = d3
        .select("#svg02")
        .selectAll("circle")
        .data(nodesData)
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
      simulation = d3
        .forceSimulation()
        .force(
          "link",
          d3
            .forceLink()
            .strength(0)
            .id((d) => d.id)
        )
        .force("charge", d3.forceManyBody().strength(0))
        .force("x", null)
        .force("y", null)
        .on("tick", ticked);

      simulation
        .nodes(nodesData)
        .on("tick", ticked)
        .on("end", () => {
          resolve();
        });

      simulation.nodes(nodesData).on("end", () => {
        resolve();
      });
      node
        .call(
          d3
            .drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended)
        )
        .on("click", nodeClicked);
      link.on("click", linkClicked);
      simulation.force("link").links(linksData);

      // 手動でシミュレーション終了
      setTimeout(() => {
        simulation.stop();
        resolve();
      }, 1000); // 1秒後にシミュレーションを強制終了
    } else {
      resolve(); // SVGが存在しない場合もresolveを呼び出す
    }
  });
}

// export function createLink() {
//   // let selectedFacility = facilities.find((facility) => facility.id == this.id);
//   if (this.hasAttribute("selected")) {
//     this.removeAttribute("selected");
//   } else {
//     this.setAttribute("selected", "");
//   }
//   let selectedNodes = document.querySelectorAll("circle[selected]");
//   if (selectedNodes.length == 2) {
//     console.log("2つ以上のnodeあり");

//     addRoute();
//     selectedNodes.forEach((element) => {
//       element.removeAttribute("selected");
//     });
//   }
//   console.log(selectedNodes);
// }

export function nodeClicked() {
  let facilityForEdit = facilities.find((facility) => facility.id == this.id);
  setFacilityDataToModal(facilityForEdit);
  facilityDialog.showModal();
}

export function linkClicked() {
  const canvasController = document.querySelector(
    "[data-controller='simulationmode']"
  ).controller;
  console.log(canvasController);

  let routeForEdit = routes.find((route) => route.id == this.id);
  setRouteDataToModal(routeForEdit);
  routeDialog.showModal();
}

function dragstarted(event) {
  if (!event.active) simulation.alphaTarget(0.3).restart();
  event.subject.fx = event.subject.x;
  event.subject.fy = event.subject.y;
}

// Update the subject (dragged node) position during drag.
function dragged(event) {
  event.subject.fx = event.x;
  event.subject.fy = event.y;
}

function dragended(event) {
  if (!event.active) simulation.alphaTarget(0);
  event.subject.fx = null;
  event.subject.fy = null;
}

export function changeInactiveObject() {
  d3.select("#svg02").selectAll("line").on("click", null);
  d3.select("#svg02").selectAll("circle").on("click", null);
}

export function changeActiveObject() {
  d3.select("#svg02").selectAll("line").on("click", linkClicked);
  d3.select("#svg02").selectAll("circle").on("click", nodeClicked);
}

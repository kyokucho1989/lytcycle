import * as d3 from "d3";
import { routes, facilities } from "src/set_simulation_params";
// データの初期値をロード

export let link, node, simulation;
import { setFacilityDataToModal } from "src/simulation";
import { setRouteDataToModal } from "src/simulation";
let facilityDialog, routeDialog;
export async function drawLink(linksData, nodesData) {
  d3.select("#svg02").selectAll("line").remove();
  d3.select("#svg02").selectAll("circle").remove();

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
    });

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

  const simurateSvg = document.getElementById("svg02");
  if (simurateSvg) {
    // シミュレーション描画
    simulation = d3
      .forceSimulation()
      .force("link", d3.forceLink().strength(0))
      .force("charge", d3.forceManyBody().strength(0))
      .force("x", null)
      .force("y", null);

    simulation.nodes(nodesData).on("tick", ticked);
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
    simulation
      .force("link")
      .links(linksData)
      .id(function (d) {
        return d.index;
      });
  }
}

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
  console.log(routeForEdit);
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

function ticked() {
  link
    .attr("x1", (d) => d.source.x)
    .attr("y1", (d) => d.source.y)
    .attr("x2", (d) => d.target.x)
    .attr("y2", (d) => d.target.y);

  node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
}

export function changeInactiveObject() {
  d3.select("#svg02").selectAll("line").on("click", null);
  d3.select("#svg02").selectAll("circle").on("click", null);
}

export function changeActiveObject() {
  d3.select("#svg02").selectAll("line").on("click", linkClicked);
  d3.select("#svg02").selectAll("circle").on("click", nodeClicked);
}

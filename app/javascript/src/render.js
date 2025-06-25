import * as d3 from "d3";
import { routes, facilities } from "./simulation/params_setter";
import { invalidRoutesIds } from "./error_detector";
import {
  setFacilityDataToModal,
  setRouteDataToModal,
  setClickEventToObject,
  facilityDialog,
  routeDialog,
} from "./main";

export let link, node, simulation;

export async function displayOperator() {
  const operator = d3
    .select("#svg02")
    .append("g")
    .attr("id", "ob1")
    .attr("transform", "translate(20, 20)");
  operator.append("text").text("作業者");
  operator
    .append("rect")
    .attr("width", 10)
    .attr("height", 10)
    .attr("fill", "#fa0")
    .attr("opacity", 0);
}

export async function displayRaiseOperator() {
  d3.select("#ob1").raise();
}

export async function displayStartGoalName() {
  d3.select("#svg02").selectAll("circle").select("#start").text("スタート");
  d3.select("#svg02").selectAll("circle").select("#goal").text("ゴール");
}

export async function drawLink(linksData = routes, nodesData = facilities) {
  return new Promise((resolve) => {
    d3.select("#svg02").selectAll("line").remove();
    d3.select("#routes-layer").selectAll("g").remove();
    d3.select("#facilities-layer").selectAll("g").remove();
    d3.select("#operators-layer").selectAll("g").remove();
    function ticked() {
      link
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => adjustLinkEnd(d).x)
        .attr("y2", (d) => adjustLinkEnd(d).y);

      node.attr("transform", (d) => `translate(${d.x}, ${d.y})`);
    }

    function adjustLinkEnd(link) {
      const x1 = link.source.x;
      const x2 = link.target.x;
      const y1 = link.source.y;
      const y2 = link.target.y;
      const offsetLength = 30;
      const distance = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
      const ratio = (distance - offsetLength) / distance;
      const adjustedX = ratio * (x2 - x1) + x1;
      const adjustedY = ratio * (y2 - y1) + y1;
      return { x: adjustedX, y: adjustedY };
    }

    const simulationSvg = document.getElementById("svg02");
    if (simulationSvg) {
      link = d3
        .select("#routes-layer")
        .selectAll("line")
        .data(linksData)
        .enter()
        .append("line")
        .attr("stroke-width", (d) => (d.id.includes("re") ? 0 : 8))
        .attr("id", function (d) {
          return d.id;
        })
        .attr("marker-end", (d) => (d.id.includes("re") ? "" : "url(#arr)"));

      node = d3
        .select("#facilities-layer")
        .selectAll("g")
        .data(nodesData)
        .enter()
        .append("g")
        .attr("transform", (d) => `translate(${d.x}, ${d.y})`);

      node
        .append("circle")
        .attr("r", (d) => d.r)
        .attr("stroke", "black")
        .attr("id", (d) => d.id);

      node
        .append("rect")
        .attr("id", (d) => `material-${d.id}`)
        .attr("width", 10)
        .attr("height", 10)
        .attr("x", -20)
        .attr("fill", "#fa0")
        .attr("opacity", 0);

      node
        .append("text")
        .text((d) => d.name)
        .attr("text-anchor", "middle")
        .attr("y", 25);

      setNodeColor(nodesData, "#99aaee");
      setLinkColor(linksData, "#aaa");

      const invalidRoutes = linksData.filter((link) =>
        invalidRoutesIds.ids.includes(link.id)
      );
      setLinkColor(invalidRoutes, "#faa");
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
      node.call(
        d3
          .drag()
          .on("start", dragStarted)
          .on("drag", dragged)
          .on("end", dragEnded)
      );

      const selectMode = document.querySelector(
        'fieldset#modeSelection  input[type="radio"]:checked'
      );
      let selectModeName;

      if (selectMode !== null) {
        selectModeName = selectMode.id;
      }
      const modeState = {};

      switch (selectModeName) {
        case "add-facility":
          modeState.state = "add-facility";
          break;
        case "edit":
          modeState.state = "edit";
          break;
        case "add-link":
          modeState.state = "link";
          break;
        case "delete-object":
          modeState.state = "delete";
          break;
      }
      setClickEventToObject(modeState);
      simulation.force("link").links(linksData);

      setTimeout(() => {
        simulation.stop();
        resolve();
      }, 1000);
    } else {
      resolve();
    }
    displayStartGoalName();
    inactivePlayButtons();
  });
}

export async function setNodeColor(nodesData, color) {
  d3.selectAll("circle")
    .filter((d) => nodesData.includes(d))
    .attr("fill", color);
}

export function inactivePlayButtons() {
  const play = document.getElementById("play");
  const pause = document.getElementById("pause");
  const progress = document.getElementById("progress");
  if (play && pause && progress) {
    play.disabled = true;
    pause.disabled = true;
    progress.disabled = true;
  }
}

export function activePlayButtons() {
  const play = document.getElementById("play");
  const pause = document.getElementById("pause");
  const progress = document.getElementById("progress");
  if (play && pause && progress) {
    play.disabled = false;
    pause.disabled = false;
    progress.disabled = false;
  }
}

export async function setLinkColor(linksData, color) {
  d3.selectAll("line")
    .filter((d) => linksData.includes(d))
    .attr("stroke", color);
}

export function linkMouseOver(event) {
  d3.select(event.currentTarget).attr("stroke", "#D7E8FE");
}

export function linkMouseOut(event) {
  d3.select(event.currentTarget).attr("stroke", "#aaa");
}

export function nodeMouseOver(event) {
  d3.select(event.currentTarget).attr("fill", "#D7E8FE");
}

export function nodeMouseOut(event) {
  d3.select(event.currentTarget).attr("fill", "#99aaee");
}

export function nodeClicked() {
  const facilityForEdit = facilities.find(
    (facility) => facility.id === this.id
  );
  setFacilityDataToModal(facilityForEdit);
  facilityDialog.showModal();
}

export function linkClicked() {
  const routeForEdit = routes.find((route) => route.id === this.id);
  setRouteDataToModal(routeForEdit);
  routeDialog.showModal();
}

function dragStarted(event) {
  if (!event.active) simulation.alphaTarget(0.3).restart();
  event.subject.fx = event.subject.x;
  event.subject.fy = event.subject.y;
}

function dragged(event) {
  const svg = document.getElementById("svg02");
  const width = svg.clientWidth;
  const height = svg.clientHeight;
  event.subject.fx = Math.max(0, Math.min(width, event.x));
  event.subject.fy = Math.max(0, Math.min(height, event.y));
}

function dragEnded(event) {
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

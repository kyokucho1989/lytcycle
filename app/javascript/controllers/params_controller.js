import { Controller } from "@hotwired/stimulus";

import { facilities, routes } from "src/simulation/params_setter";

export default class extends Controller {
  static targets = [
    "facilityDialog",
    "hiddenFacilityId",
    "facilityName",
    "processingTime",
    "hiddenRouteId",
    "routeLength",
    "routeDialog",
  ];

  connect() {}

  showFacilityDialog(event) {
    const facilityForEdit = this.findClickedFacility(
      event.currentTarget,
      facilities
    );
    this.setFacilityDataToModal(facilityForEdit);
    this.facilityDialogTarget.showModal();
  }

  showRouteDialog(event) {
    const routeForEdit = this.findClickedRoute(event.currentTarget, routes);
    this.setRouteDataToModal(routeForEdit);
    this.routeDialogTarget.showModal();
  }

  setFacilityDataToModal(facility) {
    this.hiddenFacilityIdTarget.value = facility.id;
    this.facilityNameTarget.value = facility.name;
    this.processingTimeTarget.value = facility.processingTime;
  }

  setRouteDataToModal(route) {
    this.hiddenRouteIdTarget.value = route.id;
    this.routeLengthTarget.value = route.routeLength;
  }

  findClickedFacility(element, facilities) {
    return facilities.find((facility) => facility.id === element.id);
  }

  findClickedRoute(element, routes) {
    return routes.find((route) => route.id === element.id);
  }
}

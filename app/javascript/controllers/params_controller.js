import { Controller } from "@hotwired/stimulus";

import { facilities, routes } from "src/simulation/params_setter";
import { renderScene, setObjectParams } from "src/main";

export default class extends Controller {
  static targets = [
    "facilityDialog",
    "hiddenFacilityId",
    "facilityName",
    "processingTime",
    "hiddenRouteId",
    "routeLength",
    "routeDialog",
    "facilityForm",
    "routeForm",
  ];

  connect() {}

  showFacilityDialog(event) {
    const facilityForEdit = this.findClickedFacility(
      event.currentTarget,
      facilities
    );
    this.fillFacilityParamsToForm(facilityForEdit);
    this.facilityDialogTarget.showModal();
  }

  showRouteDialog(event) {
    const routeForEdit = this.findClickedRoute(event.currentTarget, routes);
    this.fillRouteParamsToForm(routeForEdit);
    this.routeDialogTarget.showModal();
  }

  fillFacilityParamsToForm(facility) {
    this.hiddenFacilityIdTarget.value = facility.id;
    this.facilityNameTarget.value = facility.name;
    this.processingTimeTarget.value = facility.processingTime;
  }

  fillRouteParamsToForm(route) {
    this.hiddenRouteIdTarget.value = route.id;
    this.routeLengthTarget.value = route.routeLength;
  }

  async setFacilityParams(e) {
    if (!this.facilityFormTarget.checkValidity()) {
      this.facilityFormTarget.reportValidity();
      return;
    }

    const params = {
      id: this.hiddenFacilityIdTarget.value,
      name: this.facilityNameTarget.value,
      processingTime: this.processingTimeTarget.value,
    };

    setObjectParams(e, params, facilities);
    await renderScene(routes, facilities);
    this.facilityDialogTarget.close();
  }

  async setRouteParams(e) {
    if (!this.routeFormTarget.checkValidity()) {
      this.routeFormTarget.reportValidity();
      return;
    }

    const params = {
      id: this.hiddenRouteIdTarget.value,
      routeLength: this.routeLengthTarget.value,
    };

    setObjectParams(e, params, routes);
    await renderScene(routes, facilities);
    this.routeDialogTarget.close();
  }

  cancelFacilityParams() {
    this.facilityDialogTarget.close();
  }

  cancelRouteParams() {
    this.routeDialogTarget.close();
  }

  findClickedFacility(element, facilities) {
    return facilities.find((facility) => facility.id === element.id);
  }

  findClickedRoute(element, routes) {
    return routes.find((route) => route.id === element.id);
  }
}

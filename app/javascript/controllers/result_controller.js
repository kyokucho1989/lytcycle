import { Controller } from "@hotwired/stimulus";

import { facilities, routes, operators } from "src/simulation/params_setter";
import { removeResultBadge } from "src/main";

export default class extends Controller {
  static targets = [
    "resultDialog",
    "hiddenRoutes",
    "hiddenFacilities",
    "hiddenOperators",
    "resultBadge",
  ];

  connect() {}

  async showResultDialog() {
    removeResultBadge();
    await this.fillHiddenFieldOnResult();
    this.resultDialogTarget.showModal();
  }

  closeResult() {
    this.resultDialogTarget.close();
  }
  close(event) {
    if (event.detail.success) {
      this.closeResult();
      const url = event.detail.fetchResponse.response.url;
      window.Turbo.visit(url);
    }
  }

  outputResult(result) {
    document.getElementById("simulation_cycle_time").value =
      result["cycleTime"];
    document.getElementById("simulation_bottleneck_process").value =
      result["bottleneckProcess"];
    document.getElementById("simulation_waiting_time").value =
      result["waitingTime"];
  }

  async fillHiddenFieldOnResult() {
    if (this.hasHiddenRoutesTarget) {
      this.hiddenRoutesTarget.value = JSON.stringify(routes);
    }
    if (this.hasHiddenFacilitiesTarget) {
      this.hiddenFacilitiesTarget.value = JSON.stringify(facilities);
    }
    if (this.hasHiddenOperatorsTarget) {
      this.hiddenOperatorsTarget.value = JSON.stringify(operators);
    }
  }
}

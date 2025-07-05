import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = [
    "toolsHelpDialog",
    "simulationHelpDialog",
    "operationHelpDialog",
  ];

  connect() {}

  openHelpDialog(e) {
    const target = e.currentTarget.dataset.helpTargetId;
    const dialog = this[`${target}DialogTarget`];
    dialog.showModal();
  }

  closeHelpDialog(e) {
    const target = e.currentTarget.dataset.targetId;
    const dialog = this[`${target}Target`];
    dialog.close();
  }
}

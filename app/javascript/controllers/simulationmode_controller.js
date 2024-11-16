import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = ["edit", "simulate", "editbutton", "simulatebutton"];

  initialize() {
    this.editTarget.hidden = true;
    this.simulateTarget.hidden = false;
    this.editbuttonTarget.hidden = false;
    this.simulatebuttonTarget.hidden = true;
  }

  edit() {
    this.editTarget.hidden = false;
    this.simulateTarget.hidden = true;
    this.editbuttonTarget.hidden = true;
    this.simulatebuttonTarget.hidden = false;
  }

  simulate() {
    this.editTarget.hidden = true;
    this.simulateTarget.hidden = false;
    this.editbuttonTarget.hidden = false;
    this.simulatebuttonTarget.hidden = true;
  }
}

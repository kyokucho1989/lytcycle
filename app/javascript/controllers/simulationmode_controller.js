import { Controller } from "@hotwired/stimulus";
import { changeInactiveObject } from "src/simulation";
import { changeActiveObject } from "src/simulation";

export default class extends Controller {
  static targets = ["edit", "simulate", "editbutton", "simulatebutton"];

  connect() {
    // this.readyForExecution = false;
    // this.editTarget.hidden = false;
    // this.simulateTarget.hidden = true;
    // this.editbuttonTarget.hidden = true;
    // this.simulatebuttonTarget.hidden = false;
  }

  edit() {
    // this.editTarget.hidden = false;
    // this.simulateTarget.hidden = true;
    // this.editbuttonTarget.hidden = true;
    // this.simulatebuttonTarget.hidden = false;
    changeActiveObject();
  }

  checkSimulate() {
    if (this.readyForExecution) {
      this.simulate();
    } else {
      alert("実行可能にチェックをしてください");
      const editRadio = document.getElementById("editMode");
      editRadio.checked = true;
    }
  }
  simulate() {
    // this.editTarget.hidden = true;
    // this.simulateTarget.hidden = false;
    // this.editbuttonTarget.hidden = false;
    // this.simulatebuttonTarget.hidden = true;
    changeInactiveObject();
  }

  toggleReadyForExecution(event) {
    this.readyForExecution = event.target.checked;
  }
}

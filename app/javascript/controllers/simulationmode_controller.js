import { Controller } from "@hotwired/stimulus";
import { changeInactiveObject } from "src/simulation";
import { changeActiveObject } from "src/simulation";

export default class extends Controller {
  static targets = ["edit", "simulate", "editbutton", "simulatebutton"];

  // 状態の定義
  MAIN_STATES = {
    EDIT: "edit",
    RUNNING: "running",
  };

  SUB_STATES = {
    SELECT: "select",
    ADD_MAN: "add-man",
    ADD_FACILITY: "add-facility",
    DELETE: "delete",
    LINK: "link",
  };

  connect() {
    this.mainState = this.MAIN_STATES.EDIT;
    this.subState = this.SUB_STATES.SELECT;
    // this.readyForExecution = false;
    this.editTarget.hidden = false;
    // this.simulateTarget.hidden = true;
    // this.editbuttonTarget.hidden = true;
    // this.simulatebuttonTarget.hidden = false;
  }

  edit() {
    this.mainState = this.MAIN_STATES.EDIT;
    this.subState = this.SUB_STATES.SELECT;
    console.log(this.mainState, this.subState);
    this.editTarget.hidden = false;
    this.simulateTarget.hidden = true;
    // this.editbuttonTarget.hidden = true;
    // this.simulatebuttonTarget.hidden = false;
    const editSubRadio = document.getElementById("select");
    editSubRadio.checked = true;
    changeActiveObject();
  }

  changeModeToAddMan() {
    this.mainState = this.MAIN_STATES.EDIT;
    this.subState = this.SUB_STATES.ADD_MAN;
  }

  changeModeToAddFacility() {
    this.mainState = this.MAIN_STATES.EDIT;
    this.subState = this.SUB_STATES.ADD_FACILITY;
  }

  changeModeToLink() {
    this.mainState = this.MAIN_STATES.EDIT;
    this.subState = this.SUB_STATES.LINK;
  }

  changeModeToDelete() {
    this.mainState = this.MAIN_STATES.EDIT;
    this.subState = this.SUB_STATES.DELETE;
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
    this.mainState = this.MAIN_STATES.RUNNING;
    console.log(this.mainState, this.subState);
    this.editTarget.hidden = true;
    this.simulateTarget.hidden = false;
    // this.editbuttonTarget.hidden = false;
    // this.simulatebuttonTarget.hidden = true;
    changeInactiveObject();
  }

  toggleReadyForExecution(event) {
    this.readyForExecution = event.target.checked;
  }
}

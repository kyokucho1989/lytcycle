import { Controller } from "@hotwired/stimulus";
// import { changeInactiveObject } from "src/simulation";
import { changeActiveObject } from "src/canvas";
import { setClickEventToObject } from "src/simulation";
import { routes, facilities } from "src/set_simulation_params";
import { findInvalidRouteIds } from "src/consistency_check";

export default class extends Controller {
  static targets = ["edit", "simulate", "editbutton", "simulatebutton"];

  // 状態の定義
  MAIN_STATES = {
    EDIT: "edit",
    RUNNING: "running",
  };

  SUB_STATES = {
    SELECT: "select",
    ADD_OPERATOR: "add-operator",
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
    setClickEventToObject(this);
  }

  changeModeToAddMan() {
    this.mainState = this.MAIN_STATES.EDIT;
    this.subState = this.SUB_STATES.ADD_OPERATOR;
    setClickEventToObject(this);
  }

  changeModeToAddFacility() {
    this.mainState = this.MAIN_STATES.EDIT;
    this.subState = this.SUB_STATES.ADD_FACILITY;
    setClickEventToObject(this);
  }

  changeModeToLink() {
    this.mainState = this.MAIN_STATES.EDIT;
    this.subState = this.SUB_STATES.LINK;
    setClickEventToObject(this);
  }

  changeModeToDelete() {
    this.mainState = this.MAIN_STATES.EDIT;
    this.subState = this.SUB_STATES.DELETE;
    setClickEventToObject(this);
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

  checkConsistency() {
    let result = findInvalidRouteIds(routes);
    console.log(`整合性チェックの結果: ${result}`);
  }

  simulate() {
    this.mainState = this.MAIN_STATES.RUNNING;
    console.log(this.mainState, this.subState);
    this.editTarget.hidden = true;
    this.simulateTarget.hidden = false;
    // this.editbuttonTarget.hidden = false;
    // this.simulatebuttonTarget.hidden = true;
    setClickEventToObject(this);
  }

  toggleReadyForExecution(event) {
    this.readyForExecution = event.target.checked;
  }
}

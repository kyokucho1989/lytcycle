import { Controller } from "@hotwired/stimulus";
// import { changeInactiveObject } from "src/simulation";
import { changeActiveObject, drawLink, activePlayButtons } from "src/canvas";
import { setClickEventToObject } from "src/simulation";
import { routes } from "src/set_simulation_params";
import { findInvalidRouteIds } from "src/consistency_check";
import { countStart } from "src/exec_simulation";

export default class extends Controller {
  static targets = ["edit", "simulate", "editbutton", "simulatebutton"];

  // 状態の定義
  MAIN_STATES = {
    EDIT: "edit",
    RUNNING: "running",
  };

  STATES = {
    SELECT: "select",
    ADD_OPERATOR: "add-operator",
    ADD_FACILITY: "add-facility",
    DELETE: "delete",
    LINK: "link",
  };

  connect() {
    this.mainState = this.MAIN_STATES.EDIT;
    this.state = this.STATES.SELECT;
    // this.readyForExecution = false;
    this.editTarget.hidden = false;
    this.simulateTarget.hidden = false;
    // this.editbuttonTarget.hidden = true;
    // this.simulatebuttonTarget.hidden = false;
  }

  edit() {
    this.mainState = this.MAIN_STATES.EDIT;
    this.state = this.STATES.SELECT;
    console.log(this.mainState, this.state);
    this.editTarget.hidden = false;
    this.simulateTarget.hidden = false;
    // this.editbuttonTarget.hidden = true;
    // this.simulatebuttonTarget.hidden = false;
    const editSubRadio = document.getElementById("select");
    editSubRadio.checked = true;
    changeActiveObject();
    setClickEventToObject(this);
  }

  changeModeToAddMan() {
    // this.mainState = this.MAIN_STATES.EDIT;
    this.state = this.STATES.ADD_OPERATOR;
    setClickEventToObject(this);
  }

  changeModeToAddFacility() {
    // this.mainState = this.MAIN_STATES.EDIT;
    this.state = this.STATES.ADD_FACILITY;
    setClickEventToObject(this);
  }

  changeModeToLink() {
    // this.mainState = this.MAIN_STATES.EDIT;
    this.state = this.STATES.LINK;
    setClickEventToObject(this);
  }

  changeModeToDelete() {
    // this.mainState = this.MAIN_STATES.EDIT;
    this.state = this.STATES.DELETE;
    setClickEventToObject(this);
  }

  async startSimulation() {
    let isConsistency = this.isConsistency();
    drawLink();
    if (!isConsistency) {
      alert("異常なルートがあります。削除してください。");
      return;
    }
    alert("整合性チェックOK");
    this.readyForExecution = true;
    await countStart();
    activePlayButtons();
    // const play = document.getElementById("play");
    // const pause = document.getElementById("pause");
    // const progress = document.getElementById("progress");
    // play.disabled = false;
    // pause.disabled = false;
    // progress.disabled = false;
  }

  checkSimulate() {
    this.simulate();
  }

  isConsistency() {
    let result = findInvalidRouteIds(routes);
    console.log(`整合性チェックの結果: ${result.ids}`);
    if (result.ids.length == 0) {
      this.readyForExecution = true;
      return true;
    } else {
      return false;
    }
  }

  simulate() {
    this.mainState = this.MAIN_STATES.RUNNING;
    console.log(this.mainState, this.state);
    this.editTarget.hidden = true;
    this.simulateTarget.hidden = false;
    // this.editbuttonTarget.hidden = false;
    // this.simulatebuttonTarget.hidden = true;
    setClickEventToObject(this);
  }
}

import { Controller } from "@hotwired/stimulus";
import { changeActiveObject, drawLink, activePlayButtons } from "src/canvas";
import { setClickEventToObject } from "src/simulation";
import { routes } from "src/set_simulation_params";
import { findInvalidRouteIds } from "src/consistency_check";
import { countStart } from "src/exec_simulation";

export default class extends Controller {
  static targets = ["detail", "editbutton", "simulatebutton"];

  STATES = {
    EDIT: "edit",
    ADD_OPERATOR: "add-operator",
    ADD_FACILITY: "add-facility",
    DELETE: "delete",
    LINK: "link",
  };

  connect() {
    //   this.state = this.STATES.EDIT;
    //   // console.log(`Stimuls:${this.state}`);
    //   // setClickEventToObject(this);
  }

  edit() {
    this.state = this.STATES.EDIT;
    console.log(this.state);
    changeActiveObject();
    setClickEventToObject(this);
  }

  showDetail() {
    this.detailTarget.showModal();
  }

  closeDetail() {
    this.detailTarget.close();
  }

  changeModeToAddMan() {
    this.state = this.STATES.ADD_OPERATOR;
    setClickEventToObject(this);
  }

  changeModeToAddFacility() {
    this.state = this.STATES.ADD_FACILITY;
    setClickEventToObject(this);
  }

  changeModeToLink() {
    this.state = this.STATES.LINK;
    setClickEventToObject(this);
  }

  changeModeToDelete() {
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
}

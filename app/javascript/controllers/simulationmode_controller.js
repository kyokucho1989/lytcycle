import { Controller } from "@hotwired/stimulus";
import { changeActiveObject, drawLink, activePlayButtons } from "src/canvas";
import { setClickEventToObject, removeResultBadge } from "src/simulation";
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

  connect() {}

  edit() {
    this.state = this.STATES.EDIT;
    changeActiveObject();
    setClickEventToObject(this);
  }

  showDetail() {
    removeResultBadge();
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
    if (result.ids.length == 0) {
      this.readyForExecution = true;
      return true;
    } else {
      return false;
    }
  }
}

import { Controller } from "@hotwired/stimulus";
import { changeActiveObject, drawLink, activePlayButtons } from "src/canvas";
import {
  setClickEventToObject,
  removeResultBadge,
  setObjectParamsOnDetailModal,
} from "src/simulation";
import { routes } from "src/set_simulation_params";
import { findInvalidRouteIds } from "src/consistency_check";
import { countStart } from "src/exec_simulation";

export default class extends Controller {
  static targets = ["detail", "editButton", "simulationButton"];

  STATES = {
    EDIT: "edit",
    ADD_OPERATOR: "add-operator",
    ADD_FACILITY: "add-facility",
    DELETE: "delete",
    LINK: "link",
  };

  connect() {}

  close(event) {
    if (event.detail.success) {
      this.closeDetail();
      const url = event.detail.fetchResponse.response.url;
      const redirectUrl = url.replace(/\/\d+$/, "");
      window.Turbo.visit(redirectUrl);
    }
  }

  edit() {
    this.state = this.STATES.EDIT;
    changeActiveObject();
    setClickEventToObject(this);
  }

  showDetail() {
    removeResultBadge();
    setObjectParamsOnDetailModal();
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
    const isConsistency = this.isConsistency();
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
    const result = findInvalidRouteIds(routes);
    if (result.ids.length === 0) {
      this.readyForExecution = true;
      return true;
    } else {
      return false;
    }
  }
}

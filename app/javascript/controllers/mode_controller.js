import { Controller } from "@hotwired/stimulus";

import { setClickEventToObject, setupEventListeners } from "src/main";

export default class extends Controller {
  static targets = ["detail", "editButton", "simulationButton"];

  STATES = {
    EDIT: "edit",
    ADD_OPERATOR: "add-operator",
    ADD_FACILITY: "add-facility",
    DELETE: "delete",
    LINK: "link",
  };

  connect() {
    setupEventListeners();
  }

  edit() {
    this.state = this.STATES.EDIT;
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
}

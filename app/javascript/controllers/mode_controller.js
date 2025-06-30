import { Controller } from "@hotwired/stimulus";

import {
  setClickEventToObject,
  removeResultBadge,
  setObjectParamsOnDetailModal,
  setupEventListeners,
} from "src/main";

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

  close(event) {
    if (event.detail.success) {
      this.closeDetail();
      const url = event.detail.fetchResponse.response.url;
      window.Turbo.visit(url);
    }
  }

  edit() {
    this.state = this.STATES.EDIT;
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
}

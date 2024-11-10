// query utilities:
import { fireEvent, screen, waitFor } from "@testing-library/dom";
// adds special assertions like toHaveTextContent
import "@testing-library/jest-dom";

import { setObjectparams } from "../src/simulation.js";
import { setFacilityDataToModal } from "../src/simulation.js";
let facilities;
let facilitiesInitial;

beforeEach(() => {
  facilitiesInitial = [
    {
      index: 0,
      x: 230,
      y: 310,
      r: 10,
      id: "n0",
      processingTime: 1,
      type: "start",
      name: "startPoint",
    },
    {
      index: 1,
      x: 330,
      y: 60,
      r: 15,
      id: "n1",
      processingTime: 15,
      type: "machine",
      name: "machine-no-1",
      isProcessing: false,
      hasMaterial: false,
      storageSize: 0,
      processingEndTime: 0,
    },
    {
      index: 2,
      x: 430,
      y: 310,
      r: 10,
      id: "n2",
      processingTime: 1,
      type: "goal",
      name: "goalPoint",
    },
  ];

  facilities = facilitiesInitial;
});

test("button click and set params", async () => {
  const div = document.createElement("div");
  div.innerHTML = `
    <dialog id="facilityDialog">
      <div id="hidden-id" hidden></div>
      <div>
        <label for="name">設備名</label>
        <input type="text" id="name" name="name" maxlength="16" size="15" />
      </div>
      <div>
        <label for="processingTime">加工時間</label>
        <span id="counter">0</span>
        <input type="number" id="processingTime" name="name" min="0" max="400" />
      </div>
      <div>
        <button id="confirmBtn" value="default">保存</button>
      </div>
    </dialog>
  `;
  document.body.appendChild(div); // これを追加して、Jest の仮想 DOM に反映
  setFacilityDataToModal(facilities[0]);

  const nameInput = screen.getByLabelText("設備名");
  const processingTimeInput = screen.getByLabelText("加工時間");

  fireEvent.change(nameInput, { target: { value: "Test Facility" } });
  fireEvent.change(processingTimeInput, { target: { value: 30 } });

  const button = screen.getByText("保存");
  button.addEventListener("click", (e) => {
    let params = {};
    params.id = document.getElementById("hidden-id").value;
    params.name = document.getElementById("name").value;
    params.processingTime = document.getElementById("processingTime").value;

    setObjectparams(e, params, facilities);
  });
  await fireEvent.click(button);

  await waitFor(() => expect(screen.queryByText("設備名")).not.toBeVisible());
  let selectedFacility = facilities.find((facility) => facility.id == "n0");
  expect(selectedFacility.processingTime).toBe("30");
  expect(selectedFacility.name).toBe("Test Facility");
});

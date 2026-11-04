import { validateOpponentName } from "./validation.js";

import { addNewMatch, getMatches } from "./matchs.js";

const matchPlace = Object.freeze({
  residence: 0,
  outside: 1,
});

let hasError = false;

const Status = Object.freeze({
  addNewMode: 0,
  editMode: 1,
});

let currentStatus = Status.addNewMode;

const btnOpenModal = document.querySelector(".addNewMatch");

btnOpenModal.addEventListener("click", () => {
  const modal = document.querySelector(".cardParent");
  modal.classList.remove("hidden");
  modal.classList.add("flex");
});

//close the modal window
const closeBtns = document.querySelectorAll(".close, .cancel");
closeBtns.forEach((closeBtn) => {
  closeBtn.addEventListener("click", handleModalClose);
});

const matchesParentDiv = document.querySelector("");
//submit form handler
const btnAddNewMatch = document
  .querySelector("#form")
  .addEventListener("submit", (e) => {
    e.preventDefault();
    save();
  });

function handleModalClose() {
  const modal = document.querySelector(".cardParent");
  modal.classList.remove("flex");
  modal.classList.add("hidden");

  document.querySelector("#opponentName").value = "";
  document.querySelector("#date").value = "";
  document.querySelector("#time").value = "";
  document.querySelector("#place").value = "";
}

function createMatchTemplate(player) {
  return `<div data-id=${player.id} class="player p-[20px] ${
    player.captain ? "border-fuchsia-600" : "border-black"
  } border-[3px] w-fit bg-slate-600"
        >
          <div
            class="information flex flex-wrap gap-[5px] justify-between items-center"
          >
            <p
              class="number p-[5px] rounded-[50%] border-white border-[1px] text-white"
            >
              ${player.playerNumber}
            </p>
            <p class="name text-white font-medium">${player.name}</p>
            <p class="position font-medium text-white">${
              benches[player.banch.id].name
            }</p>
            <p class="age w-full text-gray-400">${player.age} ans</p>
          </div>

          <div 
            class="actionButtons flex justify-between items-center mt-[10px]"
          >
            <p class="health p-[5px] ${
              player.status === playerStatus.Healthy.value
                ? "bg-green-700 text-white"
                : "bg-red-800 text-white"
            }">${
    playerStatus[player.status[0].toUpperCase() + player.status.slice(1)].label
  }</p>
            <div
              class="actions flex justify-end items-center gap-[14px] text-white"
            >
              <button class="captain text-[25px] ${
                player.captain ? "text-fuchsia-600" : ""
              }">c</button>
              <button class="edit">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="lucide lucide-square-pen preview-icon"
                >
                  <path
                    d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
                  />
                  <path
                    d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"
                  />
                </svg>
              </button>
              <button class="delete">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="lucide lucide-trash preview-icon"
                >
                  <path d="M10 11v6" />
                  <path d="M14 11v6" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                  <path d="M3 6h18" />
                  <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
              </button>
            </div>
          </div>
        </div>`;
}

function loadMatches() {
  matchesParentDiv.innerHTML = "";
  const currentActive = list.querySelector("li.active");
  const filterBy = currentActive.dataset.position;

  let players = getPlayers(search.value, filterBy);

  if (players.length <= 0) return;

  players.forEach((player) => {
    const htmlString = createPlayerTemplate(player);

    const template = document.createElement("template");
    template.innerHTML = htmlString.trim();

    playersParentDiv.append(template.content);
  });
}

function save() {
  //player name
  const opponentName = document.querySelector("#opponentName").value;

  //player poste
  const selectedMacthPlace = document.querySelector(
    'input[name="matchPlace"]:checked'
  );
  const selectedMatchPlaceVal = selectedMacthPlace.value;

  //selected date
  const date = document.querySelector("#date").value;

  //selected time
  const time = document.querySelector("#time").value;

  const matchPlace = document.querySelector("#place").value;

  const errLabel = document.querySelector(".generalError");

  if (currentStatus === Status.addNewMode) {
    //check if the opponent name has the same name atlas fc
    const validateName = validateOpponentName(opponentName);
    if (!validateName) {
      errLabel.textContent =
        "the opponent name must be different than atlas fc";
      errLabel.classList.remove("hidden");
      return;
    }

    let match = {
      id: crypto.randomUUID(),
      opponentName: opponentName,
      date: date,
      time: time,
      place: matchPlace,
      residence: selectedMatchPlaceVal === "domicile" ? true : false,
      butsAtlas: null, // null tant que le score n'est pas saisi
      butsAdversaire: null, // null tant que le score n'est pas saisi
      composition: [],
    };

    addNewMatch(match);

    // showPlayerOnField(arr[arr.length - 1]);
    // savePlayers();

    // displayPlayers();
    // handleModalClose();
  }
  //  else {
  //   const playerId = addEditPlayerCard.dataset.id;

  //   const player = getPlayerById(playerId);

  //   //player has the same position so we dont need to check for available slots ...
  //   if (selectedPostVal === player.position) {
  //     arr.forEach((player, index) => {
  //       if (player.id == playerId) {
  //         arr[index].name = playerName;

  //         arr[index].playerNumber = playerNumber;

  //         return;
  //       }
  //     });
  //     clearPlayerFromOldSlot(player);
  //     showPlayerOnField(player);
  //   } else {
  //     //find if a slot in selected position is free
  //     const availableSlot = slots.find(
  //       (slotId) => !arr.some((p) => p.banch?.id === slotId)
  //     );

  //     if (!availableSlot || availableSlot === 0) {
  //       //there is no available slots
  //       slotError.classList.remove("hidden");
  //       return;
  //     }

  //     clearPlayerFromOldSlot(player);

  //     // look for the player and update the player info
  //     arr.forEach((player, index) => {
  //       if (player.id == playerId) {
  //         arr[index].name = playerName;
  //         arr[index].position = selectedPostVal;

  //         arr[index].playerNumber = playerNumber;
  //         arr[index].banch = {
  //           id: availableSlot,
  //           name: `position ${availableSlot}`,
  //         };
  //         return;
  //       }
  //     });
  //     showPlayerOnField(player);
  //   }

  //   savePlayers();
  //   displayPlayers();
  //   handleModalClose();
  // }
}

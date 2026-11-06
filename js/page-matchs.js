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
const btnModifyScoreModal = document.querySelector(".modifyScore");

btnOpenModal.addEventListener("click", () => {
  const modal = document.querySelector(".cardParent");
  modal.classList.remove("hidden");
  modal.classList.add("flex");
});

//delete edit match card buttons
const matchesList = document.querySelector("#matchesList");

matchesList.addEventListener("click", (e) => {
  const editBtn = e.target.closest(".edit");
  const deleteBtn = e.target.closest(".delete");

  if (editBtn) {
    if (editBtn.closest(".match")) {
      const matchDiv = e.target.closest(".match");
      const matchId = matchDiv.dataset.id;
      console.log(matchId);
    }
  }
});
//close the modal window
const closeBtns = document.querySelectorAll(".close, .cancel");
closeBtns.forEach((closeBtn) => {
  closeBtn.addEventListener("click", handleModalClose);
});

const list = document.querySelector("#matchesUL");
const search = document.querySelector(".matchesSearchInput");
const matchesParentDiv = document.querySelector("#matchesList");

list.addEventListener("click", (e) => {
  const listItem = e.target.closest("li");

  if (listItem && list.contains(listItem)) {
    const currentActive = list.querySelector("li.active");
    if (currentActive) {
      currentActive.classList.remove("active");
    }
    listItem.classList.add("active");
  }

  loadMatches();
});

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

function createMatchTemplate(match) {
  const winned = match.butsAtlas > match.butsAdversaire;
  return `<div data-id=${match.id} 
          class="match p-[20px] flex border-black border-[1px] w-fit bg-slate-600 w-full"
        >
          <div
            class="col1 bg-slate-900 w-[90px] rounded-[10px] text-white text-center mr-[20px] p-[10px]"
          >
            <p class="weekDay text-gray-400 font-semibold">${new Date(
              match.date
            ).toLocaleString("default", { weekday: "short" })}</p>

            <p class="day font-bold text-[30px]">${new Date(
              match.date
            ).getDay()}</p>
            <p class="month text-gray-200">${new Date(
              match.date
            ).toLocaleString("default", { month: "short" })}</p>

            <p class="time text-gray-500">${match.time}</p>

          </div>
          <div class="col2 flex flex-col align-center justify-around">
            <p
              class="place 
              ${
                match.residence
                  ? "bg-green-300 text-green-700"
                  : "bg-red-300 text-red-700"
              }  p-[5px] rounded-[10px] font-bold"
            >
              ${match.residence ? "Domicile" : "Extérieur"}
            </p>
            <p class="vs font-bold text-white uppercase">ATLAC FC VS ${
              match.opponentName
            }</p>
            <p
              class="location before:content-['📍'] text-gray-300 font-bold text-[20px] uppercase"
            >
              ${match.place}
            </p>
          </div>
          <div class="col3 flex-end radius-[10px]"></div>
          <div
            class="actionButtons flex justify-between items-center mt-[10px] ml-auto"
          >
            <div
              class="actions flex justify-end items-center gap-[14px] text-white"
            >
              <div class="results-b hidden">
                <button
                  class="bg-blue-700 p-[9px] rounded-[10px] font-semibold"
                >
                  Saisir le score
                </button>
                <button class="bg-slate-700 p-[7px] rounded-[10px] mt-[10px]">
                  Voir la composition
                </button>
              </div>
              <div class="results-a">
                <div class="matchResult text-[30px] font-bold">${
                  match.butsAtlas
                }-${match.butsAdversaire}</div>

                <div
                  class="victoire text-green-700 bg-green-300 p-[5px] rounded-[10px] font-bold"
                >
                  ${
                    match.butsAtlas > match.butsAdversaire
                      ? "victoire"
                      : match.butsAtlas < match.butsAdversaire
                      ? "Défaite"
                      : match.butsAtlas === match.butsAdversaire
                      ? "null"
                      : ""
                  }
                </div>
                <button class="modifyScore text-gray-300 mt-[10px]">
                  Modifier le score
                </button>
              </div>
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
  const filterBy = currentActive.dataset.time;

  let matches = getMatches(search.value, filterBy);

  if (matches.length <= 0) return;
  matches.forEach((match) => {
    const htmlString = createMatchTemplate(match);
    const template = document.createElement("template");
    template.innerHTML = htmlString.trim();
    matchesParentDiv.append(template.content);
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

loadMatches();

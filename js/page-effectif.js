import {
  getPlayers,
  isSlotFree,
  playerStatus,
  addNewPlayer,
  savePlayers,
  benches,
  getPlayerById,
  updatePlayer,
  deletePlayer,
  makePlayerCaptain,
  numberTakenByAnotherPlayer,
} from "./players.js";

import {
  nameValidation,
  numberValidation,
  playerAgeValidation,
} from "./validation.js";

const list = document.querySelector("#playersUl");
const playersParentDiv = document.querySelector("#playersList");
const btnOpenPlayerModal = document.querySelector(".addNewPlayer");
const modal = document.querySelector(".cardParent");
const slotError = document.querySelector(".slotNotEmptyError");
const nameError = document.querySelector(".nameErrLabel");
const numberError = document.querySelector(".numberErrLabel");
const ageError = document.querySelector(".ageErrLabel");
const addEditPlayerCard = document.querySelector(".addEditPlayerCard");
const search = document.querySelector(".playersSearchInput");
const playerName = document.querySelector("#playerName");
const playerNumber = document.querySelector("#playerNumber");
const playerAge = document.querySelector("#playerAge");

let hasError = false;

const Status = Object.freeze({
  addNewMode: 0,
  editMode: 1,
});

let currentStatus = Status.addNewMode;

list.addEventListener("click", (e) => {
  const listItem = e.target.closest("li");

  if (listItem && list.contains(listItem)) {
    const currentActive = list.querySelector("li.active");
    if (currentActive) {
      currentActive.classList.remove("active");
    }
    listItem.classList.add("active");
  }

  loadPlayers();
});

//open the modal window
btnOpenPlayerModal.addEventListener("click", () => {
  const modal = document.querySelector(".cardParent");
  currentStatus = Status.addNewMode;
  modal.classList.remove("hidden");
  modal.classList.add("flex");
  loadModalInfo();
});

//close the modal window
const closeBtns = document.querySelectorAll(".close, .cancel");
closeBtns.forEach((closeBtn) => {
  closeBtn.addEventListener("click", handleModalClose);
});

//submit form handler
const btnAddNewPlayer = document
  .querySelector("#form")
  .addEventListener("submit", (e) => {
    e.preventDefault();
    save();
  });

//add edit and delete delegation to parent player div
const playerParent = document.querySelector("#playersList");

playerParent.addEventListener("click", (e) => {
  //check if the clicked element is the edit button
  const editButton = e.target.closest(".edit");
  const deleteButton = e.target.closest(".delete");
  const captainButton = e.target.closest(".captain");

  if (editButton) {
    if (editButton.closest(".player")) {
      const playerDiv = editButton.closest(".player");
      const playerId = playerDiv.dataset.id;

      editPlayer(playerId);
    }
  } else if (deleteButton) {
    const playerDiv = deleteButton.closest(".player");
    const playerId = playerDiv.dataset.id;

    deletePlayer(playerId);
    loadPlayers();
  } else if (captainButton) {
    const playerDiv = captainButton.closest(".player");
    const playerId = playerDiv.dataset.id;

    makePlayerCaptain(playerId);
    loadPlayers();
  }

  // if (e.target.classList.contains("edit")) {
  //   //find the closest parent palyer div
  //   const playerDiv = e.target.closest(".player");

  //   //extract the id from data set
  //   const playerId = playerDiv.dataset.id;

  //   editPlayer(playerId);
  // } else if (e.target.classList.contains("delete")) {
  //   //find the closest parent palyer div
  //   const playerDiv = e.target.closest(".player");

  //   //extract the id from data set
  //   const playerId = playerDiv.dataset.id;
  //   deletePlayer(playerId);
  // }
});

search.addEventListener("input", (e) => {
  loadPlayers();
});

playerName.addEventListener("input", () => {
  if (!nameValidation(playerName.value)) {
    hasError = true;
    nameError.classList.remove("hidden");
    nameError.classList.add("block");
    document.querySelector(".add").disabled = true;
  } else {
    hasError = false;
    nameError.classList.remove("block");
    nameError.classList.add("hidden");
    document.querySelector(".add").disabled = false;
  }
});

playerNumber.addEventListener("input", () => {
  if (
    !numberValidation(playerNumber.value) ||
    numberTakenByAnotherPlayer(playerNumber.value)
  ) {
    hasError = true;
    numberError.classList.remove("hidden");
    numberError.classList.add("block");
    document.querySelector(".add").disabled = true;
  } else {
    hasError = false;
    numberError.classList.remove("block");
    numberError.classList.add("hidden");
    document.querySelector(".add").disabled = false;
  }
});

playerAge.addEventListener("input", () => {
  console.log("hello");
  if (!playerAgeValidation(playerAge.value)) {
    hasError = true;
    ageError.classList.remove("hidden");
    ageError.classList.add("block");
    document.querySelector(".add").disabled = true;
  } else {
    hasError = false;
    ageError.classList.remove("block");
    ageError.classList.add("hidden");
    document.querySelector(".add").disabled = false;
  }
});

function loadModalInfo() {
  const selectPlayerStatus = document.querySelector(".selectPlayerStatus");
  selectPlayerStatus.innerHTML = "";
  Object.values(playerStatus).forEach((status) => {
    const option = document.createElement("option");

    option.value = status.value;
    option.textContent = status.label;
    selectPlayerStatus.append(option);
  });

  // selectPlayerStatus.value = "healthy";
}

function createPlayerTemplate(player) {
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

function loadPlayers() {
  playersParentDiv.innerHTML = "";
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

//for handling modal close
function handleModalClose() {
  const modal = document.querySelector(".cardParent");
  modal.classList.remove("flex");
  modal.classList.add("hidden");

  document.querySelector("#playerName").value = "";
  document.querySelector("#playerNumber").value = "";
}

function save() {
  //player name
  const playerName = document.querySelector("#playerName").value;

  const playerHealthSelect = document.querySelector("#selectPlayerStatus");
  //player poste
  const selectedPost = document.querySelector('input[name="postes"]:checked');

  //selected player number
  const playerNumber = Number(document.querySelector("#playerNumber").value);

  const playerAge = Number(document.querySelector("#playerAge").value);

  const selectplayerStatus = document.querySelector("#selectPlayerStatus");

  const availableSlot = isSlotFree(selectedPost.value);

  if (currentStatus === Status.addNewMode) {
    if (!availableSlot) {
      slotError.textContent = "All slots in that position are not empty";
      slotError.classList.remove("hidden");
      return;
    }

    let player = {
      id: crypto.randomUUID(),
      name: playerName,
      position: selectedPost.value,
      playerNumber: playerNumber,
      age: playerAge,
      captain: false,
      status: playerHealthSelect.value,
      banch: {
        id: availableSlot,
        name: `position ${availableSlot}`,
      },
    };

    addNewPlayer(player);
    // savePlayers();

    loadPlayers();
    handleModalClose();
  } else {
    let p;

    const playerId = addEditPlayerCard.dataset.id;

    const player = getPlayerById(playerId);

    // if (!availableSlot) {
    //   //find if a slot in selected position is free
    //   //there is no available slots

    //   slotError.classList.remove("hidden");
    //   return;
    // }

    p = {
      id: player.id,
      age: playerAge,
      captain: player.captain,
      name: playerName,
      playerNumber: playerNumber,
      position: selectedPost.value,
      status: selectplayerStatus.value,
      banch: {
        id: availableSlot,
        name: `position ${availableSlot}`,
      },
    };
    console.log(p);
    updatePlayer(p);
    handleModalClose();
    loadPlayers();
  }
}

function editPlayer(id) {
  loadModalInfo();

  currentStatus = Status.editMode;

  //show the modal
  modal.classList.remove("hidden");
  modal.classList.add("flex");

  const modalTitle = document.querySelector(".title");
  modalTitle.textContent = "Modifier le joueur";

  //assign the id to the addedit player card
  document.querySelector(".addEditPlayerCard").setAttribute("data-id", id);
  const editButton = modal.querySelector(".add");

  editButton.textContent = "editer";
  const player = getPlayerById(id);

  const playerName = modal.querySelector("#playerName");
  playerName.value = player.name;

  const playerNumber = modal.querySelector("#playerNumber");
  playerNumber.value = player.playerNumber;

  const selectedPost = document.querySelector(`#${player.position}`);
  selectedPost.checked = true;

  const age = document.querySelector("#playerAge");
  age.value = player.age;

  let selectPlayerStatus = document.querySelector("#selectPlayerStatus");
  selectPlayerStatus.value = player.status;
}

loadPlayers();

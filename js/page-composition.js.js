const benches = [
  { id: 0, name: "sur le banc" },
  { id: 1, name: "GB - Gardien" },
  { id: 2, name: "DG - Défenseur gauche" },
  { id: 3, name: "DC - Défenseur central 1" },
  { id: 4, name: "DC - Défenseur central 2" },
  { id: 5, name: "DD - Défenseur droit" },
  { id: 6, name: "MG - Milieu gauche" },
  { id: 7, name: "MC - Milieu central 1" },
  { id: 8, name: "MC - Milieu central 2" },
  { id: 9, name: "MD - Milieu droit" },
  { id: 10, name: "BU - Buteur 1" },
  { id: 11, name: "BU - Buteur 2" },
];

const positions = {
  gardien: [1],
  defender: [2, 3, 4, 5],
  medium: [6, 7, 8, 9],
  attacker: [10, 11],
};

let arr = [];

//load the saved players when the page opens
const savedPlayers = localStorage.getItem("tachkilaPlayers");
if (savedPlayers) {
  arr = JSON.parse(savedPlayers);

  displayPlayers();
}

//save the players in the browser
function savePlayers() {
  localStorage.setItem("tachkilaPlayers", JSON.stringify(arr));
}

let hasError = false;

const Status = Object.freeze({
  addNewMode: 0,
  editMode: 1,
});

let currentStatus = Status.addNewMode;
const addEditPlayerCard = document.querySelector(".addEditPlayerCard");

const selectPosition = document.querySelector(".player-select");

const slotError = document.querySelector(".slotNotEmptyError");

let generalNotification = document.querySelector(".general-notification");

//addNewPlayerToTheList
// function AddNewPalyer() {
//   console.log("executed");
//   currentStatus = Status.addNewMode;
//   //player name
//   const playerName = document.querySelector("#playerName").value;

//   //player poste
//   const selectedPost = document.querySelector('input[name="postes"]:checked');
//   const selectedPostVal = selectedPost.value;

//   //selected player number
//   const playerNumber = Number(document.querySelector("#playerNumber").value);
//   console.log(selectedPostVal);
//   const slots = positions[selectedPostVal];

//   console.log(slots);

//   arr.push({
//     id: crypto.randomUUID(),
//     name: playerName,
//     position: selectedPostVal,
//     playerNumber: playerNumber,
//   });

//   ClearModal();
//   displayPlayers();
// }

//edit Player

function editPlayer(id) {
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
}

function save() {
  //player name
  const playerName = document.querySelector("#playerName").value;

  //player poste
  const selectedPost = document.querySelector('input[name="postes"]:checked');
  const selectedPostVal = selectedPost.value;

  //selected player number
  const playerNumber = Number(document.querySelector("#playerNumber").value);

  const slots = positions[selectedPostVal];

  if (currentStatus === Status.addNewMode) {
    //find if a slot in selected position is free
    const availableSlot = slots.find(
      (slotId) => !arr.some((p) => p.banch?.id === slotId)
    );

    if (!availableSlot || availableSlot === 0) {
      //there is no available slots
      slotError.classList.remove("hidden");
      return;
    }

    arr.push({
      id: crypto.randomUUID(),
      name: playerName,
      position: selectedPostVal,
      playerNumber: playerNumber,
      banch: {
        id: availableSlot,
        name: `position ${availableSlot}`,
      },
    });

    showPlayerOnField(arr[arr.length - 1]);
    savePlayers();

    displayPlayers();
    handleModalClose();
  } else {
    const playerId = addEditPlayerCard.dataset.id;

    const player = getPlayerById(playerId);

    //player has the same position so we dont need to check for available slots ...
    if (selectedPostVal === player.position) {
      arr.forEach((player, index) => {
        if (player.id == playerId) {
          arr[index].name = playerName;

          arr[index].playerNumber = playerNumber;

          return;
        }
      });
      clearPlayerFromOldSlot(player);
      showPlayerOnField(player);
    } else {
      //find if a slot in selected position is free
      const availableSlot = slots.find(
        (slotId) => !arr.some((p) => p.banch?.id === slotId)
      );

      if (!availableSlot || availableSlot === 0) {
        //there is no available slots
        slotError.classList.remove("hidden");
        return;
      }

      clearPlayerFromOldSlot(player);

      // look for the player and update the player info
      arr.forEach((player, index) => {
        if (player.id == playerId) {
          arr[index].name = playerName;
          arr[index].position = selectedPostVal;

          arr[index].playerNumber = playerNumber;
          arr[index].banch = {
            id: availableSlot,
            name: `position ${availableSlot}`,
          };
          return;
        }
      });
      showPlayerOnField(player);
    }

    savePlayers();
    displayPlayers();
    handleModalClose();
  }
}

//check if player number already isPlayerNumberNotTaken
function isPlayerNumberNotTaken(val) {
  if (arr.length == 0) return true;

  for (const player of arr) {
    if (player.playerNumber === val) return false;
  }
  return true;
}

//for handling modal close
function handleModalClose() {
  const modal = document.querySelector(".cardParent");
  modal.classList.remove("flex");
  modal.classList.add("hidden");

  document.querySelector("#playerName").value = "";
  document.querySelector("#playerNumber").value = "";
}

function clearPlayersList() {
  const parent = document.querySelector(".players-list");
  parent.innerHTML = "";
}

function showPlayerOnField(player) {
  const slotId = player.banch.id;
  if (slotId === 0) return;

  const gridSlot = document.getElementsByClassName(String(slotId))[0];
  if (!gridSlot) return;

  const playerInfoDiv = document.createElement("div");
  playerInfoDiv.classList.add("flex", "justify-around", "gap-[15px]");

  const number = document.createElement("span");
  number.textContent = player.playerNumber;

  const pName = document.createElement("span");
  pName.textContent = player.name;

  playerInfoDiv.append(number, pName);
  gridSlot.append(playerInfoDiv);
}

//for displaying the players list on the ui
function displayPlayers() {
  //first we need to clear the players
  clearPlayersList();

  document.querySelector(
    ".number-Of-players"
  ).textContent = `${arr.length} joueur(s)`;

  if (arr.length === 0) return;
  for (const player of arr) {
    // parent
    let playersParent = document.querySelector(".players-list");

    // player div
    let p = document.createElement("div");
    //set player attribute id
    p.setAttribute("data-id", player.id);

    p.classList.add(
      "player",
      "flex",
      "justify-between",
      "border-2",
      "flex-wrap"
    );

    //player number div
    let playerNumber = document.createElement("div");
    playerNumber.textContent = `${player.playerNumber}`;
    playerNumber.classList.add(
      "player-number",
      "p-1",
      "border-2",
      "rounded-[50%]",
      "text-orange-600"
    );

    //player name div
    let playerName = document.createElement("div");
    playerName.textContent = `${player.name}`;
    playerName.classList.add("player-name");

    //player position
    let playerPosition = document.createElement("div");
    playerPosition.textContent = `${player.position}`;
    playerPosition.classList.add("player-position", "text-orange-600");

    //actions div
    let actionsDiv = document.createElement("div");
    actionsDiv.classList.add("actions", "flex", "items-center");

    //edit button
    let editAction = document.createElement("button");
    editAction.classList.add("edit");
    editAction.textContent = "edit";

    //delete button
    let deleteAction = document.createElement("button");
    deleteAction.classList.add("delete");
    deleteAction.textContent = "delete";

    //benches div
    let benchesDiv = document.createElement("div");
    benchesDiv.classList.add("benches", "mt-2");

    //benches select
    let benchesSelect = document.createElement("select");
    benchesSelect.classList.add(
      "w-full",
      "border",
      "rounded",
      "p-2",
      "player-selection"
    );

    for (const bench of benches) {
      let option = document.createElement("option");

      option.textContent = bench.name;
      option.setAttribute("value", bench.id);
      benchesSelect.append(option);
    }
    benchesSelect.value = player.banch.id;
    //append edit and cancel buttons to actions div
    actionsDiv.append(editAction, deleteAction);

    p.append(
      playerNumber,
      playerName,
      playerPosition,
      actionsDiv,
      benchesSelect
    );

    playersParent.append(p);
  }
}

function getPlayerById(id) {
  const p = arr.find((p) => p.id === id);
  return p;
}

const modal = document.querySelector(".cardParent");

//open the modal window
const btnOpenModal = document.querySelector("#btnOpenModal");
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

//name input handler
const nameInput = document.querySelector("#playerName");
nameInput.addEventListener("input", () => {
  const nameErrLabel = document.querySelector(".nameErrLabel");
  const regex = /^[A-Za-z]+$/;
  const value = nameInput.value;
  if (value == "") return;
  if (regex.test(value)) {
    hasError = false;
    nameErrLabel.classList.remove("block");
    nameErrLabel.classList.add("hidden");
    document.querySelector(".add").disabled = false;
  } else {
    hasError = true;
    document.querySelector(".add").disabled = true;

    nameErrLabel.classList.remove("hidden");
    nameErrLabel.classList.add("block");
  }
});

// player number input handler
const playerNumberInput = document.querySelector("#playerNumber");
playerNumberInput.addEventListener("input", () => {
  const playerErrLabel = document.querySelector(".playerErrLabel");
  const regex = /^(?:[1-9]|[1-9][0-9])$/;
  const value = Number(playerNumberInput.value);
  if (value == "") return;
  if (regex.test(value) && isPlayerNumberNotTaken(value)) {
    document.querySelector(".add").disabled = false;
    hasError = false;
    playerErrLabel.classList.remove("block");
    playerErrLabel.classList.add("hidden");
  } else {
    document.querySelector(".add").disabled = true;

    hasError = true;
    playerErrLabel.classList.remove("hidden");
    playerErrLabel.classList.add("block");
  }
});

//submit form handler
const btnAddNewPlayer = document
  .querySelector("#form")
  .addEventListener("submit", (e) => {
    e.preventDefault();
    save();
  });

//add edit and delete delegation to parent player div
const playerParent = document.querySelector(".players-list");

playerParent.addEventListener("click", (e) => {
  //check if the clicked element is the edit button

  if (e.target.classList.contains("edit")) {
    //find the closest parent palyer div
    const playerDiv = e.target.closest(".player");

    //extract the id from data set
    const playerId = playerDiv.dataset.id;

    editPlayer(playerId);
  } else if (e.target.classList.contains("delete")) {
    //find the closest parent palyer div
    const playerDiv = e.target.closest(".player");

    //extract the id from data set
    const playerId = playerDiv.dataset.id;
    deletePlayer(playerId);
  }
});

playerParent.addEventListener("change", (e) => {
  const playerDiv = e.target.closest(".player");

  const playerId = playerDiv.dataset.id;

  //get player string position
  const playerPosition = playerDiv.children[2].textContent;

  //get selected option id
  const selectedPosition = playerDiv.children[4].value;

  if (Number(selectedPosition) === 0) {
    const player = getPlayerById(playerId);
    clearPlayerFromOldSlot(player);
    player.banch = benches[0];
    savePlayers();
    displayPlayers();
    return;
  }

  // return the slot and the bool
  const rs = checkSlotInTheCurrentPositionIsFree(playerPosition);

  if (rs.isExists) {
    //here we check even if there is available empty slots,
    //the user may select slots that doesnt belong
    // to the player position, so we should notify him

    if (!positions[playerPosition].includes(Number(selectedPosition))) {
      generalNotification.classList.add(
        "block",
        "text-white",
        "bg-red-600",
        "absolute",
        "w-[200px]",
        "h-[70px]",
        "bottom-[10px]",
        "right-[10px]",
        "rounded-[10px]",
        "p-[10px]"
      );
      console.log("is executed");
      generalNotification.textContent =
        "player slot does not belong to the selected position";

      setTimeout(() => {
        generalNotification.innerHTML = "";
        generalNotification.className = "";
      }, 4000);
    } else {
      //here the slot exists and the selected slot option is
      // related to the player position
      //******************************** */
      //so here we need to remove the player from its
      //current position then assign it to the new slot

      assignUserToGridSlot(selectedPosition, playerId);
    }
  }
});

function deletePlayer(playerId) {
  console.log("delete executed");
  const index = arr.findIndex((p) => p.id === playerId);

  clearPlayerFromOldSlot(getPlayerById(playerId));

  arr.splice(index, 1);

  savePlayers();
  displayPlayers();
}

function checkSlotInTheCurrentPositionIsFree(playerPosition) {
  const slots = positions[playerPosition];

  const availableSlot = slots.find(
    (slotId) => !arr.some((p) => p.banch?.id === slotId)
  );

  if (!availableSlot || availableSlot === 0) {
    return { isExists: false, availableSlot: availableSlot };
  } else {
    return { isExists: true, availableSlot: availableSlot };
  }
}

function assignUserToGridSlot(slotDivId, playerId) {
  //get player
  const player = getPlayerById(playerId);
  console.log(player.banch.id, slotDivId);
  //we need to ckeck if the selected player is already
  //in the selected slot, if(true) we do nothing else
  //we should remove the player from current slot,then
  //assign it to the new slot
  if (Number(slotDivId) === Number(player.banch.id)) {
    console.log("player is already in place");
    return;
  }

  //if the slot is taken by another player
  if (arr.find((u) => u.banch.id === Number(slotDivId))) {
    generalNotification.classList.add(
      "block",
      "text-white",
      "bg-red-600",
      "absolute",
      "w-[200px]",
      "h-[70px]",
      "bottom-[10px]",
      "right-[10px]",
      "rounded-[10px]",
      "p-[10px]"
    );

    generalNotification.textContent =
      "Banch is already taken by another player";

    setTimeout(() => {
      generalNotification.innerHTML = "";
      generalNotification.className = "";
    }, 4000);
    return;
  }

  clearPlayerFromOldSlot(player);

  const updatedArray = arr.map((p) => {
    if (p.id === player.id) {
      p.banch = benches[slotDivId];
    }

    generalNotification.classList.add(
      "block",
      "text-white",
      "bg-green-500",
      "absolute",
      "w-[200px]",
      "h-[70px]",
      "bottom-[10px]",
      "right-[10px]",
      "rounded-[10px]",
      "p-[10px]"
    );

    generalNotification.textContent = `${player.name} est placé en ${player.position}`;

    setTimeout(() => {
      generalNotification.innerHTML = "";
      generalNotification.className = "";
    }, 4000);
  });

  showPlayerOnField(player);
  savePlayers();

  generalNotification.classList.add(
    "block",
    "text-white",
    "bg-green-700",
    "absolute",
    "w-[200px]",
    "h-[70px]",
    "bottom-[10px]",
    "right-[10px]",
    "rounded-[10px]",
    "p-[10px]"
  );

  generalNotification.textContent = "Player placed succesfully";

  setTimeout(() => {
    generalNotification.innerHTML = "";
    generalNotification.className = "";
  }, 4000);
}

function clearPlayerFromOldSlot(player) {
  const slotId = player?.banch?.id;
  if (slotId == null || Number(slotId) === 0) return;

  const div = document.getElementsByClassName(String(slotId))[0];
  if (!div) return;

  const content = div.childNodes[0]?.textContent?.trim();
  if (!content) return;
  div.innerHTML = "";
  div.textContent = content;
}

//show saved players in the list and on the field
displayPlayers();
arr.forEach((player) => {
  showPlayerOnField(player);
});

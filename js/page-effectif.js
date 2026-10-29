import { getPlayers, isSlotFree, playerStatus } from "./players.js";

const list = document.querySelector("#playersUl");
const playersParentDiv = document.querySelector("#players");
const addNewPlayer = document.querySelector(".addNewPlayer");
const modal = document.querySelector(".cardParent");
const slotError = document.querySelector(".slotNotEmptyError");
let hasError = false;

const Status = Object.freeze({
  addNewMode: 0,
  editMode: 1,
});

list.addEventListener("click", (e) => {
  const listItem = e.target.closest("li");
  console.log(listItem);
  if (listItem && list.contains(listItem)) {
    const currentActive = list.querySelector("li.active");

    if (currentActive) {
      currentActive.classList.remove("active");
    }
    listItem.classList.add("active");
  }
});

//open the modal window
addNewPlayer.addEventListener("click", () => {
  const modal = document.querySelector(".cardParent");
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
    console.log("submit hited");
  });

function loadModalInfo() {
  const selectPlayerStatus = document.querySelector(".selectPlayerStatus");
  Object.values(playerStatus).forEach((status) => {
    const option = document.createElement("option");
    option.value = status.value;
    option.textContent = status.lable;
    selectPlayerStatus.append(option);
  });
}

function createPlayerTemplate(player) {
  return `<div class="player p-[20px] border-black border-[1px] w-fit bg-slate-600"
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
            <p class="position font-medium text-white">${player.position}</p>
            <p class="age w-full text-gray-400">${player.age}</p>
          </div>

          <div 
            class="actionButtons flex justify-between items-center mt-[10px]"
          >
            <p class="health text-white border-white p-[5px]"></p>
            <div
              class="actions flex justify-end items-center gap-[14px] text-white"
            >
              <button class="captain text-[25px]">c</button>
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
  let players = getPlayers();

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

  //player poste
  const selectedPost = document.querySelector('input[name="postes"]:checked');
  const selectedPostVal = selectedPost.value;

  //selected player number
  const playerNumber = Number(document.querySelector("#playerNumber").value);

  if (currentStatus === Status.addNewMode) {
    const availableSlot = isSlotFree(selectedPostVal);

    if (!availableSlot) {
      slotError.textContent = "All slots in that position are not empty";
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

loadPlayers();

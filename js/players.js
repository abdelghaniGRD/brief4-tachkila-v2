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

export const playerStatus = Object.freeze({
  Healthy: { value: "healthy", lable: "En forme" },
  Inured: { value: "injured", lable: "Blessé" },
});
let players = getPlayers();

export function getPlayers() {
  const players = localStorage.getItem("tachkilaPlayers");

  return players ? JSON.parse(players) : [];
}

export function savePlayers(arr) {
  localStorage.setItem("tachkilaPlayers", JSON.stringify(arr));
}

export function deletePlayer(playerId) {
  const pla = getPlayers();

  const index = pla.findIndex((p) => p.id === playerId);

  pla.splice(index, 1);

  savePlayers(pla);
}

//find if a slot in selected position is free
export function isSlotFree(selectedPostValue) {
  const slots = positions[selectedPostValue];
  const availableSlot = slots.find(
    (slotId) => !arr.some((p) => p.banch?.id === slotId)
  );

  if (!availableSlot || availableSlot === 0) {
    //there is no available slots
    return null;
  } else {
    return availableSlot;
  }
}

export function addNewPlayer(player) {
  let p = players;

  p.push({
    id: crypto.randomUUID(),
    name: player.playerName,
    position: player.selectedPostVal,
    playerNumber: player.playerNumber,
    banch: {
      id: player.banch.id,
      name: `position ${player.banch.id}`,
    },
  });

  savePlayers(p);
}

export function doesPlayerHaveTheSameposition() {}

export function editPlayer(player, samePosition) {
  let arr = getPlayers();
  //player has the same position so we dont need to check for available slots ...
  if (samePosition)
    arr.forEach((p, index) => {
      if (p.id == player.id) {
        arr[index].name = player.name;
        arr[index].playerNumber = player.playerNumber;
      }
      return;
    });
  else {
    // look for the player and update the player info
    arr.forEach((p, index) => {
      if (p.id == player.id) {
        arr[index].name = player.name;
        arr[index].position = player.position;

        arr[index].playerNumber = player.playerNumber;
        arr[index].banch = {
          id: player.banch.id,
          name: `position ${player.banch.id}`,
        };
      }
    });
  }
}

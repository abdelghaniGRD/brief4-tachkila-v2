export const benches = [
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
  Healthy: { value: "healthy", label: "En forme" },
  Injured: { value: "injured", label: "Blessé" },
});

export function getPlayers(search = "", filterBy = "all") {
  const players = localStorage.getItem("tachkilaPlayers");

  if (players) {
    let rs = JSON.parse(players);
    if (filterBy === "all") {
      let filtered = rs.filter((p) => p.name.includes(search));

      return filtered;
    } else {
      let filtered = rs.filter(
        (p) => p.position === filterBy && p.name.includes(search)
      );
      return filtered;
    }
    // rs.filter(player=>player.position===)
  } else {
    return [];
  }
}

export function savePlayers(arr) {
  localStorage.setItem("tachkilaPlayers", JSON.stringify(arr));
}

export function deletePlayer(playerId) {
  const pla = getPlayers("", "all");

  const index = pla.findIndex((p) => p.id === playerId);

  pla.splice(index, 1);

  savePlayers(pla);
}

//find if a slot in selected position is free
export function isSlotFree(selectedPostValue) {
  const arr = getPlayers("", "all");
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
  const players = getPlayers("", "all");
  players.push(player);
  savePlayers(players);
}

export function doesPlayerHaveTheSameposition() {}

export function updatePlayer(player) {
  let arr = getPlayers("", "all");

  // look for the player and update the player info
  arr.forEach((p, index) => {
    if (p.id == player.id) {
      arr[index].name = player.name;
      arr[index].position = player.position;
      arr[index].age = player.age;
      arr[index].captain = player.captain;
      arr[index].status = player.status;
      arr[index].playerNumber = player.playerNumber;
      arr[index].banch = {
        id: player.banch.id,
        name: `position ${player.banch.id}`,
      };
    }
  });
  savePlayers(arr);
}

export function getPlayerById(id) {
  const p = getPlayers("", "all").find((p) => p.id === id);
  return p;
}

export function makePlayerCaptain(id) {
  let arr = getPlayers("", "all");
  console.log(arr);

  arr.forEach((p) => {
    if (p.id === id) p.captain = true;
    else p.captain = false;
  });

  savePlayers(arr);
}

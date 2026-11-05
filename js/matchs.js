import { validateOpponentName } from "./validation.js";

const key = "matchesKey";

export function getMatches(search = "", filterBy = "all") {
  const macthes = localStorage.getItem(key);

  if (macthes) {
    let rs = JSON.parse(macthes);
    console.log(typeof rs[0].date);
    if (filterBy === "all") {
      let filtered = rs.filter((m) => m.opponentName.includes(search));

      return filtered;
    } else if (filterBy === "future") {
      let filtered = rs.filter(
        (m) =>
          Date.parse(m.date) >= Date.now() && m.opponentName.includes(search)
      );
      return filtered;
    } else if (filterBy === "played") {
      let filtered = rs.filter(
        (m) =>
          Date.parse(m.date) <= Date.now() && m.opponentName.includes(search)
      );
      return filtered;
    }
  }
}

let matches = getMatches();

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

function saveMatches() {
  localStorage.setItem(key, JSON.stringify(matches));
}

export function addNewMatch(match) {
  matches.push(match);
  saveMatches();
}

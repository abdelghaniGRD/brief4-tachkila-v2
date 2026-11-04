import { validateOpponentName } from "./validation.js";

const key = "matchesKey";

export function getMatches() {
  const rs = localStorage.getItem(key);

  return rs ? JSON.parse(rs) : [];
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

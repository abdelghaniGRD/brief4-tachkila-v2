export function nameValidation(name) {
  const regex = /^[A-Za-z]+$/;

  const hasSC = regex.test(name);

  return hasSC;
}

export function numberValidation(number) {
  const regex = /^(?:[1-99]|[1-99][0-99])$/;

  const numValid = regex.test(number);
  return numValid;
}

export function playerAgeValidation(age) {
  const regex = /^(1[89]|2[0-9]|3[0-5])$/;

  const numValid = regex.test(age);
  return numValid;
}

export function validateOpponentName(opponentName) {
  if (opponentName.toLowerCase() === "atlas fc") {
    return false;
  } else return true;
}

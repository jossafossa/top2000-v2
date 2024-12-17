import { ApiTrack } from "../store";

const slugify = (input: string) => {
  input = input.toLowerCase();

  // remove  à etc
  input = input.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  const empty = [
    "and",
    "the",
    "de",
    "en",
    "&",
    "n'",
    "ng",
    "pts",
    "part",
    "sta",
    "ster",
    "'m",
    "'em",
  ];
  for (const word of empty) {
    const regex = new RegExp(word, "gi");
    input = input.replace(regex, "");
  }

  input = input
    .toLowerCase()
    .replaceAll(/\(.*\)/g, "")
    .replaceAll(/['"()`,/.!?]/g, "")
    .replaceAll(/\s/g, "");

  // sort letters alphabetically
  input = input.split("").sort().join("");
  return input;
};

export const getTrackId = (position: ApiTrack) => {
  const {
    track: { artist, title },
  } = position;
  return `${slugify(title)}${slugify(artist)}`;
};

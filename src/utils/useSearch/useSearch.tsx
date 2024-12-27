type Track = {
  title: string;
  artist: string;
};

export function useSearch<T extends Track>(
  positions: T[],
  searchQuery: string
) {
  const simplify = (text: string) =>
    text
      .toLowerCase() // Convert to lowercase
      .normalize("NFD") // Decompose characters (e.g., "ø" -> "o\u0308")
      .replace(/[\u0300-\u036f]/g, "") // Remove diacritic marks
      .replace(/[ø]/g, "o") // Replace special characters
      .replaceAll(/\s/g, ""); // remove whitespace

  return positions.filter((position) => {
    const query = simplify(searchQuery);
    const matchTitle = simplify(position.title).includes(query);
    const matchArtist = simplify(position.artist).includes(query);
    if (matchTitle || matchArtist) return matchTitle || matchArtist;
  });
}

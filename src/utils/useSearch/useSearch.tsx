type Track = {
  artist: string;
};

export function useSearch<T extends Track>(
  positions: T[],
  searchQuery: string,
  keys: (keyof T)[] = []
) {
  const simplify = (text: string) =>
    text
      .toLowerCase() // Convert to lowercase
      .normalize("NFD") // Decompose characters (e.g., "ø" -> "o\u0308")
      .replace(/[\u0300-\u036f]/g, "") // Remove diacritic marks
      .replace(/[ø]/g, "o") // Replace special characters
      .replaceAll(/\s/g, ""); // remove whitespace

  const filtered = positions.filter((position) => {
    const query = simplify(searchQuery);

    for (const key of keys) {
      const match = simplify(String(position[key])).includes(query);
      if (match) return true;
    }
    return false;
  });

  return filtered;
}

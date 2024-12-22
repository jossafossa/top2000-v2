import { createContext, useContext, useEffect, useState } from "react";
import { useGetSongsQuery, useGetYearQuery } from "../store";
import { EnhancedTrack, Track } from "../assets/Top2000Api";
import { skipToken } from "@reduxjs/toolkit/query";
import { useQueryParam, BooleanParam, StringParam } from "use-query-params";

export type ListType = "years" | "songs";

type PositionContext = {
  positions?: Track[];
  setPositions: (positions: Track[]) => void;
  comparePositions?: Track[];
  setComparePositions: (positions: Track[]) => void;
  years: string[];
  selectedYear?: string | "all";
  setSelectedYear: (year: string) => void;
  compareYear?: string | "previous";
  setCompareYear: (year: string | "previous") => void;
  setSortType: (type) => void;
  setSortDirection: (direction: boolean) => void;
  setSearchQuery: (query: string) => void;
  searchQuery: string;
  sortType: string;
  sortDirection: boolean;
  isLoading: boolean;
  listType: ListType;
  setListType: (type: ListType) => void;
  positionsStats: {
    averageChange?: number;
  };
  songsStats: {
    averageChange?: number;
  };
  songs?: EnhancedTrack[];
  isSongsLoading: boolean;
};

const getYears = (start: number, end: number) => {
  return Array.from({ length: end - start + 1 }, (_, index) =>
    String(start + index)
  ).reverse();
};

const addRelativePositions = (tracks: Track[], comparePositions: Track[]) => {
  const compareToPrevious = comparePositions.length === 0;
  return tracks.map((track) => {
    const comparePosition = comparePositions.find(
      (comparePosition) => comparePosition.id === track.id
    );
    const { position, apiPrefPosition } = track;
    const previousPosition = compareToPrevious
      ? apiPrefPosition || tracks.length
      : comparePosition?.position ?? tracks.length;

    const change = previousPosition - position;

    return {
      ...track,
      change,
      isNew: previousPosition === tracks.length,
    };
  });
};

function sort<T>(positions: T[], type: keyof T, direction: boolean) {
  if (type === "change") direction = !direction;

  return [...positions].sort((a, b) => {
    if (a[type] === undefined || b[type] === undefined) {
      return 0;
    }

    // @ts-expect-error -- We know that the type is a number
    if (a[type] > b[type]) {
      return direction ? 1 : -1;
    }
    // @ts-expect-error -- We know that the type is a number

    if (a[type] < b[type]) {
      return direction ? -1 : 1;
    }
    return 0;
  });
}

function search<T extends Track>(positions: T[], searchQuery: string) {
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

export const Top2000Handler = (): PositionContext => {
  const years = getYears(1999, new Date().getFullYear());
  const [positions, setPositions] = useState<Track[]>([]);
  const [listType, setListType] = useState<"years" | "songs">("years");

  const [_selectedYear, setSelectedYear] = useQueryParam("year", StringParam);
  const selectedYear = _selectedYear ?? years[0];

  // fetch year
  const fetchAll = selectedYear === "all";
  const singleYearQuery = fetchAll ? skipToken : selectedYear;
  const { data: positionsResult, isFetching: isPositionsLoading } =
    useGetYearQuery(singleYearQuery ?? skipToken);

  // fetch all
  const allYearsQuery = listType === "songs" ? years : skipToken;
  const { data: songs, isFetching: isSongsLoading } = useGetSongsQuery(
    allYearsQuery ?? skipToken
  );

  // fetch compare year
  const [_compareYear, setCompareYear] = useQueryParam("previous", StringParam);
  const compareYear = _compareYear ?? "previous";
  const {
    data: comparePositionsResult,
    isFetching: isComparePositionsLoading,
  } = useGetYearQuery(
    compareYear === "previous" ? skipToken : compareYear ?? skipToken
  );
  const [comparePositions, setComparePositions] = useState<Track[]>([]);

  // add relative positions
  useEffect(() => {
    if (positionsResult) {
      setPositions(
        addRelativePositions(positionsResult, comparePositionsResult ?? [])
      );
    }
  }, [comparePositionsResult, positionsResult]);

  // setup filters
  const [_sortDirection, setSortDirection] = useQueryParam(
    "direction",
    BooleanParam
  );
  const sortDirection = _sortDirection ?? true;
  const [_sortType, setSortType] = useQueryParam("position", StringParam);
  const sortType = _sortType ?? "position";

  const [_searchQuery, setSearchQuery] = useQueryParam("s", StringParam);
  const searchQuery = _searchQuery ?? "";

  // filter
  const sortedPositions = sort<Track>(
    positions,
    sortType as keyof Track,
    sortDirection ?? true
  );

  const sortedSongs = sort<EnhancedTrack>(
    songs || [],
    sortType as keyof EnhancedTrack,
    sortDirection ?? true
  );

  const searchedPositions = search(sortedPositions, searchQuery ?? "");
  const searchedSongs = search(sortedSongs, searchQuery ?? "");

  //stats
  const positionsStats = {
    averageChange:
      Math.floor(
        searchedPositions
          .map((position) => position.change)
          .reduce((a, b) => a + b, 0) / searchedPositions.length
      ) || 0,
    amountOfSongs: searchedPositions.length || 0,
  };
  const songsStats = {
    averageChange:
      Math.floor(
        searchedPositions
          .map((position) => position.change)
          .reduce((a, b) => a + b, 0) / searchedPositions.length
      ) || 0,
    amountOfSongs: searchedPositions.length || 0,
  };

  return {
    positions: searchedPositions,
    setPositions,
    comparePositions,
    setComparePositions,
    songs: searchedSongs,
    isSongsLoading,
    years,
    selectedYear,
    setSelectedYear,
    compareYear,
    setCompareYear,
    isLoading: isPositionsLoading || isComparePositionsLoading,
    setSortType,
    setSortDirection,
    sortType,
    sortDirection,
    searchQuery,
    setSearchQuery,
    listType,
    setListType,
    positionsStats,
    songsStats,
  };
};

const Context = createContext<PositionContext>({
  positions: [],
  setPositions: () => {},
  comparePositions: [],
  setComparePositions: () => {},
  years: getYears(2000, new Date().getFullYear()),
  selectedYear: undefined,
  setSelectedYear: () => {},
  compareYear: undefined,
  setCompareYear: () => {},
  setSortType: () => {},
  setSortDirection: () => {},
  sortType: "position",
  sortDirection: true,
  isLoading: false,
  searchQuery: "",
  setSearchQuery: () => {},
  listType: "years",
  setListType: () => {},
  positionsStats: {},
  songsStats: {},
  songs: [],
  isSongsLoading: false,
});

export const Top2000Provider = Context.Provider;
export const useTop2000 = () => useContext(Context);

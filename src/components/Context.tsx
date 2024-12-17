import { createContext, useContext, useEffect, useState } from "react";
import { Track, useGetYearQuery } from "../store";
import { skipToken } from "@reduxjs/toolkit/query";

type PositionContext = {
  positions?: Track[];
  setPositions: (positions: Track[]) => void;
  comparePositions?: Track[];
  setComparePositions: (positions: Track[]) => void;
  years: number[];
  selectedYear?: number;
  setSelectedYear: (year: number) => void;
  compareYear?: number | "previous";
  setCompareYear: (year: number | "previous") => void;
  setSortType: (type: keyof Track) => void;
  setSortDirection: (direction: boolean) => void;
  setSearchQuery: (query: string) => void;
  searchQuery: string;
  sortType: keyof Track;
  sortDirection: boolean;
  isLoading: boolean;
  stats: {
    averageChange?: number;
  };
};

const getYears = (start: number, end: number) => {
  return Array.from(
    { length: end - start + 1 },
    (_, index) => start + index
  ).reverse();
};

const addRelativePositions = (tracks: Track[], compareTracks: Track[]) => {
  const compareToPrevious = compareTracks.length === 0;
  return tracks.map((track) => {
    const compareTrack = compareTracks.find(
      (comparePosition) => comparePosition.id === track.id
    );
    const { position, apiPrefPosition } = track;
    const previousPosition = compareToPrevious
      ? apiPrefPosition || 2000
      : compareTrack?.position ?? 2000;

    const change = previousPosition - position;

    return {
      ...track,
      change,
      isNew: previousPosition === 2000,
    };
  });
};

const sort = (positions: Track[], type: keyof Track, direction: boolean) => {
  if (type === "change") direction = !direction;

  return [...positions].sort((a, b) => {
    if (a[type] === undefined || b[type] === undefined) {
      return 0;
    }

    if (a[type] > b[type]) {
      return direction ? 1 : -1;
    }
    if (a[type] < b[type]) {
      return direction ? -1 : 1;
    }
    return 0;
  });
};

const search = (positions: Track[], searchQuery: string) => {
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
    if (matchTitle || matchArtist)
      console.log(position, simplify(position.artist));
    return matchTitle || matchArtist;
  });
};

export const Top2000Handler = (): PositionContext => {
  const years = getYears(2000, new Date().getFullYear());
  const [sortType, setSortType] = useState<keyof Track>("position");
  const [sortDirection, setSortDirection] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [selectedYear, setSelectedYear] = useState<number>(years[0]);
  const { data: positionsResult, isFetching: isPositionsLoading } =
    useGetYearQuery(selectedYear);
  const [positions, setPositions] = useState<Track[]>([]);

  const [compareYear, setCompareYear] = useState<number | "previous">(
    "previous"
  );
  const {
    data: comparePositionsResult,
    isFetching: isComparePositionsLoading,
  } = useGetYearQuery(compareYear === "previous" ? skipToken : compareYear);
  const [comparePositions, setComparePositions] = useState<Track[]>([]);

  useEffect(() => {
    if (positionsResult)
      setPositions(addRelativePositions(positionsResult, comparePositions));
  }, [positionsResult, comparePositions]);

  useEffect(() => {
    if (comparePositionsResult) setComparePositions(comparePositionsResult);
  }, [comparePositionsResult]);

  const sorted = sort(positions, sortType, sortDirection);
  const searched = search(sorted, searchQuery);

  const stats = {
    averageChange: Math.floor(
      searched.map((position) => position.change).reduce((a, b) => a + b, 0) /
        searched.length
    ),
    amountOfSongs: searched.length,
  };

  const all = {
    positions: searched,
    setPositions,
    comparePositions,
    setComparePositions,
    years: getYears(2000, new Date().getFullYear()),
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
    stats,
  };

  return all;
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
  stats: {},
});

export const Top2000Provider = Context.Provider;
export const useTop2000 = () => useContext(Context);

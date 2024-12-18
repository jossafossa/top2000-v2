import { createContext, useContext, useEffect, useState } from "react";
import { Track, useGetCombinedYearsQuery, useGetYearQuery } from "../store";
import { skipToken } from "@reduxjs/toolkit/query";
import { useQueryParam, BooleanParam, StringParam } from "use-query-params";

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
  setSortType: (type: keyof Track) => void;
  setSortDirection: (direction: boolean) => void;
  setSearchQuery: (query: string) => void;
  searchQuery: string;
  sortType: string;
  sortDirection: boolean;
  isLoading: boolean;
  stats: {
    averageChange?: number;
  };
};

const getYears = (start: number, end: number) => {
  return Array.from({ length: end - start + 1 }, (_, index) =>
    String(start + index)
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
      ? apiPrefPosition || tracks.length
      : compareTrack?.position ?? tracks.length;

    const change = previousPosition - position;

    return {
      ...track,
      change,
      isNew: previousPosition === tracks.length,
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
    if (matchTitle || matchArtist) return matchTitle || matchArtist;
  });
};

export const Top2000Handler = (): PositionContext => {
  const years = getYears(1999, new Date().getFullYear());
  const [positions, setPositions] = useState<Track[]>([]);

  const [_selectedYear, setSelectedYear] = useQueryParam("year", StringParam);
  const selectedYear = _selectedYear ?? years[0];

  // fetch year
  const fetchAll = selectedYear === "all";
  const singleYearQuery = fetchAll ? skipToken : selectedYear;
  const { data: singlePositionsResult, isFetching: isSinglePositionsLoading } =
    useGetYearQuery(singleYearQuery ?? skipToken);

  // fetch all
  const allYearsQuery = fetchAll ? years : skipToken;
  const { data: allPositionsResult, isFetching: isallPositionsLoading } =
    useGetCombinedYearsQuery(allYearsQuery ?? skipToken);
  const positionsResult = fetchAll ? allPositionsResult : singlePositionsResult;
  const isPositionsLoading = fetchAll
    ? isallPositionsLoading
    : isSinglePositionsLoading;

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

  // sorting
  const [_sortDirection, setSortDirection] = useQueryParam(
    "direction",
    BooleanParam
  );
  const sortDirection = _sortDirection ?? true;

  const [_sortType, setSortType] = useQueryParam("position", StringParam);
  const sortType = _sortType ?? "position";

  const sorted = sort(
    positions,
    sortType as keyof Track,
    sortDirection ?? true
  );

  //searching
  const [_searchQuery, setSearchQuery] = useQueryParam("s", StringParam);
  const searchQuery = _searchQuery ?? "";

  const searched = search(sorted, searchQuery ?? "");

  //stats
  const stats = {
    averageChange:
      Math.floor(
        searched.map((position) => position.change).reduce((a, b) => a + b, 0) /
          searched.length
      ) || 0,
    amountOfSongs: searched.length || 0,
  };

  const all = {
    positions: searched,
    setPositions,
    comparePositions,
    setComparePositions,
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

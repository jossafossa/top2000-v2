import { createContext, useContext, useEffect, useState } from "react";
import { useGetSongsQuery, useGetYearQuery } from "../../store";
import { EnhancedTrack, Track } from "@assets/Top2000Api";
import { skipToken } from "@reduxjs/toolkit/query";
import { useQueryParam, BooleanParam, StringParam } from "use-query-params";
import { useYearsList } from "@utils/useYearsList";
import { useSearch } from "@utils/useSearch";
import { useSort } from "@utils/useSort";

export type ListType = "years" | "songs";

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

export const Top2000Handler = () => {
  const years = useYearsList(1999);
  const [positions, setPositions] = useState<Track[]>([]);
  const [listType, setListType] = useState<"years" | "songs" | "artists">(
    "years"
  );

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
  const sortedPositions = useSort<Track>(
    positions,
    sortType as keyof Track,
    sortDirection ?? true
  );

  const sortedSongs = useSort<EnhancedTrack>(
    songs || [],
    sortType as keyof EnhancedTrack,
    sortDirection ?? true
  );

  const searchedPositions = useSearch(sortedPositions, searchQuery ?? "");
  const searchedSongs = useSearch(sortedSongs, searchQuery ?? "");

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
    sortType: sortType as keyof Track,
    sortDirection,
    searchQuery,
    setSearchQuery,
    listType,
    setListType,
    positionsStats,
    songsStats,
  };
};

const Context = createContext<ReturnType<typeof Top2000Handler>>({
  positions: [],
  setPositions: () => {},
  comparePositions: [],
  setComparePositions: () => {},
  years: [],
  selectedYear: "2024",
  setSelectedYear: () => {},
  compareYear: "2023",
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
  positionsStats: {
    averageChange: 0,
    amountOfSongs: 0,
  },
  songsStats: {
    averageChange: 0,
    amountOfSongs: 0,
  },
  songs: [],
  isSongsLoading: false,
});

export const Top2000Provider = Context.Provider;
export const useTop2000 = () => useContext(Context);

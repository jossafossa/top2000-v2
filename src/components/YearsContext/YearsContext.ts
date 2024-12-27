import { createContext, useContext, useState } from "react";
import { useGetYearQuery } from "../../store";
import { Track } from "@assets/Top2000Api";
import { skipToken } from "@reduxjs/toolkit/query";
import { useQueryParam, BooleanParam, StringParam } from "use-query-params";
import { useSearch } from "@utils/useSearch";
import { useYearsList } from "@utils/useYearsList";
import { useSort } from "@utils/useSort";
import { useRelativePositions } from "@utils/useRelativePositions";

export const YearsHandler = () => {
  const years = useYearsList(1999);

  const [selectedYear] = useQueryParam("year", StringParam);

  // fetch year
  const singleYearQuery = selectedYear ?? years[0];
  const { data: result, isFetching: isPositionsLoading } = useGetYearQuery(
    singleYearQuery ?? skipToken
  );

  // fetch compare year
  const [compareYear] = useQueryParam("previous", StringParam);
  const { data: compareResult, isFetching: isComparePositionsLoading } =
    useGetYearQuery(compareYear ? compareYear : skipToken);
  const [comparePositions] = useState<Track[]>([]);

  const positions = useRelativePositions(result ?? [], compareResult ?? []);

  // setup filters
  const [sortDirection] = useQueryParam("direction", BooleanParam);
  const [sortType] = useQueryParam("position", StringParam);

  // filter
  const sorted = useSort<Track>(
    positions,
    (sortType ?? "position") as keyof Track,
    sortDirection ?? true
  );

  const [searchQuery, setSearchQuery] = useQueryParam("s", StringParam);
  const searched = useSearch(sorted, searchQuery ?? "");

  //stats
  const stats = {
    averageChange:
      Math.floor(
        searched.map((position) => position.change).reduce((a, b) => a + b, 0) /
          searched.length
      ) || 0,
    amountOfSongs: searched.length || 0,
  };

  return {
    positions: searched,
    comparePositions,
    years,
    selectedYear,
    compareYear,
    isLoading: isPositionsLoading || isComparePositionsLoading,
    searchQuery,
    setSearchQuery,
    stats,
  };
};

const Context = createContext<ReturnType<typeof YearsHandler>>({
  positions: [],
  comparePositions: [],
  years: [],
  selectedYear: "2024",
  compareYear: "2023",
  isLoading: false,
  searchQuery: "",
  setSearchQuery: () => {},
  stats: {
    averageChange: 0,
    amountOfSongs: 0,
  },
});

export const YearsProvider = Context.Provider;
export const useYears = () => useContext(Context);

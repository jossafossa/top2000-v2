import { createContext, useContext, useState } from "react";
import { EnhancedTrack } from "@assets/Top2000Api";
import { useQueryParam, BooleanParam, StringParam } from "use-query-params";
import { useYearsList } from "@utils/useYearsList";

export type ListType = "years" | "songs" | "artists";

export const Top2000Handler = () => {
  const years = useYearsList(1999);
  const [listType, setListType] = useState<"years" | "songs" | "artists">(
    "years"
  );

  const [_selectedYear, setSelectedYear] = useQueryParam("year", StringParam);
  const selectedYear = _selectedYear ?? years[0];

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

  return {
    years,
    selectedYear,
    setSelectedYear,
    setSortType,
    setSortDirection,
    sortType: sortType as keyof EnhancedTrack,
    sortDirection,
    searchQuery,
    setSearchQuery,
    listType,
    setListType,
  };
};

const Context = createContext<ReturnType<typeof Top2000Handler>>({
  years: [],
  selectedYear: "2024",
  setSelectedYear: () => {},
  setSortType: () => {},
  setSortDirection: () => {},
  sortType: "position",
  sortDirection: true,
  searchQuery: "",
  setSearchQuery: () => {},
  listType: "years",
  setListType: () => {},
});

export const Top2000Provider = Context.Provider;
export const useTop2000 = () => useContext(Context);

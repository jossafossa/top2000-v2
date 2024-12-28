import { createContext, useContext } from "react";
import { useGetSongsQuery } from "../../store";
import { useQueryParam, BooleanParam, StringParam } from "use-query-params";
import { useSearch } from "@utils/useSearch";
import { useYearsList } from "@utils/useYearsList";
import { useSort } from "@utils/useSort";
import { EnhancedTrack } from "@assets/Top2000Api";

export const SongsHandler = () => {
  const years = useYearsList(1999);

  // fetch year
  const { data: songs, isFetching: isLoading } = useGetSongsQuery(years);

  // setup filters
  const [sortDirection] = useQueryParam("direction", BooleanParam);
  const [sortType] = useQueryParam("position", StringParam);

  const [searchQuery, setSearchQuery] = useQueryParam("s", StringParam);

  // filter
  const sortedSongs = useSort<EnhancedTrack>(
    songs ?? [],
    sortType as keyof EnhancedTrack,
    sortDirection ?? true
  );

  const searchedSongs = useSearch(sortedSongs, searchQuery ?? "", [
    "title",
    "artist",
  ]);

  //stats
  const stats = {
    averageChange:
      Math.floor(
        searchedSongs
          .map((position) => position.change)
          .reduce((a, b) => a + b, 0) / searchedSongs.length
      ) || 0,
    amountOfSongs: searchedSongs.length || 0,
  };

  return {
    songs: searchedSongs,
    years,
    isLoading,
    searchQuery,
    setSearchQuery,
    stats,
  };
};

const Context = createContext<ReturnType<typeof SongsHandler>>({
  songs: [],
  years: [],
  isLoading: false,
  searchQuery: "",
  setSearchQuery: () => {},
  stats: {
    averageChange: 0,
    amountOfSongs: 0,
  },
});

export const SongsProvider = Context.Provider;
export const useSongs = () => useContext(Context);

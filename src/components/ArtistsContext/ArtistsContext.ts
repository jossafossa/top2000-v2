import { createContext, useContext } from "react";
import { useGetArtistsQuery } from "../../store";
import { Track } from "@assets/Top2000Api";
import { useQueryParam, BooleanParam, StringParam } from "use-query-params";
import { useSearch } from "@utils/useSearch";
import { useSort } from "@utils/useSort";

export const ArtistsHandler = () => {
  // fetch year
  const { data: artists, isFetching: isLoading } = useGetArtistsQuery();

  // setup filters
  const [sortDirection] = useQueryParam("direction", BooleanParam);
  const [sortType] = useQueryParam("position", StringParam);

  const [searchQuery] = useQueryParam("s", StringParam);

  // filter
  const sortedArtists = useSort<Track>(
    artists,
    sortType as keyof Track,
    sortDirection ?? true
  );

  const searchedArtists = useSearch(sortedArtists, searchQuery ?? "");

  //stats
  const stats = {
    averageChange:
      Math.floor(
        searchedArtists
          .map((position) => position.change)
          .reduce((a, b) => a + b, 0) / searchedArtists.length
      ) || 0,
    amountOfSongs: searchedArtists.length || 0,
  };

  return {
    artists: searchedArtists,
    isLoading,
    stats,
  };
};

const Context = createContext<ReturnType<typeof ArtistsHandler>>({
  artists: [],
  isLoading: false,
  stats: {
    averageChange: 0,
    amountOfSongs: 0,
  },
});

export const ArtistsProvider = Context.Provider;
export const useArtists = () => useContext(Context);

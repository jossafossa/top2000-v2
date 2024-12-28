import { createContext, useContext } from "react";
import { useGetArtistsQuery } from "../../store";
import { Artist } from "@assets/Top2000Api";
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
  const sortedArtists = useSort<Artist>(
    artists ?? [],
    sortType as keyof Artist,
    sortDirection ?? true
  );

  const searchedArtists = useSearch(sortedArtists ?? [], searchQuery ?? "", [
    "artist",
  ]);

  return {
    artists: searchedArtists,
    isLoading,
  };
};

const Context = createContext<ReturnType<typeof ArtistsHandler>>({
  artists: [],
  isLoading: false,
});

export const ArtistsProvider = Context.Provider;
export const useArtists = () => useContext(Context);

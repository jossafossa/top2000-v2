import { LazyScroller } from "@components/LazyScroller";
import { Artist } from "@components/Artist";
import { useArtists } from "@components/ArtistsContext";

type ArtistListProps = {
  height: number;
};

export const ArtistList = ({ height }: ArtistListProps) => {
  const { artists, isLoading } = useArtists();
  console.log("artists", artists);

  return (
    <LazyScroller
      height={height}
      items={artists || []}
      isLoading={isLoading}
      renderItem={(artist, index) => (
        <Artist key={`${artist.artist}-${index}`} {...artist} />
      )}
    />
  );
};

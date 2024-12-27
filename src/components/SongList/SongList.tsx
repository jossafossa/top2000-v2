import { LazyScroller } from "@components/LazyScroller";
import { Song } from "@components/Song";
import { useSongs } from "@components/SongsContext";

type SongListProps = {
  height: number;
};

export const SongList = ({ height }: SongListProps) => {
  const { songs, isLoading } = useSongs();

  return (
    <LazyScroller
      height={height}
      items={songs || []}
      isLoading={isLoading}
      renderItem={(song, index) => (
        <Song key={`${song.id}-${index}`} {...song} />
      )}
    />
  );
};

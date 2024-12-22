import { useTop2000 } from "./Context";
import { LazyScroller } from "./LazyScroller";
import { Song } from "./Song";

type SongsListProps = {
  height: number;
};

export const SongsList = ({ height }: SongsListProps) => {
  const { songs, isSongsLoading } = useTop2000();
  console.log(songs);

  return (
    <LazyScroller
      height={height}
      items={songs || []}
      isLoading={isSongsLoading}
      renderItem={(song, index) => (
        <Song key={`${song.id}-${index}`} {...song} />
      )}
    />
  );
};

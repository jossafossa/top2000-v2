import { useTop2000 } from "@components/Top2000Context";
import { SongList } from "@components/SongList";
import { YearList } from "@components/YearList";
import { ArtistList } from "@components/ArtistList";

export const List = () => {
  const { listType } = useTop2000();

  return (
    <>
      {listType === "years" && <YearList height={86} />}
      {listType === "songs" && <SongList height={86} />}
      {listType === "artists" && <ArtistList height={86} />}
    </>
  );
};

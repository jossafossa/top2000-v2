import { useTop2000 } from "./Context";
import { SongsList } from "./SongsList";
import { YearList } from "./YearList";

export const List = () => {
  const { listType } = useTop2000();

  return (
    <>
      {listType === "years" && <YearList height={86} />}
      {listType === "songs" && <SongsList height={86} />}
    </>
  );
};

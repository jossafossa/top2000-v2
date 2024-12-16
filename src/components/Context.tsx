import { createContext, useContext, useEffect, useState } from "react";
import { Track, useGetYearQuery } from "../store";

type PositionContext = {
  positions?: Track[];
  setPositions: (positions: Track[]) => void;
  comparePositions?: Track[];
  setComparePositions: (positions: Track[]) => void;
  years: number[];
  selectedYear?: number;
  setSelectedYear: (year: number) => void;
  compareYear?: number | "previous";
  setCompareYear: (year: number | "previous") => void;
  setSortType: (type: keyof Track) => void;
  setSortDirection: (direction: boolean) => void;
  sortType: keyof Track;
  sortDirection: boolean;
  isLoading: boolean;
};

const getYears = (start: number, end: number) => {
  return Array.from(
    { length: end - start + 1 },
    (_, index) => start + index
  ).reverse();
};

const addRelativePositions = (positions: Track[], comparePositions: Track[]) =>
  positions.map((position) => {
    const comparePosition = comparePositions.find(
      (comparePosition) => comparePosition.id === position.id
    );

    if (
      comparePosition?.position &&
      position.apiPrefPosition &&
      position.apiPrefPosition !== comparePosition?.position
    ) {
      console.log({
        comparePosition,
        position,
      });
    }

    return {
      ...position,
      change: comparePosition
        ? comparePosition.position - position.position
        : positions.length - position.position,
      isNew: !comparePosition,
      prefPosition: comparePosition?.position,
    };
  });

export const Top2000Handler = (): PositionContext => {
  const years = getYears(2000, new Date().getFullYear());
  const [sortType, setSortType] = useState<keyof Track>("position");
  const [sortDirection, setSortDirection] = useState<boolean>(true);

  const [selectedYear, setSelectedYear] = useState<number>(years[0]);
  const { data: positionsResult, isFetching: isPositionsLoading } =
    useGetYearQuery(selectedYear);
  const [positions, setPositions] = useState<Track[]>([]);

  const [compareYear, setCompareYear] = useState<number | "previous">(
    "previous"
  );
  const {
    data: comparePositionsResult,
    isFetching: isComparePositionsLoading,
  } = useGetYearQuery(compareYear === "previous" ? years[1] : compareYear);
  const [comparePositions, setComparePositions] = useState<Track[]>([]);

  useEffect(() => {
    if (positionsResult)
      setPositions(addRelativePositions(positionsResult, comparePositions));
  }, [positionsResult, comparePositions]);

  useEffect(() => {
    if (comparePositionsResult) setComparePositions(comparePositionsResult);
  }, [comparePositionsResult]);

  const all = {
    positions,
    setPositions,
    comparePositions,
    setComparePositions,
    years: getYears(2000, new Date().getFullYear()),
    selectedYear,
    setSelectedYear,
    compareYear,
    setCompareYear,
    isLoading: isPositionsLoading || isComparePositionsLoading,
    setSortType,
    setSortDirection,
    sortType,
    sortDirection,
  };

  return all;
};

const Context = createContext<PositionContext>({
  positions: [],
  setPositions: () => {},
  comparePositions: [],
  setComparePositions: () => {},
  years: getYears(2000, new Date().getFullYear()),
  selectedYear: undefined,
  setSelectedYear: () => {},
  compareYear: undefined,
  setCompareYear: () => {},
  setSortType: () => {},
  setSortDirection: () => {},
  sortType: "position",
  sortDirection: true,
  isLoading: false,
});

export const Top2000Provider = Context.Provider;
export const useTop2000 = () => useContext(Context);

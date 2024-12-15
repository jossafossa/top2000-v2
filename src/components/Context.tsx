import { createContext, useContext, useEffect, useState } from "react";
import { Track, useGetYearQuery } from "../store";

type PositionContext = {
  positions?: Track[];
  setPositions: (positions: Track[]) => void;
  comparePositions?: Track[];
  setComparePositions: (positions: Track[]) => void;
  years: number[];
  selectedYear?: number;
  setSelectedYear: (year?: number) => void;
  compareYear?: number;
  setCompareYear: (year: number | "previous") => void;
};

const getYears = (start: number, end: number) => {
  return Array.from(
    { length: end - start + 1 },
    (_, index) => start + index
  ).reverse();
};

const addRelativePositions = (
  positions: Track[],
  comparePositions: Track[]
) => {
  return positions.map((position) => {
    const comparePosition = comparePositions.find(
      (comparePosition) => comparePosition.id === position.id
    );
    return {
      ...position,
      change: comparePosition
        ? comparePosition.position - position.position
        : positions.length - position.position,
    };
  });
};

export const Top2000Handler = () => {
  const years = getYears(2000, new Date().getFullYear());

  const [selectedYear, setSelectedYear] = useState<number>(years[0]);
  const { data: positionsResult } = useGetYearQuery(selectedYear);
  const [positions, setPositions] = useState<Track[]>([]);

  const [compareYear, setCompareYear] = useState<number | "previous">(
    "previous"
  );
  const { data: comparePositionsResult } = useGetYearQuery(
    compareYear === "previous" ? years[1] : compareYear
  );
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
});

export const Top2000Provider = Context.Provider;
export const useTop2000 = () => useContext(Context);

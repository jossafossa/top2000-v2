import { useEffect, useState } from "react";
import { useTop2000 } from "./Context";

export const Filters = () => {
  const { years, selectedYear, compareYear, setCompareYear, setSelectedYear } =
    useTop2000();

  const [compare, setCompare] = useState<number | "previous">("previous");

  useEffect(() => {
    console.log({
      selectedYear,
      compare,
    });
    if (compare === "previous" && selectedYear) {
      setCompareYear(selectedYear - 1);
    }
  }, [selectedYear, compare, setCompareYear]);

  return (
    <form>
      <label>
        Year
        <select
          onChange={(event) => setSelectedYear(Number(event.target.value))}
        >
          {years.map((year) => (
            <option
              key={year}
              defaultValue={year}
              selected={year === selectedYear}
            >
              {year}
            </option>
          ))}
        </select>
      </label>

      <label>
        Compare with
        <select onChange={(event) => setCompare(Number(event.target.value))}>
          {selectedYear && <option defaultValue="previous">previous</option>}
          {years.map(
            (year) =>
              year !== selectedYear && (
                <option
                  key={year}
                  defaultValue={year}
                  selected={year === compareYear}
                >
                  {year}
                </option>
              )
          )}
        </select>
      </label>
    </form>
  );
};

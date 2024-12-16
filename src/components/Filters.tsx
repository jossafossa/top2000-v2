import { useEffect, useState } from "react";
import { useTop2000 } from "./Context";
import { Sorter } from "./Sorter";
import styles from "./Filters.module.scss";
import { Track } from "../store";
import { Select } from "./Select";

export const Filters = () => {
  const {
    years,
    selectedYear,
    setCompareYear,
    setSelectedYear,
    setSortType,
    sortType,
    setSortDirection,
  } = useTop2000();

  const [compare, setCompare] = useState<number | "previous">("previous");
  const setSort = (type: keyof Track, direction: boolean) => {
    setSortType(type);
    setSortDirection(direction);
  };

  useEffect(() => {
    console.log({
      selectedYear,
      compare,
    });
    if (compare === "previous" && selectedYear) {
      setCompareYear(selectedYear - 1);
    } else {
      setCompareYear(compare);
    }
  }, [selectedYear, compare, setCompareYear]);

  return (
    <>
      <div className={styles.list}>
        <label className={styles.select}>
          Year
          <Select
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
          </Select>
        </label>

        <label className={styles.select}>
          Compare with
          <Select onChange={(event) => setCompare(Number(event.target.value))}>
            {selectedYear && <option defaultValue="previous">previous</option>}
            {years.map(
              (year) =>
                year !== selectedYear && (
                  <option key={year} defaultValue={year}>
                    {year}
                  </option>
                )
            )}
          </Select>
        </label>
      </div>

      <div className={styles.list}>
        <span>Sort by</span>
        <Sorter
          name="filter"
          label="position"
          active={sortType === "position"}
          onChange={(direction) => setSort("position", direction)}
        />
        <Sorter
          name="filter"
          label="title"
          active={sortType === "title"}
          onChange={(direction) => setSort("title", direction)}
        />
        <Sorter
          name="filter"
          label="artist"
          active={sortType === "artist"}
          onChange={(direction) => setSort("artist", direction)}
        />
        <Sorter
          name="filter"
          label="change"
          active={sortType === "change"}
          onChange={(direction) => setSort("change", direction)}
        />
      </div>
    </>
  );
};

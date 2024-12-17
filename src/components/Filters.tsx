import { useTop2000 } from "./Context";
import { Sorter } from "./Sorter";
import styles from "./Filters.module.scss";
import { Track } from "../store";
import { Select } from "./Select";
import { Input } from "./Input";

export const Filters = () => {
  const {
    years,
    selectedYear,
    setCompareYear,
    setSelectedYear,
    setSortType,
    sortType,
    setSortDirection,
    searchQuery,
    setSearchQuery,
  } = useTop2000();

  const setSort = (type: keyof Track, direction: boolean) => {
    setSortType(type);
    setSortDirection(direction);
  };

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
          /
          <Select
            onChange={(event) => setCompareYear(Number(event.target.value))}
          >
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

        <Input
          type="search"
          onChange={({ target }) => setSearchQuery(target.value)}
          value={searchQuery}
          placeholder="Search"
        />
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

import { useTop2000 } from "./Context";
import { Sorter } from "./Sorter";
import styles from "./Filters.module.scss";
import { Track } from "../store";
import { Select } from "./Select";
import { Input } from "./Input";
import classNames from "classnames";
import { useState } from "react";

export const Filters = () => {
  const {
    positions,
    years,
    selectedYear,
    setCompareYear,
    compareYear,
    setSelectedYear,
    setSortType,
    sortType,
    setSortDirection,
    searchQuery,
    setSearchQuery,
    stats,
  } = useTop2000();

  const setSort = (type: keyof Track, direction: boolean) => {
    setSortType(type);
    setSortDirection(direction);
  };

  const [active, setActive] = useState(true);

  return (
    <>
      <div className={styles.list}>
        <label className={styles.label}>
          <span>Show filters</span>
          <Input
            type="checkbox"
            onChange={({ target }) => setActive(target.checked)}
            checked={active}
          />
        </label>
      </div>

      <div className={classNames(styles.filters, active && styles.active)}>
        <table className={styles.table}>
          <tbody>
            {Object.entries(stats).map(([key, value]) => (
              <tr key={key}>
                <td>{key}</td>
                <td>{value}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className={styles.list}>
          <label className={styles.label}>
            Year
            <Select
              onChange={({ target }) => setSelectedYear(target.value)}
              value={selectedYear}
            >
              {years.map((year) => (
                <option key={year} value={String(year)}>
                  {year}
                </option>
              ))}
              <option value="all">All</option>
            </Select>
          </label>

          <label className={styles.label}>
            /
            <Select
              onChange={({ target }) => setCompareYear(target.value)}
              value={compareYear}
            >
              {selectedYear && (
                <option defaultValue="previous">previous</option>
              )}
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

          <label className={styles.label}>
            <Input
              type="search"
              onChange={({ target }) => setSearchQuery(target.value)}
              value={searchQuery}
              placeholder="Search"
            />
            {searchQuery && positions && `${positions.length} results`}
          </label>
        </div>

        <hr className={styles.line} />

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
      </div>
    </>
  );
};

import { ListType, useTop2000 } from "@components/Top2000Context";
import { Sorter } from "@components/Sorter";
import styles from "./Filters.module.scss";
import { EnhancedTrack, Track } from "@assets/Top2000Api";
import { Select } from "@components/Select";
import { Input } from "@components/Input";
import classNames from "classnames";
import { useState } from "react";
import { useYears } from "@components/YearsContext";
import { useSongs } from "@components/SongsContext";

export const Filters = () => {
  const {
    positions,
    setSortType,
    sortType,
    setSortDirection,
    searchQuery,
    setSearchQuery,
    setListType,
    listType,
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
        <div className={styles.list}>
          <label className={styles.label}>
            List type
            <Select
              onChange={({ target }) => setListType(target.value as ListType)}
              value={listType}
            >
              <option value="years">Years</option>
              <option value="songs">Songs</option>
            </Select>
          </label>
        </div>

        <table className={styles.table}>
          <tbody>
            {listType === "years" && <YearStats />}
            {listType === "songs" && <SongsStats />}
          </tbody>
        </table>

        <div className={styles.list}>
          {listType === "years" && <YearFilters />}
          {listType === "songs" && <SongsFilters />}

          <label className={styles.label}>
            <Input
              type="search"
              onChange={({ target }) => setSearchQuery(target.value)}
              defaultValue={searchQuery}
              placeholder="Search"
            />
            {searchQuery && positions && `${positions.length} results`}
          </label>
        </div>
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
        {listType === "songs" && <SongsSorters />}
        {listType === "years" && <YearsSorters />}
      </div>
    </>
  );
};

const YearStats = () => {
  const { stats } = useYears();

  return Object.entries(stats).map(([key, value]) => (
    <tr key={key}>
      <td>{key}</td>
      <td>{value}</td>
    </tr>
  ));
};

const SongsStats = () => {
  const { stats } = useSongs();

  return Object.entries(stats).map(([key, value]) => (
    <tr key={key}>
      <td>{key}</td>
      <td>{value}</td>
    </tr>
  ));
};

const YearFilters = () => {
  const { years, selectedYear, setCompareYear, compareYear, setSelectedYear } =
    useTop2000();

  return (
    <>
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
    </>
  );
};

const SongsFilters = () => {
  return (
    <div>
      <h2>Songs filters</h2>
    </div>
  );
};

const SongsSorters = () => {
  const { sortType, setSortType, setSortDirection } = useTop2000();

  const setSort = (type: keyof EnhancedTrack, direction: boolean) => {
    setSortType(type);
    setSortDirection(direction);
  };

  return (
    <>
      <Sorter
        name="filter"
        label="totalChange"
        active={sortType === "totalChange"}
        onChange={(direction) => setSort("totalChange", direction)}
      />
      <Sorter
        name="filter"
        label="averageChange"
        active={sortType === "averageChange"}
        onChange={(direction) => setSort("averageChange", direction)}
      />
    </>
  );
};

const YearsSorters = () => {
  const { sortType, setSortType, setSortDirection } = useTop2000();

  const setSort = (type: keyof Track, direction: boolean) => {
    setSortType(type);
    setSortDirection(direction);
  };

  return (
    <Sorter
      name="filter"
      label="change"
      active={sortType === "change"}
      onChange={(direction) => setSort("change", direction)}
    />
  );
};

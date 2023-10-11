import React from "react";
import styles from "./styling/SearchSort.module.css";

type Props = {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  allSEMethods: string[];
  selectedSEMethod: string;
  setSelectedSEMethod: React.Dispatch<React.SetStateAction<string>>;
  startYear: number | null;
  setStartYear: React.Dispatch<React.SetStateAction<number | null>>;
  endYear: number | null;
  setEndYear: React.Dispatch<React.SetStateAction<number | null>>;
  sortPreference: "mostRecent" | "mostReputable" | null;
  setSortPreference: React.Dispatch<
    React.SetStateAction<"mostRecent" | "mostReputable" | null>
  >;
};

const SearchSort: React.FC<Props> = ({
  searchTerm,
  setSearchTerm,
  allSEMethods,
  selectedSEMethod,
  setSelectedSEMethod,
  startYear,
  setStartYear,
  endYear,
  setEndYear,
  sortPreference,
  setSortPreference,
}) => {
  return (
    <div className={styles.searchAndSelectorContainer}>
      {/* Dropdown */}
      <div className={styles.dropdownContainer}>
        <span>Sort by: </span>
        <select
          value={selectedSEMethod}
          onChange={(e) => setSelectedSEMethod(e.target.value)}
          className={`form-control ${styles.seMethodSelector}`}
        >
          <option>All SE Methods</option>
          {allSEMethods.map((method) => (
            <option key={method}>{method}</option>
          ))}
        </select>
      </div>

      {/* Year Selector */}
      <div className={styles.yearSelectorContainer}>
        <input
          type="number"
          placeholder="From Year"
          value={startYear || ""}
          onChange={(e) => setStartYear(Number(e.target.value))}
          className={`form-control ml-2 ${styles.yearInput}`}
        />
        <p>_</p>
        <input
          type="number"
          placeholder="To Year"
          value={endYear || ""}
          onChange={(e) => setEndYear(Number(e.target.value))}
          className={`form-control ml-2 ${styles.yearInput}`}
        />
      </div>

      {/* Toggle Buttons */}
      <div className={styles.toggleButtonContainer}>
        <button
          onClick={() =>
            setSortPreference((prev) =>
              prev === "mostRecent" ? null : "mostRecent"
            )
          }
          className={`btn ${
            sortPreference === "mostRecent"
              ? "btn-secondary"
              : "btn-outline-secondary"
          }`}
        >
          Most Recent
        </button>
        <button
          onClick={() =>
            setSortPreference((prev) =>
              prev === "mostReputable" ? null : "mostReputable"
            )
          }
          className={`btn ${
            sortPreference === "mostReputable"
              ? "btn-secondary"
              : "btn-outline-secondary"
          }`}
        >
          Most Reputable
        </button>
      </div>
      {/* Search Bar */}
      <div className={styles["search-bar"]}>
        <input
          type="text"
          placeholder="Search articles"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="form-control"
        />
        <button
          onClick={() => setSearchTerm("")}
          disabled={!searchTerm}
          className="btn btn-primary ml-2"
        >
          Clear
        </button>
      </div>
    </div>
  );
};

export default SearchSort;

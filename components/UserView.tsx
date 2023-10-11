// Necessary imports
import React, { useState } from "react";
import { useTable, Column } from "react-table";
import styles from "./styling/UserView.module.css";
import "bootstrap/dist/css/bootstrap.css";

// Represents article data
type Article = {
  _id: string;
  title: string;
  author: string;
  description: string;
  date_published: string;
  DOI: string;
  result: string;
  research_type: string;
  journal: string;
  volume: string;
  pages: string;
  SE_methods: string[];
  claims: string[];
};

// Props for passing in a list of articles
type Props = {
  articles: Article[];
};

// Highlight the searched term within the provided text.
function highlightSearchTerm(text: string, searchTerm: string): JSX.Element {
  // If either the text or the search term is not provided, return the original text
  if (!searchTerm || !text) return <>{text}</>;

  // Create a regular expression based on the search term
  // 'gi' = global and not case-sensitive matching
  const regex = new RegExp(`(${searchTerm})`, "gi");

  // Split the text into parts based on the search term.
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, index) => {
        // Check if the current part matches the search term
        if (regex.test(part)) {
          return (
            // If matched, highlight the search term
            <mark className={styles.highlightedText} key={index}>
              {part}
            </mark>
          );
        }
        // If not matched, just return the part
        return <span key={index}>{part}</span>;
      })}
    </>
  );
}

// Display a welcome message tailored for a practitioner role
function WelcomeMessage() {
  return (
    <div className={styles.welcomeMessage}>
      <h4>Welcome, Practitioner!</h4>
      <p>
        Here, you can search and compare articles to make informed decisions on
        the best practices suited to your circumstances. Dive into the evidence,
        weigh the claims, and choose methods that resonate most with your
        objectives.
      </p>
    </div>
  );
}

function UserView({ articles }: Props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSEMethod, setSelectedSEMethod] = useState("All SE Methods");

  const [startYear, setStartYear] = useState<number | null>(null);
  const [endYear, setEndYear] = useState<number | null>(null);

  const allSEMethods = Array.from(
    new Set(articles.flatMap((article: Article) => article.SE_methods))
  );
  const filteredArticles = articles.filter((article) => {
    if (
      selectedSEMethod !== "All SE Methods" &&
      !article.SE_methods.includes(selectedSEMethod)
    ) {
      return false;
    }

    const publicationYear = new Date(article.date_published).getFullYear();

    if (startYear && publicationYear < startYear) {
      return false;
    }

    if (endYear && publicationYear > endYear) {
      return false;
    }

    // Create an array of all values from each column
    const allColumnValues = Object.values(article).join(" ").toLowerCase();

    // Check if any part of the article contains the search term
    return allColumnValues.includes(searchTerm.toLowerCase());
  });

  // Check if there are no results
  const noResults = filteredArticles.length === 0;

  // Construct columns for react-table
  const columns = React.useMemo(
    () =>
      [
        // Column headers
        {
          Header: "Title",
          accessor: "title",
          Cell: ({ cell: { value } }) => (
            <div style={{ width: "150px" }}>
              {" "}
              {highlightSearchTerm(value, searchTerm)}
            </div>
          ),
        },
        {
          Header: "Author",
          accessor: "author",
          Cell: ({ cell: { value } }) => (
            <div>{highlightSearchTerm(value, searchTerm)}</div>
          ),
        },
        {
          Header: "Date Published",
          accessor: "date_published",
          Cell: ({ cell: { value } }) => {
            const formattedDate = new Date(value).toISOString().split("T")[0];
            return <div>{highlightSearchTerm(formattedDate, searchTerm)}</div>;
          },
        },
        {
          Header: "DOI",
          accessor: "DOI",
          Cell: ({ cell: { value } }) => (
            <div>{highlightSearchTerm(value, searchTerm)}</div>
          ),
        },
        {
          Header: "Research Type",
          accessor: "research_type",
          Cell: ({ cell: { value } }) => (
            <div>{highlightSearchTerm(value, searchTerm)}</div>
          ),
        },
        {
          Header: "Journal",
          accessor: "journal",
          Cell: ({ cell: { value } }) => (
            <div>{highlightSearchTerm(value, searchTerm)}</div>
          ),
        },
        {
          Header: "Volume",
          accessor: "volume",
          Cell: ({ cell: { value } }) => (
            <div>{highlightSearchTerm(value, searchTerm)}</div>
          ),
        },
        {
          Header: "Pages",
          accessor: "pages",
          Cell: ({ cell: { value } }) => (
            <div>{highlightSearchTerm(value, searchTerm)}</div>
          ),
        },
        {
          Header: "Strength of Claims",
          accessor: "result",
          Cell: ({ cell: { value } }) => (
            <div>{highlightSearchTerm(value, searchTerm)}</div>
          ),
        },
        {
          Header: "SE Methods",
          accessor: "SE_methods",
          Cell: ({ cell: { value } }) => {
            const methodsStr = (value || []).join(", ");
            return <div>{highlightSearchTerm(methodsStr, searchTerm)}</div>;
          },
        },
      ] as Column<Article>[],
    [searchTerm]
  );

  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const toggleRow = (id: string) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  // Initialize the table with columns and data
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns: columns as Column<Article>[], data: filteredArticles });

  return (
    <div className={styles.container}>
      <WelcomeMessage />
      <div className={styles.searchAndSelectorContainer}>
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
        <div className={styles.instructionLine}>
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
        </div>
      </div>
      {noResults ? (
        <p className={styles["error-message"]}>
          No articles found for selection.
        </p>
      ) : (
        <table {...getTableProps()} className={styles.table}>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr
                {...headerGroup.getHeaderGroupProps()}
                className={styles.headerRow}
              >
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps()} className={styles.header}>
                    {column.render("Header")}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row) => {
              prepareRow(row);
              return (
                <React.Fragment key={row.id}>
                  <tr {...row.getRowProps()} className={styles.row}>
                    {row.cells.map((cell) => (
                      <td {...cell.getCellProps()} className={styles.tableData}>
                        {cell.render("Cell")}
                      </td>
                    ))}
                    <td className={styles.tableData}>
                      <button
                        className={`btn ${
                          expandedRow === row.id
                            ? "btn-outline-secondary"
                            : "btn-outline-secondary"
                        }`}
                        onClick={() => toggleRow(row.id)}
                      >
                        {expandedRow === row.id ? "Show less" : "Show more"}
                      </button>
                    </td>
                  </tr>
                  {/* Display additional information for expanded row */}
                  {expandedRow === row.id && (
                    <tr className={styles.expandedRow}>
                      <td colSpan={9} className={styles.expandedCell}>
                        {" "}
                        <ul>
                          <h5 className={styles.spacing}>Claims:</h5>
                          {row.original.claims.map((claim, index) => (
                            <li key={index}>{claim}</li>
                          ))}
                          <h5 className={styles.spacing}>
                            Analyst Review Result:
                          </h5>
                          <p>{row.original.result}</p>
                        </ul>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default UserView;

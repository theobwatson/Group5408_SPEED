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
  SE_methods: string[];
  claims: string[];
};

// Props for passing in a list of articles
type Props = {
  articles: Article[];
};

function highlightSearchTerm(text: string, searchTerm: string): JSX.Element {
  console.log("Highlighting:", text, "with", searchTerm);
  if (!searchTerm || !text) return <>{text}</>;

  const regex = new RegExp(`(${searchTerm})`, "gi");
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, index) => {
        if (regex.test(part)) {
          return (
            <mark className={styles.highlightedText} key={index}>
              {part}
            </mark>
          );
        }
        return <span key={index}>{part}</span>;
      })}
    </>
  );
}

function UserView({ articles }: Props) {
  const [searchTerm, setSearchTerm] = useState("");

  React.useEffect(() => {
    console.log("searchTerm changed to:", searchTerm);
  }, [searchTerm]);

  const filteredArticles = articles.filter((article) => {
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
          Header: "Result",
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
        {
          Header: "Number of Claims",
          accessor: "claims",
          Cell: ({ cell: { value } }) => {
            const claimsCount = value ? String(value.length) : "0";
            return <div>{highlightSearchTerm(claimsCount, searchTerm)}</div>;
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
      <div className={styles.fixedWidthContainer}>
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
        {noResults ? (
          <p className={styles["error-message"]}>
            No articles found for "{searchTerm}"
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
                        <td
                          {...cell.getCellProps()}
                          className={styles.tableData}
                        >
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
                            <h4>Claims:</h4>
                            {row.original.claims.map((claim, index) => (
                              <li key={index}>{claim}</li>
                            ))}
                            <h4>Description:</h4>
                            <p>{row.original.description}</p>
                            <h4>Evidence Result:</h4>
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
    </div>
  );
}

export default UserView;

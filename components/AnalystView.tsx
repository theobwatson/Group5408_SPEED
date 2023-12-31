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
  date_published: string;
  DOI: string;
  journal: string;
  volume: string;
  pages: string;
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

function AnalystView({ articles }: Props) {
  const [searchTerm, setSearchTerm] = useState("");

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
          Header: "Action",
          id: "action",
          Cell: () => <button>Some Action</button>,
        } as any,
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

  // Display a welcome message tailored for an analyst role
  function WelcomeMessage() {
    return (
      <div className={styles.welcomeMessage}>
        <h4>Welcome, Analyst!</h4>
        <p>
          Once an article gets approved by the moderator it's your expertise
          that categorizes and reviews the claims, research types, and the final
          verdicts. Your insights shape the way practitioners evaluate and
          select methods.
        </p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <WelcomeMessage />
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

export default AnalystView;

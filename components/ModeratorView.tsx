// Necessary imports
import React, { useState } from "react";
import { useTable, Column } from "react-table";
import styles from "./styling/UserView.module.css";
import "bootstrap/dist/css/bootstrap.css";

// Represents article data
export type Article = {
  _id: string;
  title: string;
  author: string;
  date_published: string;
  DOI: string;
  journal: string;
  volume: string;
  pages: string;
  inSearchersDb: boolean; // Indicate if article is in the searchers database
  inRejectedDb: boolean; // Indicate if article is in the rejected database
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

// Display a welcome message tailored for a moderator role
function WelcomeMessage() {
  return (
    <div className={styles.welcomeMessage}>
      <h4>Welcome, Moderator!</h4>
      <p>
        Check incoming submissions against our rejected papers database and
        ensure no duplicates exist. Your work ensures the integrity of SPEED.
      </p>
    </div>
  );
}

const refreshPage = () => {
  window.location.reload();
};

function hasDuplicateDOI(prevArticles: Article[]): boolean{
  // Initialize a set to keep track of seen DOIs.
  const seenDOIs = new Set();
  // Iterate through each article in the articles list.
  for (const article of prevArticles) {
  
    // If the DOI of the current article is already in the seenDOIs set, return true.
    if (seenDOIs.has(article.DOI)) {
      return true;
    }
    // Otherwise, add the DOI of the current article to the seenDOIs set.
    seenDOIs.add(article.DOI);
  }
  // If no duplicates were found, return false.
  return false;
};

function ModeratorView({ articles }: Props) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredArticles = articles.filter((article) => {
    // Create an array of all values from each column
    const allColumnValues = Object.values(article).join(" ").toLowerCase();
    // Check if any part of the article contains the search term
    return allColumnValues.includes(searchTerm.toLowerCase());
  });

  // Check if there are no results
  const noResults = filteredArticles.length === 0;

  // Maintain a state to track if the API request is in progress
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [articleList, setArticleList] = useState(articles);

  const handleApprove = async (articleId: string) => {
    const newQueueValue = "analyst";
  
    try {
      setIsLoading(true);
      const response = await fetch("/api/updateArticle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ articleId, newQueueValue }),
      });
  
      if (response.ok) {
        // Update the local state to remove the approved article
        setArticleList((prevArticles: Article[]) =>
          prevArticles.filter((article) => article._id !== articleId)
        );
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }
  
      setIsLoading(false);
    } catch (error) {
      // Handle errors
      console.error("Error updating article:", error);
      setIsLoading(false);
    }
  };
  
  const handleReject = async (articleId: string) => {
    const newQueueValue = "rejected";
  
    try {
      setIsLoading(true);
      const response = await fetch("/api/updateArticle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ articleId, newQueueValue }),
      });
  
      if (response.ok) {
        // Update the local state to remove the rejected article
        setArticleList((prevArticles: Article[]) =>
          prevArticles.filter((article) => article._id !== articleId)
        );
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }
  
      setIsLoading(false);
    } catch (error) {
      // Handle errors
      console.error("Error updating article:", error);
      setIsLoading(false);
    }
  };
  
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
          Header: "Found in SPEED?",
          accessor: "inSearchersDb",
          Cell: ({ cell: { value } }) => (value ? "Yes" : "No"),
        },
        {
          Header: "Previously Rejected?",
          accessor: "inRejectedDb",
          Cell: ({ cell: { value } }) => (value ? "Yes" : "No"),
        },
        {
          Header: "Action",
          id: "action",
          Cell: ({ row }: any) => (
            <>
            <button
              className="btn btn-primary ml-2"
              data-testid="refresh-button"
              onClick={refreshPage}
             >
               Refresh
             </button>
              <button
                className="btn btn-success btn-fixed-width mr-2"
                style={{ marginBottom: "6px" }}
                onClick={() => handleApprove(row.original._id)}
              >
                Approve
              </button>
              <button
                className="btn btn-danger btn-fixed-width"
                onClick={() => handleReject(row.original._id)}
              >
                Reject
              </button>
            </>
          ),
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

  return (
    <div className={styles.container}>
      <WelcomeMessage />
      <div className={styles.fixedWidthContainer}>
        <div className={styles["search-bar"]}>
          <input
            type="text"
            placeholder="Search by Title, Author, or DOI"
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
        {/* ADDED: Render a warning if there are duplicate DOIs */}
        {hasDuplicateDOI(articles) && (
                <p className={styles["error-message"]}>
                    Warning: There are duplicate articles based on DOI!
                </p>
            )}
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

export default ModeratorView;
export { hasDuplicateDOI };
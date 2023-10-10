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
  inSearchersDb: boolean; // Indicate if article is in the searchers database
  inRejectedDb: boolean; // Indicate if article is in the rejected database
};

// Props for passing in a list of articles
type Props = {
  articles: Article[];
};

const refreshPage = () => {
  window.location.reload();
};

function ModeratorView({ articles }: Props) {
  // Maintain a state to track if the API request is in progress
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleApprove = async (articleId: string) => {
    const newQueueValue = "analyst"; // Defined the queue value for clarity
    if (!articleId || !newQueueValue) {
      return console.error("Error: Missing articleId or queue value");
    }

    try {
      setIsLoading(true);
      const response = await fetch("/api/updateArticle", {
        // Updated endpoint to singular
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ articleId, newQueueValue }), // Sending the new variable name
      });

      if (response.ok) {
        refreshPage();
      }
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }

      setIsLoading(false);
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error updating article:", error.message);
      } else {
        console.error("Error updating article:", error);
      }
      setIsLoading(false);
    }
  };

  const handleReject = async (articleId: string) => {
    const newQueueValue = "rejected"; // Defined the queue value for clarity
    if (!articleId || !newQueueValue) {
      return console.error("Error: Missing articleId or queue value");
    }

    try {
      setIsLoading(true);
      const response = await fetch("/api/updateArticle", {
        // Updated endpoint to singular
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ articleId, newQueueValue }), // Sending the new variable name
      });

      if (response.ok) {
        refreshPage();
      }
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }

      setIsLoading(false);
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error updating article:", error.message);
      } else {
        console.error("Error updating article:", error);
      }
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
            <div style={{ width: "150px" }}>{value}</div>
          ),
        },
        { Header: "Author", accessor: "author", width: 150 },
        {
          Header: "Date Published",
          accessor: "date_published",
          Cell: ({ value }: { value: string }) => (
            <span>{new Date(value).toISOString().split("T")[0]}</span>
          ),
        },
        { Header: "DOI", accessor: "DOI" },
        { Header: "Journal", accessor: "journal" },
        { Header: "Volume", accessor: "volume" },
        { Header: "Pages", accessor: "pages" },
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
    []
  );

  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const toggleRow = (id: string) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  // Initialize the table with columns and data
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns: columns as Column<Article>[], data: articles });

  return (
    <div>
      {isLoading ? <div>Processing...</div> : null}
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
                </tr>
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default ModeratorView;

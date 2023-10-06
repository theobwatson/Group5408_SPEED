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
  inSearchersDb: boolean;  // Indicate if article is in the searchers database
  inRejectedDb: boolean;   // Indicate if article is in the rejected database
};

// Props for passing in a list of articles
type Props = {
  articles: Article[];
};

function ModeratorView({ articles }: Props) {
  // Sample queues (arrays) for demonstration
  const [analysisQueue, setAnalysisQueue] = useState<Article[]>([]);
  const [rejectedQueue, setRejectedQueue] = useState<Article[]>([]);

  // Handle approve action
  const handleApprove = (id: string) => {
    console.log(`Article with ID ${id} approved`);

    // Find the article by its ID
    const article = articles.find(article => article._id === id);

    if (article) {
      // Add the article to the analysis queue
      setAnalysisQueue(prevQueue => [...prevQueue, article]);
    }
  };

  // Handle reject action
  const handleReject = (id: string) => {
    console.log(`Article with ID ${id} rejected`);

    // Find the article by its ID
    const article = articles.find(article => article._id === id);

    if (article) {
      // Add the article to the rejected queue
      setRejectedQueue(prevQueue => [...prevQueue, article]);
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
        { Header: "In Searchers DB", accessor: "inSearchersDb", Cell: ({ cell: { value } }) => (value ? "Yes" : "No") },
        { Header: "In Rejected DB", accessor: "inRejectedDb", Cell: ({ cell: { value } }) => (value ? "Yes" : "No") },
        {
          Header: "Action",
          id: "action",
          Cell: ({ row }: any) => (
            <>
              <button onClick={() => handleApprove(row.original._id)}>Approve</button>
              <button onClick={() => handleReject(row.original._id)}>Reject</button>
              
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
            </React.Fragment>
          );
        })}
      </tbody>
    </table>
  );
}

export default ModeratorView;

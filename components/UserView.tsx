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

function UserView({ articles }: Props) {
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
        { Header: "Research Type", accessor: "research_type" },
        { Header: "Journal", accessor: "journal" },
        { Header: "Result", accessor: "result" },
        {
          Header: "SE Methods",
          accessor: "SE_methods",
          Cell: ({ value }: { value: string[] | undefined }) => (
            <span>{(value || []).join(", ")}</span>
          ),
        },
        {
          Header: "Number of Claims",
          accessor: "claims",
          Cell: ({ value }: { value: string[] | undefined }) => (
            <span>{value ? value.length : 0}</span>
          ),
        },
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
  );
}

export default UserView;

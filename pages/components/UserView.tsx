import React, { useState } from "react";
import { useTable, Column } from "react-table";

type Article = {
  _id: string;
  title: string;
  author: string;
  description: string;
  isbn: string;
  SE_methods: string[];
  claims: string[];
};

type Props = {
  articles: Article[];
};

function UserView({ articles }: Props) {
  // Construct columns for react-table
  const columns = React.useMemo(
    () =>
      [
        { Header: "Title", accessor: "title" },
        { Header: "Author", accessor: "author" },
        { Header: "ISBN", accessor: "isbn" },
        {
          Header: "SE Methods",
          accessor: "SE_methods",
          Cell: ({ value }: { value: string[] | undefined }) => (
            <span>{(value || []).join(", ")}</span>
          ),
        },
        {
          Header: "Claims",
          accessor: "claims",
          Cell: ({ value }: { value: string[] }) => (
            <span>{value.join(", ")}</span>
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
    <table {...getTableProps()}>
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <th {...column.getHeaderProps()}>{column.render("Header")}</th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row) => {
          prepareRow(row);
          return (
            <React.Fragment key={row.id}>
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => (
                  <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                ))}
                <td>
                  <button onClick={() => toggleRow(row.id)}>^</button>
                </td>
              </tr>
              {expandedRow === row.id && (
                <tr>
                  <td colSpan={100}></td>
                  <ul>
                    {row.original.claims.map((claim, index) => (
                      <li key={index}>{claim}</li>
                    ))}
                  </ul>
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

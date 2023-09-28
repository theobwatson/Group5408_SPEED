import React, { useState } from "react";
import { useTable } from "react-table";

function UserView({ articles }) {
  // Construct columns for react-table
  const columns = React.useMemo(
    () => [
      { Header: "Title", accessor: "title" },
      { Header: "Author", accessor: "author" },
    ],
    []
  );

  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const toggleRow = (id: string) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  // Initialize the table with columns and data
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data: articles });

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

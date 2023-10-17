// Necessary imports 

import React, { useState } from "react";
import { useTable, Column } from "react-table";
import styles from "./styling/AnalystView.module.css";
import "bootstrap/dist/css/bootstrap.css";

//when rejected- queue = rejected, accepted- queue = user 

//will have action column, goes either accept or reject, if accepted -got to show more - text box to input claims - text box for SE methods - 2 buttons for result of review/ evidence - disagree or agree  

//button for submit - goes to user 

// Represents article data 

enum claimsStatus {
  Agree = 'Agree',
  Disagree = 'Disagree'
}

type Article = {

  _id: string;
  title: string;
  author: string;
  description: string;
  date_published: string;
  DOI: string;
  result: string;  //approve or disprove the claims 
  journal: string;
  volume: string;
  pages: string;
  claims: string[];

};

// Props for passing in a list of articles 

type Props = {

  articles: Article[];

};

function AnalystView({ articles }: Props) {

  // Construct columns for react-table 

  // Construct columns for react-table 

  const [userClaims, setUserClaims] = useState<string[]>([]);
  const [claimsInput, setClaimsInput] = useState<string>('');

  const [status, setStatus] = useState<claimsStatus | null>(null);
  const [data, setData] = useState<Article[]>(articles);

  const [seMethodsInput, setSeMethodsInput] = useState<string>('');
  const [seMethods, setSeMethods] = useState<string[]>([]);

  const handleSEMethodsSubmission = () => {
    const methodsArray = seMethodsInput.split(',').map(method => method.trim());
    setSeMethods(methodsArray);
  };

  const handleClaimsSubmission = () => {
    const claimsArray = claimsInput.split(',').map(claim => claim.trim());
    setUserClaims(claimsArray);
  };

  const updateResult = (id: string, newResult: string) => {

    setData((prevData) => {

      return prevData.map((article) =>

        article._id === id ? { ...article, result: newResult } : article
      );
    });
  };

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
            <span>{Array.isArray(value) ? value.length : 0}</span>
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
    useTable({ columns: columns as Column<Article>[], data: data });
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
                    className={`btn ${expandedRow === row.id

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

                  <div style={{ display: 'flex', flexDirection: 'row' }}>
        
                    <div style={{ flex: 1 }}>
                    
                    {" "}
                    
                    <ul>
                      

                     
                      <h4>Evidence Result:  <br /> <br /></h4>
                        <button 
                        className={`${styles["btn-analyst"]} ${styles["btn-rounded"]} `}
                        onClick={() => updateResult(row.original._id, 'Accept')}> Accept
                        </button>
                        <button 
                        className={`${styles["btn-analyst"]} ${styles["btn-rounded"]} `}
                        onClick={() => updateResult(row.original._id, 'Reject')}> Reject
                        </button> 
                        
                        
                      <br /> <br />
                      
                      <h4>Claims:</h4>
                        {/* Render user input for claims */}
                          <div>
                          <input 
                            type="text" 
                            value={claimsInput} 
                            onChange={(e) => setClaimsInput(e.target.value)}
                            placeholder="Enter claims separated by commas"
                            style={{ width: '300px' }}
                          />
                          <button 
                            className={`${styles["btn-analyst"]} ${styles["btn-rounded"]} `}

                            //className="btn-analyst"
                            //style={{ backgroundColor: 'blue', color: 'white', marginLeft: '10px' }}
                          onClick={handleClaimsSubmission}>
                            Submit Claims
                          </button>
                        </div>

                        {/* Render stored user claims */}
                        <ul>
                          {userClaims.map((claim, index) => (
                            <li key={index}>{claim}</li>
                          ))}
                        </ul>
                      
                        {/* Render the original claims */}
                        <ul>
                          {Array.isArray(row.original.claims) && row.original.claims.map((claim, index) => (
                            <li key={index}>{claim}</li>
                          ))}
                        </ul>
                        
                        <br />
                        

                         {/* New section for the "Agree with Claims" and "Disagree with Claims" buttons */}
                          <div>
                            
                            <button
                              //className={styles["btn-analyst"]}
                              className={`${styles["btn-analyst"]} ${styles["btn-rounded"]} ${styles["btn-green"]}`}

                              //className="btn-analyst btn-rounded btn-green"
                              //style={{ backgroundColor: 'green', color: 'white', marginRight: '10px' }}
                              onClick={() => setStatus(claimsStatus.Agree)}>
                              Agree with Claims
                            </button>
                            
                            <br/>
                            <br/>
                            <button
                              className={`${styles["btn-analyst"]} ${styles["btn-rounded"]} ${styles["btn-green"]}`}

                              //className="btn-analyst btn-rounded btn-red"
                              style={{ backgroundColor: 'red', color: 'white' }}
                              onClick={() => setStatus(claimsStatus.Disagree)}>
                              Disagree with claims
                            </button>
                          </div>
                          
                          
                          <br />
                          <br />
                          
                          <div ></div>
                            {/* Right side of the expanded row */}
                            <div >
                            <h4>SE Methods:</h4>
                            
                              <input 
                                type="text" 
                                value={seMethodsInput} 
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSeMethodsInput(e.target.value)}
                                placeholder="Enter SE Methods separated by commas"
                                style={{ width: '300px' }}
                              />
                              <button 
                                className={`${styles["btn-analyst"]} ${styles["btn-rounded"]}`}
                                onClick={handleSEMethodsSubmission}>
                                Submit SE Methods
                              </button>
                            </div> 
                          
                            <ul>
                              {seMethods.map((method, index) => (
                                <li key={index}>{method}</li>
                              ))}
                            </ul>
                            
                          <br />

                      <p>{row.original.result}</p>

                    </ul>
                    </div>
                    </div>
                  </td>

                </tr> //END OF LEFT SIDE

               

              )}

            </React.Fragment>

          );

        })}

      </tbody>

    </table>

  );

}

export default AnalystView;





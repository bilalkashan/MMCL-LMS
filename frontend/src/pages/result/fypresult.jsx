import React, { useState, useEffect } from "react";
import styles from "./fypresult.module.css";
import Taskbar from "../taskbar/taskbar";
import Futtor from "../futtor/futtor";
import api from "../../api";

const fypResultDepartment = [
  {
    name: "FYP I",
    
    icon: "💻",
  },
  {
    name: "FYP II",
    icon: "💻",
  },
];

const FYPResult = () => {
  const [results, setResults] = useState([]);
  const [selectedPanel, setSelectedPanel] = useState("p1");
  const [selectedFyp, setSelectedFyp] = useState(null);

  const handleFyptClick = (dept) => {
    setSelectedFyp(dept);
  };

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      const response = await api.get("/fetchresults");
      if (Array.isArray(response.data.results)) {
        setResults(response.data.results);
      } else {
        console.error("Unexpected response format", response.data);
      }
    } catch (error) {
      console.error("Error fetching results:", error);
    }
  };

  const filteredResults = results.filter(
    (result) =>
      result.groupName.toLowerCase().startsWith(selectedPanel.toLowerCase() + "-") &&
      result.fypType === selectedFyp?.name
  );

  return (
    <div>
      <Taskbar />
      <div className={styles.container}>
        {!selectedFyp ? (
          <>
            <h1 className={styles.header}>Select FYP Type</h1>
            <div className={styles.departmentCards}>
              {fypResultDepartment.map((dept, index) => (
                <div
                  key={index}
                  className={styles.dashboardCard}
                  onClick={() => handleFyptClick(dept)}
                >
                  <div className={styles.fypicon}>{dept.icon}</div>
                  <h2>{dept.name}</h2>
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <h1 className={styles.header}>
              {selectedFyp.name} Results - Panel {selectedPanel.toUpperCase()}
            </h1>

            <div className={styles.panelSelector}>
              {["p1", "p2", "p3", "p4", "p5"].map((panel) => (
                <button
                  key={panel}
                  className={`${styles.panelButton} ${
                    selectedPanel === panel ? styles.active : ""
                  }`}
                  onClick={() => setSelectedPanel(panel)}
                >
                  Panel {panel.toUpperCase()}
                </button>
              ))}
            </div>

            <div className={styles.tableWrapper}>
              <div style={{ overflowX: "auto" }}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th className={styles.tableHeader}>S.No</th>
                      <th className={styles.tableHeader}>Group Number</th>
                      <th className={styles.tableHeader}>Reg No</th>
                      <th className={styles.tableHeader}>Project Title</th>
                      <th className={styles.tableHeader}>Advisor Name</th>
                      <th className={styles.tableHeader}>Panel Remarks</th>
                      <th className={styles.tableHeader}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredResults.map((result, index) => (
                      <tr key={result._id} className={styles.tableRow}>
                        <td className={styles.tableCell}>{index + 1}</td>
                        <td className={styles.tableCell}>{result.groupName}</td>
                        <td className={styles.tableCell}>
                          {result.registrationNumbers.join(" / ")}
                        </td>
                        <td className={styles.tableCell}>{result.projectTitle}</td>
                        <td className={styles.tableCell}>{result.advisorName}</td>
                        <td className={styles.tableCell}>{result.remarks}</td>
                        <td className={styles.tableCell}>{result.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
      <Futtor />
    </div>
  );
};

export default FYPResult;
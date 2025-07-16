// Result.js (React Component)
import React, { useState, useEffect } from "react";
import styles from "./result.module.css";
import Sidebar from "../admin/sidebar/sidebar";
import AddResult from "./addResult";
import api from "../api";

const fypResultDepartment = [
  { name: "FYP I", icon: "💻" },
  { name: "FYP II", icon: "💻" },
];

const Result = () => {
  const [results, setResults] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [confirmation, setConfirmation] = useState(null);
  const [selectedFyp, setSelectedFyp] = useState(null);
  const [selectedPanel, setSelectedPanel] = useState("p1");

  const handleFyptClick = (dept) => {
    setSelectedFyp(dept);
  };

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

  useEffect(() => {
    fetchResults();
  }, []);

  const deleteresult = (resultId) => {
    setConfirmation({
      type: "delete",
      message: "Are you sure you want to delete this result?",
      onConfirm: async () => {
        try {
          await api.delete(`/deleteresult?id=${resultId}`);
          fetchResults();
          setConfirmation(null);
        } catch (error) {
          console.error("Error deleting result:", error);
        }
      },
      onCancel: () => setConfirmation(null),
    });
  };

  const handleAddClick = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  const handleresultAdded = (newResult) => setResults((prev) => [...prev, newResult]);

  const filteredResults = results.filter(
    (result) =>
      result.groupName.toLowerCase().startsWith(selectedPanel.toLowerCase() + "-") &&
      result.fypType === selectedFyp?.name
  );

  return (
    <div className={styles.container}>
      <Sidebar title="Admin" roleName="Habib Ur Rehman" />
      {!selectedFyp ? (
        <>
          <h1 className={styles.header}>Select FYP Type</h1>
          <div className={styles.departmentCards}>
            {fypResultDepartment.map((dept, index) => (
              <div key={index} className={styles.dashboardCard} onClick={() => handleFyptClick(dept)}>
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
                className={`${styles.panelButton} ${selectedPanel === panel ? styles.active : ""}`}
                onClick={() => setSelectedPanel(panel)}
              >
                Panel {panel.toUpperCase()}
              </button>
            ))}
          </div>

          <div className={styles["table-wrapper"]}>
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
                  <th className={styles.tableHeader}>Delete</th>
                </tr>
              </thead>
              <tbody>
                {filteredResults.map((result, index) => (
                  <tr key={result._id} className={styles.tableRow}>
                    <td className={styles.tableCell}>{index + 1}</td>
                    <td className={styles.tableCell}>{result.groupName}</td>
                    <td className={styles.tableCell}>{result.registrationNumbers.join(" / ")}</td>
                    <td className={styles.tableCell}>{result.projectTitle}</td>
                    <td className={styles.tableCell}>{result.advisorName}</td>
                    <td className={styles.tableCell}>{result.remarks}</td>
                    <td className={styles.tableCell}>
                      {result.status.charAt(0).toUpperCase() + result.status.slice(1)}
                    </td>
                    <td>
                      <button className={styles.deleteButton} onClick={() => deleteresult(result._id)}>
                        X
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button className={styles.fab} onClick={handleAddClick}>+</button>

          {showModal && (
            <AddResult
              onClose={handleCloseModal}
              onResultAdded={handleresultAdded}
              selectedFyp={selectedFyp.name}
            />
          )}

          {confirmation && (
            <div className={styles.confirmationModal}>
              <div className={styles.modalContent}>
                <p>{confirmation.message}</p>
                <div className={styles.modalButtons}>
                  <button className={styles.confirmButton} onClick={confirmation.onConfirm}>Yes</button>
                  <button className={styles.cancelButton} onClick={confirmation.onCancel}>No</button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Result;
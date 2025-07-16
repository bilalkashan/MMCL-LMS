import React, { useState, useEffect } from "react";
import styles from "./projectIdea.module.css";
import Sidebar from "../sidebar/sidebar";
import AddProejectIdea from "./addProjectIdea";
import api from "../../api";

const ProjectIdea = () => {
  const [openIdeas, setOpenIdeas] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [confirmation, setConfirmation] = useState(null);

  const fetchProjectIdea = async () => {
    try {
      const response = await api.get("/fetchProjectIdea");
      if (Array.isArray(response.data.openIdeas)) {
        setOpenIdeas(response.data.openIdeas);
      } else {
        console.error("Unexpected response format", response.data);
      }
    } catch (error) {
      console.error("Error fetching project ideas:", error);
    }
  };

  useEffect(() => {
    fetchProjectIdea();
  }, []);


  const deleteProjectIdea = (projectId) => {
    setConfirmation({
      type: "delete",
      message: "Are you sure you want to delete this project idea?",
      onConfirm: async () => {
        try {
          await api.delete(`/deleteProjectIdea?id=${projectId}`);
          fetchProjectIdea();
          setConfirmation(null);
        } catch (error) {
          console.error("Error deleting project idea:", error);
        }
      },
      onCancel: () => setConfirmation(null),
    });
  };

  const handleAddClick = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  const handleProjectAdded = (newProjectIdea) => {
    setOpenIdeas((prev) => [...prev, newProjectIdea]);
  };

  return (
    <div className={styles.container}>
      <Sidebar title="Admin" roleName="Habib Ur Rehman" />
      <h1 className={styles.header}>Open Ideas</h1>

      <div className={styles["table-wrapper"]}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.tableHeader}>S.No</th>
              <th className={styles.tableHeader}>Topic</th>
              <th className={styles.tableHeader}>Description</th>
              <th className={styles.tableHeader}>Case Study</th>
              <th className={styles.tableHeader}>Technology</th>
              <th className={styles.tableHeader}>Action</th>
            </tr>
          </thead>
          <tbody>
            {openIdeas.map((idea, index) => (
              <tr key={idea._id} className={styles.tableRow}>
                <td className={styles.tableCell}>{index + 1}</td>
                <td className={styles.tableCell}>{idea.topic}</td>
                <td className={styles.tableCell}>{idea.description}</td>
                <td className={styles.tableCell}>{idea.caseStudy}</td>
                <td className={styles.tableCell}>{idea.technology}</td>
                <td>
                  <button
                    className={styles.deleteButton}
                    onClick={() => deleteProjectIdea(idea._id)}
                  >
                    X
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button className={styles.fab} onClick={handleAddClick}>Add</button>

      {showModal && (
        <AddProejectIdea
          onClose={handleCloseModal}
          onProjectAdded={handleProjectAdded}
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
    </div>
  );
};

export default ProjectIdea;
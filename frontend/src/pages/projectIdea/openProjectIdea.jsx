import React, { useState, useEffect } from "react";
import styles from "./openProjectIdea.module.css";
import Taskbar from "../taskbar/taskbar";
import Futtor from "../futtor/futtor";
import api from "../../api";

const OPenProjectIdea = () => {
  const [projectIdeas, setProjectIdeas] = useState([]);

  const fetchProjectIdea = async () => {
    try {
      const response = await api.get("/fetchProjectIdea");
      if (Array.isArray(response.data.openIdeas)) {
        setProjectIdeas(response.data.openIdeas);
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


  return (
    <div>
      <Taskbar />
      <div className={styles.container}>
        <h1 className={styles.header}>Open Project Ideas</h1>

        {/* Results Table */}
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.tableHeader}>S.No</th>
                <th className={styles.tableHeader}>Topic</th>
                <th className={styles.tableHeader}>Description</th>
                <th className={styles.tableHeader}>Case Study</th>
                <th className={styles.tableHeader}>Technology</th>
              </tr>
            </thead>
            <tbody>
              {projectIdeas.map((projectIdea, index) => (
                <tr key={projectIdea._id} className={styles.tableRow}>
                  <td className={styles.tableCell}>{index + 1}</td>
                  <td className={styles.tableCell}>{projectIdea.topic}</td>
                  <td className={styles.tableCell}>{projectIdea.description}</td>
                  <td className={styles.tableCell}>{projectIdea.caseStudy}</td>
                  <td className={styles.tableCell}>{projectIdea.technology}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Futtor />
    </div>
  );
};

export default OPenProjectIdea;
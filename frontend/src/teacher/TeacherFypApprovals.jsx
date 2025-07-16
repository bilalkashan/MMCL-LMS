import React, { useEffect, useState } from "react";
import styles from "./teacherFypApproval.module.css";
import api from "../api";
import Sidebar from "../admin/sidebar/sidebar"; 

const TeacherFypApprovals = () => {
  const [submissions, setSubmissions] = useState([]);

  const fetchFyps = async () => {
    try {
      const res = await api.get("/fyp/get-all");
      setSubmissions(res.data.data);
    } catch (error) {
      console.error("Error fetching FYPs:", error);
    }
  };

  const handleAction = async (fypId, status) => {
    try {
      await api.put("/approve-reject", { fypId, status });
      fetchFyps(); 
    } catch (error) {
      console.error(`Error ${status} FYP:`, error);
    }
  };

  useEffect(() => {
    fetchFyps();
  }, []);

  return (
    <>
      <Sidebar />
      <div className={styles.container}>
        <h1 className={styles.heading}>Submitted FYPs</h1>
        <div className={styles.grid}>
          {submissions.length === 0 ? (
            <p>No FYPs submitted yet.</p>
          ) : (
            submissions.map((fyp) => (
              <div key={fyp._id} className={styles.card}>
                <h3>{fyp.title}</h3>
                <p><strong>Description:</strong> {fyp.description}</p>
                <p><strong>Group Members:</strong> {fyp.groupMembers.join(", ")}</p>
                <p><strong>Student:</strong> {fyp.studentId?.name} ({fyp.studentId?.email})</p>
                <p><strong>Project Link:</strong> <a href={fyp.projectLink} target="_blank" rel="noreferrer">View</a></p>
                {fyp.srs && <p><a href={fyp.srs} target="_blank" rel="noreferrer">SRS File</a></p>}
                {fyp.sds && <p><a href={fyp.sds} target="_blank" rel="noreferrer">SDS File</a></p>}
                {fyp.video && <p><a href={fyp.video} target="_blank" rel="noreferrer">Video Demo</a></p>}
                <div className={styles.actions}>
                  <button onClick={() => handleAction(fyp._id, "approved")} className={styles.approve}>Approve</button>
                  <button onClick={() => handleAction(fyp._id, "rejected")} className={styles.reject}>Reject</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default TeacherFypApprovals;

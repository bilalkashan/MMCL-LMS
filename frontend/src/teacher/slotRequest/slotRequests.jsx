import React, { useEffect, useState } from "react";
import styles from "./slotRequests.module.css";
import Sidebar from "../../admin/sidebar/sidebar";
import { handleError, handleSuccess } from "../../toast";
import api from "../../api";

const SlotRequests = () => {
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");
  const [currentFeedbackId, setCurrentFeedbackId] = useState(null);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("loggedInUser"));
        const adviseremail = user?.email;
        if (!adviseremail) {
          setError("Adviser email not found.");
          return;
        }

        const res = await api.get(
          `/getAdviserRequestsForTeacher/${adviseremail}`
        );
        setRequests(res.data.requests || []);
      } catch (err) {
        setError("Failed to fetch requests.");
        console.error("Error fetching teacher requests:", err);
      }
    };

    fetchRequests();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.put(`/updateRequestStatus/${id}`, {
        status: newStatus,
      });
      setRequests((prev) =>
        prev.map((req) =>
          req._id === id ? { ...req, status: newStatus } : req
        )
      );
      handleSuccess(`Request ${newStatus}`);
    } catch (err) {
      handleError("Failed to update request status.");
      console.error(err);
    }
  };

  const openFeedbackModal = (id) => {
    setCurrentFeedbackId(id);
    setFeedbackText("");
    setIsModalOpen(true);
  };

  const submitFeedback = async () => {
    if (!feedbackText.trim()) return;

    try {
      await api.put(`/updateRequestFeedback/${currentFeedbackId}`, {
        feedback: feedbackText.trim(),
      });
      setRequests((prev) =>
        prev.map((req) =>
          req._id === currentFeedbackId ? { ...req, feedback: feedbackText.trim() } : req
        )
      );
      setIsModalOpen(false);
      handleSuccess("Feedback submitted!");
    } catch (err) {
      handleError("Failed to submit feedback.");
      console.error(err);
    }
  };

  return (
    <div className={styles.container}>
      <Sidebar />
      <div className={styles.mainContent}>
        <h1 className={styles.header}>Student Slot Requests</h1>
        {error && <p className={styles.errorText}>{error}</p>}

        {requests.length === 0 ? (
          <p className={styles.noRequests}>No requests found.</p>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr className={styles.tableHeader}>
                  <th>S.No</th>
                  <th>Student Email</th>
                  <th>Slot</th>
                  <th>Message</th>
                  <th>Status</th>
                  <th>Actions</th>
                  <th>Feedback</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((req, index) => (
                  <tr className={styles.tableRow} key={req._id}>
                    <td className={styles.tableCell}>{index + 1}</td>
                    <td className={styles.tableCell}>{req.studentEmail}</td>
                    <td className={styles.tableCell}>{req.slotName}</td>
                    <td className={styles.tableCell}>{req.message}</td>
                    <td className={styles.tableCell}>{req.status}</td>
                    <td className={styles.tableCell}>
                      <div className={styles.inlineButtons}>
                        {req.status === "pending" && (
                          <>
                            <button
                              className={styles.acceptBtn}
                              onClick={() => handleStatusChange(req._id, "accepted")}
                            >
                              Accept
                            </button>
                            <button
                              className={styles.rejectBtn}
                              onClick={() => handleStatusChange(req._id, "rejected")}
                            >
                              Reject
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                    <td className={styles.tableCell}>
                      <div className={styles.inlineButtons}>
                        {req.status === "accepted" && !req.feedback ? (
                          <button
                            className={styles.feedbackBtn}
                            onClick={() => openFeedbackModal(req._id)}
                          >
                            Give Feedback
                          </button>
                        ) : req.feedback ? (
                          req.feedback
                        ) : (
                          "N/A"
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {isModalOpen && (
          <div className={styles.modalOverlay}>
            <div className={styles.modal}>
              <h2>Enter Feedback</h2>
              <textarea
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                className={styles.textarea}
                placeholder="Write your feedback here..."
              />
              <div className={styles.modalButtons}>
                <button onClick={submitFeedback} className={styles.feedbackBtn}>Submit</button>
                <button onClick={() => setIsModalOpen(false)} className={styles.rejectBtn}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SlotRequests;
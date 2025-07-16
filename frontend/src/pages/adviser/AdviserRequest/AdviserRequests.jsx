import React, { useState, useEffect } from "react";
import styles from "./AdviserRequests.module.css";
import { handleSuccess, handleError } from "../../../toast";
import Taskbar from "../../taskbar/taskbar";
import Futtor from "../../futtor/futtor";
import api from "../../../api";

const AdviserRequests = () => {
  const [requests, setRequests] = useState([]);
  const [advisers, setAdvisers] = useState([]);
  const [message, setMessage] = useState("");
  const [selectedAdviserId, setSelectedAdviserId] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchRequests();
    fetchAdvisers();
  }, []);

  const fetchRequests = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("loggedInUser"));
      console.log("Fetching requests for user:", user.email);
      const res = await api.get(`/getStudentRequests/${user.email}`);
      setRequests(res.data.requests || []);
    } catch (err) {
      console.error("Error fetching requests:", err);
    }
  };

  const fetchAdvisers = async () => {
    try {
      const res = await api.get("/getAllAdvisers");
      const withOpenSlots = res.data.filter(a =>
        a.slots.some(s => s.status === "open")
      );
      setAdvisers(withOpenSlots);
    } catch (err) {
      console.error("Error fetching advisers:", err);
    }
  };

  const sendRequest = async () => {
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    const adviser = advisers.find(a => a._id === selectedAdviserId);
    const openSlot = adviser?.slots.find(slot => slot.status === "open");

    if (!adviser || !message.trim()) {
      return handleError("Fill all fields. Adviser must have an open slot.");
    }

    try {
      await api.post("/sendAdviserRequest", {
        adviserId: adviser._id,
        adviserName: adviser.name,
        slotName: openSlot.slotName,
        studentEmail: user.email,
        message,
      });
      handleSuccess("Request sent!");
      setShowModal(false);
      setMessage("");
      setSelectedAdviserId("");
      fetchRequests();
    } catch (error) {
      console.error("Error:", error);
      handleError("Failed to send request");
    }
  };

  return (
    <div>
      <Taskbar />
      <div className={styles.container}>
        <h1 className={styles.header}>Your Adviser Requests</h1>

        {requests.length === 0 ? (
  <p>No requests found.</p>
) : (
    <div className={styles.tableContainer}>
    <div className={styles.tableHeader}>
      <span>Adviser</span>
      <span>Slot</span>
      <span>Status</span>
      <span>Message</span>
      <span>Feedback</span> 
    </div>
    {requests.map((req) => (
      <div key={req._id} className={styles.tableRow}>
        <span>{req.adviserName}</span>
        <span>{req.slotName}</span>
        <span className={`${styles.status} ${styles[req.status.toLowerCase()]}`}>
          {req.status}
        </span>
        <span>{req.message}</span>
        <span>{req.feedback ? req.feedback : "N/A"}</span> 
      </div>
    ))}
  </div>
  
)}


        <button className={styles.fab} onClick={() => setShowModal(true)}>+</button>

        {showModal && (
          <div className={styles.modalOverlay}>
            <div className={styles.modal}>
              <h3>Send Adviser Request</h3>
              <select
                value={selectedAdviserId}
                onChange={(e) => setSelectedAdviserId(e.target.value)}
              >
                <option value="">Select Adviser</option>
                {advisers.map(a => (
                  <option key={a._id} value={a._id}>{a.name}</option>
                ))}
              </select>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your message..."
              />
              <div className={styles.modalActions}>
                <button onClick={sendRequest}>Send</button>
                <button onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
      <Futtor />
    </div>
  );
};

export default AdviserRequests;
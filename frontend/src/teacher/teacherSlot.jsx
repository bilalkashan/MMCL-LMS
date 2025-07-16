import React, { useState, useEffect } from "react";
import styles from "../admin/adviser/AdviserSlots.module.css";
import Sidebar from "../admin/sidebar/sidebar";
import ConfirmationModal from "../admin/adviser/ConfirmationModal";
import { handleError } from "../toast";
import api from "../api";

const TeacherSlots = () => {
  const [advisers, setAdvisers] = useState([]);
  const [confirmation, setConfirmation] = useState(null);


  useEffect(() => {
    fetchAdvisers();
  }, []);

  const fetchAdvisers = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("loggedInUser"));  
      const response = await api.get(`/getAllAdvisers`, {
        headers: {
          role: user.role,
          email: user.email, 
        },
      });
      setAdvisers(response.data);
    } catch (error) {
      console.error("Error fetching advisers:", error);
    }
  };
  
  

  const handleSlotChange = (adviserId, slotIndex, newStatus) => {
    if (newStatus === "reserved") {
      setConfirmation({
        type: "reservation",
        message: "Enter student registration numbers:",
        onConfirm: ({ reg1, reg2 }) => updateSlotStatus(adviserId, slotIndex, newStatus, reg1, reg2),
        onCancel: () => setConfirmation(null),
      });
    } else {
      updateSlotStatus(adviserId, slotIndex, newStatus);
    }
  };

  const updateSlotStatus = async (adviserId, slotIndex, newStatus, reg1 = null, reg2 = null) => {
    try {
      if (newStatus === "reserved") {
        if (!reg1 || !reg2) {
          handleError("Both registration numbers are required.");
          return;
        }
        if (reg1 === reg2) {
          handleError("Registration numbers must be different.");
          return;
        }
      }

      const response = await api.put(`/update-slot/${adviserId}/${slotIndex}`, {
        status: newStatus,
        reg1,
        reg2,
      });

      if (!response.data.success) {
        handleError(response.data.message);
        return;
      }

      fetchAdvisers();
      setConfirmation(null);
    } catch (error) {
      if (error.response?.data?.message) {
        handleError("Error: " + error.response.data.message);
      } else {
        console.error("Error updating slot status:", error);
        alert("An unexpected error occurred while updating the slot.");
      }
    }
  };

  const getSlotColor = (status) => {
    switch (status) {
      case "reserved":
        return "red";
      case "open":
        return "green";
      case "unavailable":
        return "gray";
      default:
        return "lightgray";
    }
  };

  return (
    <div className={styles.container}>
      <Sidebar />
      <h1 className={styles.header}>My Slots</h1>
      <div className={styles["table-wrapper"]}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.tableHeader}>S. No.</th>
              <th className={styles.tableHeader}>Name</th>
              <th className={styles.tableHeader}>Email</th>
              <th className={styles.tableHeader}>Specialization</th>
              <th className={styles.tableHeader}>Slots</th>
            </tr>
          </thead>
          <tbody>
            {advisers.map((adviser, index) => (
              <tr key={adviser._id} className={styles.tableRow}>
                <td className={styles.tableCell}>{index + 1}</td>
                <td className={styles.tableCell}>{adviser.name}</td>
                <td className={styles.tableCell}>{adviser.email}</td>
                <td className={styles.tableCell}>{adviser.specialization}</td>
                <td className={styles.tableCell}>
                  <div className={styles.slotContainer}>
                    {adviser.slots.map((slot, slotIndex) => (
                      <div
                        key={slot.slotName}
                        className={styles.slotBox}
                        style={{ backgroundColor: getSlotColor(slot.status) }}
                      >
                        <div>{slot.slotName}</div>
                        {slot.status === "reserved" && (
                          <div className={styles.reservedInfo}>
                            <div>Reg1: {slot.reservedBy.reg1}</div>
                            <div>Reg2: {slot.reservedBy.reg2}</div>
                          </div>
                        )}
                        <select
                          value={slot.status}
                          onChange={(e) =>
                            handleSlotChange(adviser._id, slotIndex, e.target.value)
                          }
                          className={styles.slotSelect}
                        >
                          <option value="reserved">Reserved</option>
                          <option value="open">Open</option>
                          <option value="unavailable">Unavailable</option>
                        </select>
                      </div>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {confirmation && (
        <ConfirmationModal
          type={confirmation.type}
          message={confirmation.message}
          onConfirm={confirmation.onConfirm}
          onCancel={confirmation.onCancel}
        />
      )}
    </div>
  );
};

export default TeacherSlots;
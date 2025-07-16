import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./AdviserSlots.module.css";
import Sidebar from "../sidebar/sidebar";
import AddAdviserModal from "./AddAdviserModal";
import ConfirmationModal from "./ConfirmationModal";
import { handleError } from "../../toast";
import api from "../../api";

const AdviserSlots = () => {
    const [advisers, setAdvisers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [confirmation, setConfirmation] = useState(null);

    useEffect(() => {
        fetchAdvisers();
    }, []);

    const fetchAdvisers = async () => {
        try {
            const response = await api.get(`/getAllAdvisers`);
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
    
            const response = await axios.put(`http://localhost:8080/auth/update-slot/${adviserId}/${slotIndex}`, {
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

    const deleteAdviser = (adviserId) => {
        setConfirmation({
            type: "delete",
            message: "Are you sure you want to delete this adviser?",
            onConfirm: async () => {
                try {
                    await axios.delete(`http://localhost:8080/auth/deleteAdviser`, {
                        data: { id: adviserId },
                    });
                    fetchAdvisers();
                    setConfirmation(null);
                } catch (error) {
                    console.error("Error deleting adviser:", error);
                }
            },
            onCancel: () => setConfirmation(null),
        });
    };

    const handleAddClick = () => setShowModal(true);

    const handleCloseModal = () => setShowModal(false);

    const handleAdviserAdded = (newAdviser) => {
        setAdvisers((prevAdvisers) => [...prevAdvisers, newAdviser]);
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
            <h1 className={styles.header}>Adviser Availability</h1>
            <div className={styles["table-wrapper"]}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th className={styles.tableHeader}>S. No.</th>
                            <th className={styles.tableHeader}>Name</th>
                            <th className={styles.tableHeader}>Email</th>
                            <th className={styles.tableHeader}>Specialization</th>
                            <th className={styles.tableHeader}>Slots</th>
                            <th className={styles.tableHeader}>Delete</th>
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
                                <td>
                                    <button
                                        className={styles.deleteButton}
                                        onClick={() => deleteAdviser(adviser._id)}
                                    >
                                        X
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <button className={styles.fab} onClick={handleAddClick}>
                +
            </button>
            {showModal && (
                <AddAdviserModal onClose={handleCloseModal} onAdviserAdded={handleAdviserAdded} />
            )}
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

export default AdviserSlots;
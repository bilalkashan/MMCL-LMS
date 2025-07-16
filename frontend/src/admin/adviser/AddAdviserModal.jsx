import React, { useState } from "react";
import styles from "./AddAdviserModal.module.css";
import { handleError, handleSuccess } from "../../toast";
import api from "../../api";

const AddAdviserModal = ({ onClose, onAdviserAdded }) => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        specialization: "",
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async () => {
        try {
            const response = await api.post(`/addAdviser`, formData);

            const { success, message, adviser } = response.data;

            if (success) {
                handleSuccess(message);
                if (onAdviserAdded) {
                    onAdviserAdded(adviser); 
                }
                onClose(); 
            } else {
                handleError(message || "Something went wrong.");
            }
        } catch (error) {
            console.error("Error adding adviser:", error);

            if (error.response?.data?.message) {
                handleError(error.response.data.message);
            } else {
                handleError("Failed to add adviser. Please try again.");
            }
        }
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <h2>Add New Adviser</h2>
                <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={formData.name}
                    onChange={handleInputChange}
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleInputChange}
                />
                <input
                    type="text"
                    name="specialization"
                    placeholder="Specialization"
                    value={formData.specialization}
                    onChange={handleInputChange}
                />
                <div className={styles.buttonGroup}>
                    <button onClick={handleSubmit}>Save</button>
                    <button onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default AddAdviserModal;
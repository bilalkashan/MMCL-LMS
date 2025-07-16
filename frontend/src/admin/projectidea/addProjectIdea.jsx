import React, { useState } from "react";
import styles from "./addProjectIdea.module.css";
import { handleError, handleSuccess } from "../../toast";
import api from "../../api";

const AddProejectIdea = ({ onClose, onProjectAdded }) => {
    const [formData, setFormData] = useState({
        topic: "",
        description: "",
        caseStudy: "",
        technology: "",
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const validateForm = () => {
        const startsWithNumber = (str) => /^\d/.test(str);

        if (
            !formData.topic ||
            !formData.description ||
            !formData.caseStudy ||
            !formData.technology
        ) {
            return "All fields are required.";
        }

        if (
            startsWithNumber(formData.topic) ||
            startsWithNumber(formData.description) ||
            startsWithNumber(formData.caseStudy)
        ) {
            return "Topic, Description, and Case Study must not start with a number.";
        }

        return null;
    };

    const handleSubmit = async () => {
        const validationError = validateForm();
        if (validationError) {
            handleError(validationError);
            return;
        }

        try {
            const response = await api.post("/addProjectIdea", {
                topic: formData.topic,
                description: formData.description,
                caseStudy: formData.caseStudy,
                technology: formData.technology,
            });

            const { success, message, openIdea } = response.data;

            if (success) {
                handleSuccess(message);
                if (onProjectAdded) {
                    onProjectAdded(openIdea);
                }
                onClose();
            } else {
                handleError(message || "Something went wrong...");
            }
        } catch (error) {
            console.error("Error adding project idea:", error);

            if (error.response?.data?.message) {
                handleError(error.response.data.message);
            } else {
                handleError("Failed to add project idea. Please try again.");
            }
        }
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <h2>Add Project Idea</h2>
                <input
                    type="text"
                    name="topic"
                    placeholder="Project Topic"
                    value={formData.topic}
                    onChange={handleInputChange}
                />
                <input
                    type="text"
                    name="description"
                    placeholder="Add project description..."
                    value={formData.description}
                    onChange={handleInputChange}
                />
                <input
                    type="text"
                    name="caseStudy"
                    placeholder="Add case study..."
                    value={formData.caseStudy}
                    onChange={handleInputChange}
                />
                <input
                    type="text"
                    name="technology"
                    placeholder="Add project technology..."
                    value={formData.technology}
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

export default AddProejectIdea;
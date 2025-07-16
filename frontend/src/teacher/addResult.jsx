import React, { useState, useEffect } from "react";
import styles from "./addResult.module.css";
import { handleError, handleSuccess } from "../toast";
import api from "../api";

const AddResult = ({ onClose, onResultAdded }) => {
  const [formData, setFormData] = useState({
    groupName: "",
    registration1: "",
    registration2: "",
    projectTitle: "",
    advisorName: "",
    remarks: "",
    status: "",
    fypType: "",
  });

  const [loadingGroupInfo, setLoadingGroupInfo] = useState(false);

  useEffect(() => {
    const fetchGroupData = async () => {
      const groupNameTrimmed = formData.groupName.trim();
      if (!groupNameTrimmed) return;

      setLoadingGroupInfo(true);
      try {
        const res = await api.get(
          `/get-group-info/${groupNameTrimmed}`
        );
        if (res.data.success) {
          const {
            registrationNumbers,
            projectTitle,
            adviserName, // advisorName in form but API returns adviserName, map accordingly
          } = res.data;

          if (registrationNumbers?.length === 2) {
            setFormData((prev) => ({
              ...prev,
              registration1: registrationNumbers[0],
              registration2: registrationNumbers[1],
              projectTitle: projectTitle || "",
              advisorName: adviserName || "",
            }));
          }
        } else {
          // Clear related fields if group not found
          setFormData((prev) => ({
            ...prev,
            registration1: "",
            registration2: "",
            projectTitle: "",
            advisorName: "",
          }));
          console.warn("Group info not found:", res.data.message);
        }
      } catch (err) {
        console.warn("Group not found or error fetching group info.", err);
        setFormData((prev) => ({
          ...prev,
          registration1: "",
          registration2: "",
          projectTitle: "",
          advisorName: "",
        }));
      } finally {
        setLoadingGroupInfo(false);
      }
    };

    fetchGroupData();
  }, [formData.groupName]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Prevent manual changes on registration numbers, projectTitle and advisorName fields
    if (
      (name === "registration1" ||
        name === "registration2" ||
        name === "projectTitle" ||
        name === "advisorName") &&
      loadingGroupInfo
    ) {
      return; // ignore changes while loading group info
    }

    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const validateForm = () => {
    const groupRegex = /^p\d-\d{2}$/i;
    const regRegex = /^(18|19|20|21)\d{5}$/;
    const statusLower = formData.status.trim().toLowerCase();

    const {
      groupName,
      registration1,
      registration2,
      projectTitle,
      advisorName,
      remarks,
      status,
      fypType,
    } = formData;

    if (
      !groupName ||
      !registration1 ||
      !registration2 ||
      !projectTitle ||
      !advisorName ||
      !remarks ||
      !status ||
      !fypType
    ) {
      return "All fields are required.";
    }

    if (!groupRegex.test(groupName)) {
      return "Group name must be in format like 'p4-02'.";
    }

    if (!regRegex.test(registration1) || !regRegex.test(registration2)) {
      return "Registration numbers must start with 18, 19, 20, or 21.";
    }

    if (registration1 === registration2) {
      return "Both registration numbers must be different.";
    }

    if (statusLower !== "passed" && statusLower !== "fail") {
      return "Status must be either 'Passed' or 'Fail'.";
    }

    if (!["FYP I", "FYP II"].includes(fypType.trim())) {
      return "FYP Type must be either 'FYP I' or 'FYP II'.";
    }

    return null;
  };

  const handleSubmit = async () => {
    const validationError = validateForm();
    if (validationError) {
      handleError(validationError);
      return;
    }

    const registrationNumbers = [
      formData.registration1.trim(),
      formData.registration2.trim(),
    ];

    try {
      const response = await api.post("/addResults", {
        groupName: formData.groupName.trim(),
        registrationNumbers,
        projectTitle: formData.projectTitle.trim(),
        advisorName: formData.advisorName.trim(),
        remarks: formData.remarks.trim(),
        status:
          formData.status.trim().charAt(0).toUpperCase() +
          formData.status.trim().slice(1).toLowerCase(),
        fypType: formData.fypType.trim(),
      });

      const { success, message, result } = response.data;

      if (success) {
        handleSuccess(message);
        if (onResultAdded) onResultAdded(result);
        onClose();
      } else {
        handleError(message || "Something went wrong.");
      }
    } catch (error) {
      console.error("Error adding result:", error);
      if (error.response?.data?.message) {
        handleError(error.response.data.message);
      } else {
        handleError("Failed to add result. Please try again.");
      }
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>Add New Result</h2>
        <input
          type="text"
          name="groupName"
          placeholder="Group Name"
          value={formData.groupName}
          onChange={handleInputChange}
          autoFocus
        />

        <input
          type="text"
          name="registration1"
          placeholder="Reg No 1"
          value={formData.registration1}
          readOnly
        />

        <input
          type="text"
          name="registration2"
          placeholder="Reg No 2"
          value={formData.registration2}
          readOnly
        />

        <input
          type="text"
          name="projectTitle"
          placeholder="Project Title"
          value={formData.projectTitle}
          readOnly
        />

        <input
          type="text"
          name="advisorName"
          placeholder="Advisor Name"
          value={formData.advisorName}
          readOnly
        />

        <input
          type="text"
          name="remarks"
          placeholder="Panel Remarks"
          value={formData.remarks}
          onChange={handleInputChange}
        />

        <select
          name="status"
          value={formData.status}
          onChange={handleInputChange}
          required
        >
          <option value="">Select Status</option>
          <option value="Passed">Passed</option>
          <option value="Fail">Fail</option>
        </select>

        <select
          name="fypType"
          value={formData.fypType}
          onChange={handleInputChange}
        >
          <option value="">Select FYP Type</option>
          <option value="FYP I">FYP 1</option>
          <option value="FYP II">FYP 2</option>
        </select>

        <div className={styles.buttonGroup}>
          <button onClick={handleSubmit}>Save</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default AddResult;
import React, { useState, useEffect } from "react";
import styles from "./UploadFypModal.module.css";
import { handleSuccess, handleError } from "../../toast";
import api from "../../api";

const UploadFypModal = ({ onClose }) => {
  const [formData, setFormData] = useState({
    title: "",
    groupMembers: "",
    description: "",
    projectLink: "",
    adviserId: "",
    srs: null,
    sds: null,
    video: null,
  });

  const [errors, setErrors] = useState({});
  const [advisers, setAdvisers] = useState([]);

  useEffect(() => {
    const fetchAdvisers = async () => {
      try {
        const res = await api.get("/getAllAdvisers");
        setAdvisers(res.data);
      } catch (err) {
        console.error("Error fetching advisers:", err);
      }
    };
    fetchAdvisers();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("loggedInUser"));
      const data = new FormData();

      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("projectLink", formData.projectLink);
      data.append("adviserId", formData.adviserId);
      data.append("groupMembers", JSON.stringify(formData.groupMembers.split(",").map(m => m.trim())));
      data.append("srs", formData.srs);
      data.append("sds", formData.sds);
      data.append("video", formData.video);
      data.append("studentId", user._id);

      await api.post("/fyp/submit-fyp", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      handleSuccess("FYP submitted successfully and sent for adviser approval!");
      onClose();
    } catch (err) {
      if (err.response?.data?.message) {
        handleError(err.response.data.message);
      }
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h2>Upload FYP Details</h2>

        <input name="title" onChange={handleChange} placeholder="Project Title" value={formData.title} />
        <input name="groupMembers" onChange={handleChange} placeholder="Group Members (comma separated)" value={formData.groupMembers} />
        <textarea name="description" onChange={handleChange} placeholder="Description" value={formData.description} />
        <input name="projectLink" onChange={handleChange} placeholder="Project Link" value={formData.projectLink} />

        {/* Adviser Select */}
        <select name="adviserId" onChange={handleChange} value={formData.adviserId}>
          <option value="">Select Adviser</option>
          {advisers.map((adviser) => (
            <option key={adviser._id} value={adviser._id}>
              {adviser.name} ({adviser.specialization})
            </option>
          ))}
        </select>

        {/* File Inputs */}
        <label>SRS (PDF): <input type="file" name="srs" accept="application/pdf" onChange={handleChange} /></label>
        <label>SDS (PDF): <input type="file" name="sds" accept="application/pdf" onChange={handleChange} /></label>
        <label>Short Video: <input type="file" name="video" accept="video/*" onChange={handleChange} /></label>

        <div className={styles.actions}>
          <button onClick={handleSubmit}>Submit</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default UploadFypModal;

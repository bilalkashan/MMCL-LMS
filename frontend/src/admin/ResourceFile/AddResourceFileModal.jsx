import React, { useState } from 'react';
import styles from './AnnouncementModel.module.css';
import { handleError, handleSuccess } from '../../toast';
import api from '../../api';

const AddResourceFileModal = ({ onClose, onSave }) => {
  const [fileName, setFileName] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!fileName || !description || !file) {
    handleError("All fields are required!");
    return;
  }

  const formData = new FormData();
  formData.append("fileName", fileName);
  formData.append("description", description);
  formData.append("file", file);

  try {
    const response = await api.post(
      "/addResourceFile",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    onSave(response.data.resourceFile);
    handleSuccess("Resource file added successfully!");
    onClose();
  } catch (error) {
    console.error("Error uploading file:", error);
    handleError("Failed to upload file.");
  }
};


  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2 className={styles.modalTitle}>Add Resource File</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="fileName"
            placeholder="File Name"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            className={styles.input}
          />
          <textarea
            name="description"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={styles.textarea}
          />
          <input
            type="file"
            name="file"
            onChange={(e) => setFile(e.target.files[0])}
            className={styles.input}
          />
          <div className={styles.buttonGroup}>
            <button type="submit" className={styles.saveButton}>
              Save
            </button>
            <button type="button" className={styles.cancelButton} onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddResourceFileModal;
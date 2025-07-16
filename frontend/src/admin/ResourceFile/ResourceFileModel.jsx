import React, { useState } from 'react';
import styles from './AnnouncementModel.module.css'; // Rename this CSS file if it's shared
import { handleError, handleSuccess } from '../../toast';
import api from '../../api';

const ResourceFileModel = ({ resourceFile, onClose, onSave }) => {
  const [fileName, setFileName] = useState(resourceFile.fileName || '');
  const [description, setDescription] = useState(resourceFile.description || '');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!fileName.trim() || !description.trim()) {
      handleError("File name and description are required");
      return;
    }

    const formData = new FormData();
    formData.append('fileName', fileName);
    formData.append('description', description);
    if (file) {
      formData.append('file', file);
    }

    setLoading(true);
    try {
      const response = await api.put(
        `/updateResourceFile/${resourceFile._id}`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );

      handleSuccess("Resource file updated successfully!");
      onSave(response.data.resourceFile); // Notify parent
      onClose(); // Close modal
    } catch (error) {
      console.error('Error updating resource file:', error);
      handleError("Failed to update resource file");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2 className={styles.modalTitle}>Update Resource File</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="fileName"
            placeholder="File Name"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            className={styles.input}
            disabled={loading}
          />
          <textarea
            name="description"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={styles.textarea}
            disabled={loading}
          />
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            className={styles.input}
            disabled={loading}
          />
          <div className={styles.buttonGroup}>
            <button type="submit" className={styles.saveButton} disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </button>
            <button type="button" className={styles.cancelButton} onClick={onClose} disabled={loading}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResourceFileModel;
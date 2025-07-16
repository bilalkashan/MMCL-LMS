import React, { useState } from 'react';
import styles from './AnnouncementModel.module.css';
import { handleError, handleSuccess } from '../../toast';
import api from '../../api';

const AnnouncementModal = ({ announcement, onClose, onSave }) => {
  const [title, setTitle] = useState(announcement.title);
  const [description, setDescription] = useState(announcement.description);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!title || !description ){
      handleError("All fields are Required")

    }
    try {
      const response = await api.put(
        `/updateAnnouncement/${announcement._id}`,
        { title, description }
      );
      onSave(response.data.announcement); 
      onClose(); 
      handleSuccess("Announcement added successfully!")
    } catch (error) {
      console.error('Error updating announcement:', error);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2 className={styles.modalTitle}>Update Announcement</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={styles.input}
          />
          <textarea
            name="description"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={styles.textarea}
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

export default AnnouncementModal;
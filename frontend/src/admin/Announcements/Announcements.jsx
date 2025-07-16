import React, { useState, useEffect } from 'react';
import AddAnnouncementModal from './AddAnnouncementModal';
import styles from './Anouncments.module.css';
import AnnouncementModal from './AnnouncementModel';
import Sidebar from '../sidebar/sidebar';
import api from '../../api';

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [editAnnouncement, setEditAnnouncement] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await api.get('http://localhost:8080/auth/fetchAnnouncements');
        setAnnouncements(response.data.announcements);
      } catch (error) {
        console.error('Error fetching announcements:', error);
      }
    };

    fetchAnnouncements();
  }, []);

  const handleDelete = async (_id) => {
    try {
      await api.delete(`http://localhost:8080/auth/deleteAnnouncement/${_id}`);
      setAnnouncements((prevAnnouncements) =>
        prevAnnouncements.filter((announcement) => announcement._id !== _id)
      );
    } catch (error) {
      console.error('Error deleting announcement:', error);
    }
  };

  const handleUpdate = (announcement) => {
    setEditAnnouncement(announcement);
  };

  const handleAdd = () => {
    setIsAddModalOpen(true);
  };

  const handleModalClose = () => {
    setEditAnnouncement(null);
    setIsAddModalOpen(false);
  };

  const updateAnnouncementInState = (announcements, updatedAnnouncement) =>
    announcements.map((announcement) =>
      announcement._id === updatedAnnouncement._id ? updatedAnnouncement : announcement
    );

  const handleSave = (updatedAnnouncement) => {
    setAnnouncements((prevAnnouncements) =>
      updateAnnouncementInState(prevAnnouncements, updatedAnnouncement)
    );
    handleModalClose();
  };

  const handleAddSave = (newAnnouncement) => {
    setAnnouncements((prevAnnouncements) => [newAnnouncement, ...prevAnnouncements]);
    handleModalClose();
  };

  return (
    <div className={styles.announcementsContainer}>
      <Sidebar />
    <div className={styles.container}>
      <h2 className={styles.heading}>Announcements</h2>
      <div className={styles.announcementList}>
        {announcements.length === 0 ? (
          <p>No announcements available.</p>
        ) : (
          announcements.map((announcement) => (
            <div key={announcement._id} className={styles.announcementCard}>
              <div className={styles.announcementContent}>
                <h3 className={styles.title}>{announcement.title}</h3>
                <p className={styles.description}>{announcement.description}</p>
              </div>
              <div className={styles.buttonContainer}>
                <button
                  className={styles.updateButton}
                  onClick={() => handleUpdate(announcement)}
                >
                  Update
                </button>
                <button
                  className={styles.deleteButton}
                  onClick={() => handleDelete(announcement._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      <div className={styles.addButtonContainer}>
        <button className={styles.addButton} onClick={handleAdd}>
          Add Announcement
        </button>
      </div>

      {editAnnouncement && (
        <AnnouncementModal
          announcement={editAnnouncement}
          onClose={handleModalClose}
          onSave={handleSave}
        />
      )}

      {isAddModalOpen && (
        <AddAnnouncementModal onClose={handleModalClose} onSave={handleAddSave} />
      )}
    </div>
    </div>
  );
};

export default Announcements;
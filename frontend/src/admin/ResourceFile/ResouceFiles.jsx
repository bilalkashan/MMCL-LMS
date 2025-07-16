import React, { useState, useEffect } from 'react';
import AddResourceFileModal from './AddResourceFileModal';
import ResourceFileModel from './ResourceFileModel';
import Sidebar from '../sidebar/sidebar';
import styles from './ResourceFiles.module.css'; 
import api from '../../api';

const ResourceFiles = () => {
  const [resourceFiles, setResourceFiles] = useState([]);
  const [editFile, setEditFile] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    const fetchResourceFiles = async () => {
      try {
        const response = await api.get('/fetchResourceFiles');
        setResourceFiles(response.data.resourceFiles);
      } catch (error) {
        console.error('Error fetching resource files:', error);
      }
    };

    fetchResourceFiles();
  }, []);

  const handleDelete = async (_id) => {
    try {
      await api.delete(`/deleteResourceFile/${_id}`);
      setResourceFiles((prevFiles) =>
        prevFiles.filter((file) => file._id !== _id)
      );
    } catch (error) {
      console.error('Error deleting resource file:', error);
    }
  };

  const handleUpdate = (file) => {
    setEditFile(file);
  };

  const handleAdd = () => {
    setIsAddModalOpen(true);
  };

  const handleModalClose = () => {
    setEditFile(null);
    setIsAddModalOpen(false);
  };

  const updateFileInState = (files, updatedFile) =>
    files.map((file) =>
      file._id === updatedFile._id ? updatedFile : file
    );

  const handleSave = (updatedFile) => {
    setResourceFiles((prevFiles) =>
      updateFileInState(prevFiles, updatedFile)
    );
    handleModalClose();
  };

  const handleAddSave = (newFile) => {
    setResourceFiles((prevFiles) => [newFile, ...prevFiles]);
    handleModalClose();
  };

  return (
    <div className={styles.announcementsContainer}>
      <Sidebar />
      <div className={styles.container}>
        <h2 className={styles.heading}>Resource Files</h2>
        <div className={styles.announcementList}>
          {resourceFiles.length === 0 ? (
            <p>No resource files available.</p>
          ) : (
            resourceFiles.map((file) => (
              <div key={file._id} className={styles.announcementCard}>
                <div className={styles.announcementContent}>
                  <h3 className={styles.title}>{file.fileName}</h3>
                  <p className={styles.description}>{file.description}</p>
                  {file.filePath && (
                    <a
                      href={`http://localhost:8080/${file.filePath}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.link}
                    >
                      Download
                    </a>
                  )}
                </div>
                <div className={styles.buttonContainer}>
                  <button
                    className={styles.updateButton}
                    onClick={() => handleUpdate(file)}
                  >
                    Update
                  </button>
                  <button
                    className={styles.deleteButton}
                    onClick={() => handleDelete(file._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        <div className={styles.addButtonContainer}>
          <button className={styles.fab} onClick={handleAdd}>
            Add File
          </button>
        </div>

        {editFile && (
          <ResourceFileModel
            resourceFile={editFile}
            onClose={handleModalClose}
            onSave={handleSave}
          />
        )}

        {isAddModalOpen && (
          <AddResourceFileModal
            onClose={handleModalClose}
            onSave={handleAddSave}
          />
        )}
      </div>
    </div>
  );
};

export default ResourceFiles;
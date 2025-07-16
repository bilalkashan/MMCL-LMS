import React from 'react';
import styles from "./resourceFile.module.css";
import api from '../../api';

const ResourceFileCard = ({ file }) => {

  const handleDownload = async (file) => {
  try {
    const response = await api.get(`/downloadResourceFile/${file._id}`, {
      responseType: "blob",
    });

    const blob = new Blob([response.data], { type: file.fileType });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", file.fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error("Download failed:", error);
  }
};

  return (
    <div className={styles.card}>
      <h3 className={styles.cardName}>{file.fileName}</h3>
      <p className={styles.cardDesc}>{file.description}</p>
      <button onClick={() => handleDownload(file)}>Download</button>
    </div>
  );
};

export default ResourceFileCard;
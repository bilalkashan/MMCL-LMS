import React from "react";
import styles from "./advisor.module.css";

const Advisor = ({ title, disc, image }) => {
  return (
    <div className={styles.advisorCard}>
      <img src={image} alt={title} className={styles.advisorImage} />
      <div className={styles.advisorDetails}>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.disc}>{disc}</p>
      </div>
    </div>
  );
};

export default Advisor;
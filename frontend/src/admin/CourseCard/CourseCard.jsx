import React from 'react';
import styles from './CourseCard.module.css';  

const CourseCard = ({ value, title, description, cardClass, onClick }) => {
  return (
    <div className={`${styles.cardContainer} ${cardClass}`} onClick={onClick}>
      <h2>{value}</h2>
      <p>{title}</p>
      {/* <span className={styles.moreInfoText}>{description}</span> */}
    </div>
  );
};

export default CourseCard;
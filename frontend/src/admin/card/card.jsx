import React from 'react';
import styles from './card.module.css';  

const Card = ({ value, title, description, cardClass, onClick }) => {
  return (
    <div className={`${styles.cardContainer} ${cardClass}`} onClick={onClick}>
      <h2>{value}</h2>
      <p>{title}</p>
      <span className={styles.moreInfoText}>{description}</span>
    </div>
  );
};

export default Card;
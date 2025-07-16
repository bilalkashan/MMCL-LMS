import React from 'react'
import styles from "./dataSet.module.css";

const DatasetCard = (props) => {
  return (
    <div className={styles.card}>
        <img src={props.image} className={styles.cardImg} alt=''/>
        <h3 className={styles.cardName}>{props.name}</h3>
        <p className={styles.cardDesc}>{props.desc}</p>
        <a href={props.link} className={styles.btn1} target="_blank" rel="noopener noreferrer">
            Download
        </a>
    </div>
  )
}

export default DatasetCard;
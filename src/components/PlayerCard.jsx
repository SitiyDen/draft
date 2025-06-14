import React from 'react';
import styles from './PlayerCard.module.css';

const PlayerCard = ({ photoUrl, name, elo, points, country }) => (
  <div className={styles.card}>
    <h3 className={styles.name}>{name}</h3>
    <img src={photoUrl} alt={name} className={styles.photo} />
    <div className={styles.info}> 
      <div className={styles.stats}>
        <div className={styles.elo}><strong>ELO:</strong> {elo}</div>
        <div><strong>GG:</strong> {points}</div>
        <div>{country}</div>
      </div>
    </div>
  </div>
);

export default PlayerCard;
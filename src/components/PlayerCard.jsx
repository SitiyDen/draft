import React, { useState } from 'react';
import styles from './PlayerCard.module.css';

const PlayerCard = ({ photoUrl, name, elo, gg, points, country, bio, large, onSelect, winrate, gamesPlayed, bonus, onClose }) => {
  const ggValue = gg !== undefined ? gg : points;
  if (large) {
    return (
      <div className={styles.cardLarge}>
        <button className={styles.closeBtn} onClick={onClose} title="Закрыть">×</button>
        <div className={styles.nameLarge}>{name}</div>
        <div className={styles.largeContentRow}>
          <img src={photoUrl} alt={name} className={styles.photoLarge} />
          <div className={styles.largeStatsBlock}>
            <div className={styles.largeStat}><span>ELO:</span> <b>{elo}</b></div>
            <div className={styles.largeStat}><span>GG:</span> <b>{ggValue}</b></div>
            {country && <div className={styles.largeStat}><span>Страна:</span> <b>{country.flag} {country.name}</b></div>}
            {winrate !== undefined && (
              <div className={styles.largeStat}><span>Винрейт:</span> <b>{winrate}%</b></div>
            )}
            {gamesPlayed !== undefined && (
              <div className={styles.largeStat}><span>Сыграно игр:</span> <b>{gamesPlayed}</b></div>
            )}
            {bonus !== undefined && (
              <div className={styles.largeStat}><span>Доп. баллы:</span> <b>{bonus}</b></div>
            )}
          </div>
        </div>
        {bio && <div className={styles.bio}>{bio}</div>}
        {onSelect && (
          <button className={styles.selectBtn} onClick={onSelect}>Выбрать</button>
        )}
      </div>
    );
  }

  return (
    <div className={styles.card}>
      <h3 className={styles.name}>{name}</h3>
      <img src={photoUrl} alt={name} className={styles.photo} />
      <div className={styles.info}>
        <div className={styles.stats}>
          <div className={styles.elo}><strong>ELO:</strong> {elo}</div>
          <div><strong>GG:</strong> {ggValue}</div>
          <div>{country?.flag} {country?.name}</div>
        </div>
      </div>
    </div>
  );
};

export default PlayerCard;
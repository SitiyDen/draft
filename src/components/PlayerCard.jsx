import React, { useState, useRef } from 'react';
import styles from './PlayerCard.module.css';
import { motion } from 'framer-motion';

const PlayerCard = ({
  photoUrl,
  name,
  elo,
  gg,
  points,
  country,
  bio,
  large,
  onSelect,
  winrate,
  gamesPlayed,
  bonus,
  onClose,
  isAuthenticated,
}) => {
  const ggValue = gg !== undefined ? gg : points;
  const [selectedEffect, setSelectedEffect] = useState(false);

  // Создаем аудио объект один раз
  const selectSound = useRef(null);
  if (!selectSound.current) {
    selectSound.current = new Audio('/select.mp3');
  }

  const handleSelect = () => {
    if (selectedEffect) return; // блокируем повторный клик во время анимации

    selectSound.current.play().catch(e => {
      console.log('Ошибка воспроизведения звука:', e);
    });

    setSelectedEffect(true);

    setTimeout(() => {
      if (onSelect) onSelect();
      setSelectedEffect(false);
    }, 1500);
  };

  if (large) {
    return (
      <>
        {selectedEffect && (
          <motion.div
            className={styles.flashOverlay}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 0.8, scale: 3 }}
            exit={{ opacity: 0, scale: 4 }}
            transition={{ duration: 1.0, ease: "easeOut" }}
          />
        )}

        <motion.div
          className={styles.cardLarge}
          initial={{ opacity: 0, scale: 0.85, y: 40 }}
          animate={{
            opacity: 1,
            scale: selectedEffect ? 1.1 : 1,
            y: 0,
          }}
          exit={{ opacity: 0, scale: 0.95, y: 40 }}
          transition={{ duration: 0.45, ease: [0.25, 1, 0.5, 1] }}
        >
          <button className={styles.closeBtn} onClick={onClose} title="Закрыть">
            ×
          </button>
          <div className={styles.nameLarge}>{name}</div>
          <div className={styles.largeContentRow}>
            <img src={photoUrl} alt={name} className={styles.photoLarge} />
            <div className={styles.largeStatsBlock}>
              <div className={styles.largeStat}>
                <span>ELO:</span> <b>{elo}</b>
              </div>
              <div className={styles.largeStat}>
                <span>GG:</span> <b>{ggValue}</b>
              </div>
              {country && (
                <div className={styles.largeStat}>
                  <span>Страна:</span> <b>{country.flag} {country.name}</b>
                </div>
              )}
              {winrate !== undefined && (
                <div className={styles.largeStat}>
                  <span>Винрейт:</span> <b>{winrate}%</b>
                </div>
              )}
              {gamesPlayed !== undefined && (
                <div className={styles.largeStat}>
                  <span>Сыграно игр:</span> <b>{gamesPlayed}</b>
                </div>
              )}
              {bonus !== undefined && (
                <div className={styles.largeStat}>
                  <span>Доп. баллы:</span> <b>{bonus}</b>
                </div>
              )}
            </div>
          </div>
          {bio && <div className={styles.bio}>{bio}</div>}
          {onSelect && isAuthenticated && (
            <button
              className={styles.selectBtn}
              onClick={handleSelect}
              disabled={selectedEffect}
            >
              Выбрать
            </button>
          )}
        </motion.div>
      </>
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

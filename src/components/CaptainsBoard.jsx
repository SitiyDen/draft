import React, { useRef, useEffect, useState } from 'react';
import styles from './CaptainsBoard.module.css';
import logo512 from '../logo512.png';

const CommandPanel = ({ onShuffle, freePlayersCount }) => (
  <div className={styles.commandPanel}>
    <div className={styles.freePlayersInfo}>
      Свободных игроков: <span>{freePlayersCount}</span>
    </div>
    <button className={styles.shuffleBtn} onClick={onShuffle}>Перемешать капитанов</button>
  </div>
);

const TeamMiniCard = ({ player }) => (
  <div className={styles.teamMiniCard}>
    {player?.photoUrl ? (
      <img src={player.photoUrl} alt={player.name} className={styles.teamMiniPhoto} />
    ) : (
      <div className={styles.teamMiniPhoto + ' ' + styles.emptyPhoto}></div>
    )}
    <div className={styles.teamMiniName}>{player?.name || ''}</div>
  </div>
);

const CaptainCard = ({ captain, onClick, isFlipped, onCountryChange }) => {
  // Получаем команду капитана из player1/player2/player3
  const teamPlayers = [captain.player1, captain.player2, captain.player3].filter(Boolean);
  const totalElo = teamPlayers.reduce((acc, p) => acc + (Number(p?.elo) || 0), 0) + (Number(captain.elo) || 0);
  const count = teamPlayers.length + 1;
  const avgElo = count > 0 ? Math.round(totalElo / count) : 0;
  const totalGG = teamPlayers.reduce((acc, p) => acc + (Number(p?.gg) !== undefined ? Number(p.gg) : (Number(p?.points) || 0)), 0) + (Number(captain.gg) !== undefined ? Number(captain.gg) : (Number(captain.points) || 0));

  return (
    <div
      className={styles.captainCard + (isFlipped ? ' ' + styles.captainCardFlipped : '')}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default', perspective: '800px' }}
    >
      <div className={styles.captainCardInner}>
        <div className={styles.captainCardFront}>
          <div className={styles.captainHeader}>
            <div className={styles.captainNumber}>#{captain.number}</div>
            <div className={styles.captainName}>{captain.name}</div>
          </div>
          <div className={styles.captainCountry}>
            <span className={styles.captainFlag}>{captain.country?.flag}</span>
            <span className={styles.captainCountryName}>{captain.country?.name}</span>
          </div>
          <div className={styles.captainPhotoWrapper}>
            <img src={captain.photoUrl} alt={captain.name} className={styles.captainPhoto} />
          </div>
          <div className={styles.captainStatsBottom}>
            <span>ELO: <b>{avgElo}</b></span>
            <span>GG: <b>{totalGG}</b></span>
          </div>
          <div className={styles.teamListMini}>
            {[0, 1, 2].map((i) =>
              captain[`player${i+1}`] ? (
                <TeamMiniCard key={i} player={captain[`player${i+1}`]} />
              ) : (
                <TeamMiniCard key={i} player={null} />
              )
            )}
          </div>
        </div>
        <div className={styles.captainCardBack}></div>
      </div>
    </div>
  );
};

const CaptainsBoard = ({captains, onCaptainClick, onShuffle, shuffleAnimation, boardRef, freePlayersCount, onCountryChange }) => {

  const flyingLayerRef = useRef();
  const [flippedIdx, setFlippedIdx] = useState(null);

  const handleCardClick = (captain, idx) => {
    setFlippedIdx(idx);
    setTimeout(() => {
      setFlippedIdx(null);
      onCaptainClick && onCaptainClick(captain);
    }, 700); // длительность flip
  };

  useEffect(() => {
    if (!shuffleAnimation || !boardRef?.current) return;
    const cards = Array.from(boardRef.current.querySelectorAll('.' + styles.captainCard));
    const flyingLayer = flyingLayerRef.current;
    if (!flyingLayer) return;
    flyingLayer.innerHTML = '';
    // Центр сбора — центр экрана
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    // Получаем новые позиции для spread (после рандома)
    const newRects = cards.map(card => card.getBoundingClientRect());
    cards.forEach((card, idx) => {
      const rect = card.getBoundingClientRect();
      const clone = card.cloneNode(true);
      clone.className = styles.captainCard + ' ' + styles.captainCardFlying;
      clone.style.position = 'absolute';
      clone.style.left = rect.left + 'px';
      clone.style.top = rect.top + 'px';
      clone.style.width = rect.width + 'px';
      clone.style.height = rect.height + 'px';
      // gather: в центр экрана
      const gatherX = centerX - rect.left - rect.width / 2;
      const gatherY = centerY - rect.top - rect.height / 2;
      // spread: из центра в новую позицию (рандом)
      const spreadX = newRects[idx].left - rect.left;
      const spreadY = newRects[idx].top - rect.top;
      clone.style.setProperty('--gather-x', `${gatherX}px`);
      clone.style.setProperty('--gather-y', `${gatherY}px`);
      clone.style.setProperty('--spread-x', `${spreadX}px`);
      clone.style.setProperty('--spread-y', `${spreadY}px`);
      flyingLayer.appendChild(clone);
    });
    cards.forEach(card => { card.style.visibility = 'hidden'; });
    setTimeout(() => {
      cards.forEach(card => { card.style.visibility = ''; });
      flyingLayer.innerHTML = '';
    }, 5000);
  }, [shuffleAnimation, boardRef]);

  return (
    <div style={{ position: 'relative' }}>
      <img src={logo512} alt="Logo" className={styles.logoTopLeft} />
      <CommandPanel onShuffle={onShuffle} freePlayersCount={freePlayersCount} />
      <div className={styles.captainsBoard} ref={boardRef}>
        
        {Array.isArray(captains) && captains.map((captain, idx) => (
          <CaptainCard
            key={idx}
            captain={captain}
            onClick={() => handleCardClick(captain, idx)}
            isFlipped={flippedIdx === idx}
            onCountryChange={country => onCountryChange && onCountryChange(idx, country)}
          />
        ))}
      </div>
      <div ref={flyingLayerRef} style={{ position: 'fixed', left: 0, top: 0, width: '100vw', height: '100vh', pointerEvents: 'none', zIndex: 9999 }} />
    </div>
  );
};

export default CaptainsBoard;

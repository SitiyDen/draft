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

const CaptainCard = ({ captain, onClick, isFlipped }) => {
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

// Функция перемешивания массива (Fisher-Yates)
const shuffleArray = (arr) => {
  const newArr = [...arr];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
};

const CaptainsBoard = ({ captains: initialCaptains, onCaptainClick, freePlayersCount, isAuthenticated }) => {
  const boardRef = useRef(null);
  const flyingLayerRef = useRef(null);
const [captains, setCaptains] = useState(() =>
  Array.isArray(initialCaptains) ? initialCaptains : []
);
  const [flippedIdx, setFlippedIdx] = useState(null);
  const [isShuffling, setIsShuffling] = useState(false);

useEffect(() => {
  if (Array.isArray(initialCaptains) && initialCaptains.length > 0) {
    setCaptains(initialCaptains);
  }
}, [initialCaptains]);

  const handleCardClick = (captain, idx) => {
    setFlippedIdx(idx);
    setTimeout(() => {
      setFlippedIdx(null);
      onCaptainClick && onCaptainClick(captain);
    }, 700); // длительность flip
  };

 const handleShuffle = async () => {
  if (isShuffling) return; // блокируем повторный запуск
  if (!boardRef.current || !flyingLayerRef.current) return;

  const cards = Array.from(boardRef.current.querySelectorAll('.' + styles.captainCard));
  const flyingLayer = flyingLayerRef.current;
  flyingLayer.innerHTML = '';

  // Текущие позиции
  const oldRects = cards.map(card => card.getBoundingClientRect());

  // Клоны карточек для анимации
  cards.forEach((card, idx) => {
    const rect = oldRects[idx];
    const clone = card.cloneNode(true);
    clone.className = styles.captainCard + ' ' + styles.captainCardFlying;
    clone.style.position = 'absolute';
    clone.style.left = rect.left + 'px';
    clone.style.top = rect.top + 'px';
    clone.style.width = rect.width + 'px';
    clone.style.height = rect.height + 'px';
    flyingLayer.appendChild(clone);
    card.style.visibility = 'hidden';
  });

  setIsShuffling(true);

  // Центр экрана
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;

  // Анимация сбора в центр
  flyingLayer.childNodes.forEach((clone, idx) => {
    const rect = oldRects[idx];
    const gatherX = centerX - rect.left - rect.width / 2;
    const gatherY = centerY - rect.top - rect.height / 2;

    clone.style.transition = 'transform 700ms ease-in-out';
    clone.style.transform = `translate(${gatherX}px, ${gatherY}px) scale(1.1) rotate(10deg)`;
    clone.style.zIndex = 1000 + idx;
  });

  // Через 700 мс перемешиваем и вызываем сервер
  setTimeout(async () => {
    const newOrder = shuffleArray(captains);

    try {
      // Формируем данные для сервера, например, передаём номера капитанов в новом порядке
      const payload = {
        action: 'shuffleCaptains',
        numbers: newOrder.map(c => c.number),
      };

      const scriptUrl = 'https://script.google.com/macros/s/AKfycbxJO4Gx5HRrnb4d_fJXzT9PV1WKZMpMqKH9-ln8oRxR7BdlHxPcCfu_WDHuR2rOA2US/exec';

      const formData = new FormData();
      formData.append('action', 'shuffleCaptains'); 

      const res = await fetch(scriptUrl, {
        method: 'POST',
        body: formData
      });

      const json = await res.json();
      if (!json.success) {
        console.error('Ошибка на сервере при перемешивании:', json.error);
        setIsShuffling(false);
        // Можно показать ошибку пользователю
        return;
      }

      // Если сервер ответил успешно, обновляем состояние
      setCaptains(newOrder);

      // Ждём перерендер карточек и получаем новые позиции
      setTimeout(() => {
        const newCards = Array.from(boardRef.current.querySelectorAll('.' + styles.captainCard));
        const newRects = newCards.map(card => card.getBoundingClientRect());

        flyingLayer.childNodes.forEach((clone, idx) => {
          const rect = oldRects[idx];
          const spreadX = newRects[idx].left - rect.left;
          const spreadY = newRects[idx].top - rect.top;
          clone.style.transition = 'transform 700ms ease-in-out';
          clone.style.transform = `translate(${spreadX}px, ${spreadY}px) scale(1) rotate(0deg)`;
        });

        // Убираем клоны после анимации
        setTimeout(() => {
          flyingLayer.innerHTML = '';
          Array.from(boardRef.current.querySelectorAll('.' + styles.captainCard)).forEach(card => {
            card.style.visibility = '';
          });
          setIsShuffling(false);
        }, 700);

      }, 50);

    } catch (error) {
      console.error('Ошибка при запросе к серверу:', error);
      setIsShuffling(false);
    }
  }, 700);
};

  return (
    <div style={{ position: 'relative' }}>
      <img src={logo512} alt="Logo" className={styles.logoTopLeft} />
      {isAuthenticated ? (
        <div>
          <CommandPanel onShuffle={handleShuffle} freePlayersCount={freePlayersCount} />
        </div>
      ) : (
        <div>
       <p>.</p>
        </div>
      )}
      
      <div className={styles.captainsBoard} ref={boardRef}>
        {captains.map((captain, idx) => (
          <CaptainCard
            key={captain.number || idx}
            captain={captain}
            onClick={() => handleCardClick(captain, idx)}
            isFlipped={flippedIdx === idx}
            isAuthenticated={isAuthenticated}
          />
        ))}
      </div>
      <div
        ref={flyingLayerRef}
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          width: '100vw',
          height: '100vh',
          pointerEvents: 'none',
          zIndex: 9999
        }}
      />
    </div>
  );
};

export default CaptainsBoard;

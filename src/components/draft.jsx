import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import styles from './draft.module.css';
import PlayerCard from './PlayerCard';

const PlayerProfile = ({ photoUrl, name, elo, points, country, bio, onBack }) => (
  <div className={styles.profilePage}>
    
    <div className={styles.content}>
      <div className={styles.sideCard}>
        <PlayerCard
          photoUrl={photoUrl}
          name={name}
          elo={elo}
          points={points}
          country={country}
        />
      </div>
    </div>
  </div>
);

const EmptyCard = () => (
  <div className={styles.emptyCard}>
    <span className={styles.plus}>+</span>
    <span className={styles.label}>Свободно</span>
  </div>
);

const TeamStats = ({ team }) => {
  const sumElo = team.reduce((acc, p) => acc + (p?.elo || 0), 0);
  // GG может быть как points, так и gg
  const sumGG = team.reduce((acc, p) => acc + (p?.gg !== undefined ? p.gg : (p?.points || 0)), 0);
  // Максимальные значения для прогресс-бара (можно скорректировать)
  const maxElo = 7000;
  const maxGG = 300;
  return (
    <div className={styles.teamStats}>
      <h4>Итоговые показатели</h4>
      <div className={styles.statRow}>
        <span className={styles.statLabel}>ELO:</span>
        <span className={styles.statValue}>{sumElo}</span>
      </div>
      <div className={styles.progressBarWrapper}>
        <div className={styles.progressBarBg}>
          <div
            className={styles.progressBarFill}
            style={{ width: `${Math.min(100, (sumElo / maxElo) * 100)}%`, background: '#a259f7' }}
          />
        </div>
      </div>
      <div className={styles.statRow}>
        <span className={styles.statLabel}>GG:</span>
        <span className={styles.statValue}>{sumGG}</span>
      </div>
      <div className={styles.progressBarWrapper}>
        <div className={styles.progressBarBg}>
          <div
            className={styles.progressBarFill}
            style={{ width: `${Math.min(100, (sumGG / maxGG) * 100)}%`, background: '#59f7a2' }}
          />
        </div>
      </div>
    </div>
  );
};

// --- Новый основной компонент draft ---
const Draft = ({ captainName, captainElo, captainGg, captainPhotoUrl, players = [], team, setTeam, onBack }) => {
  const captain = {
    photoUrl: captainPhotoUrl,
    name: captainName,
    elo: captainElo,
    points: captainGg,
    country: '',
  };
  const [sortType, setSortType] = useState('default');
  const [flyCard, setFlyCard] = useState(null); // {player, from, to}
  const playerRefs = useRef({});
  const teamRefs = useRef([]);

  const handleAddToTeam = (player, idx) => {
    if (team.filter(Boolean).length < 3 && !team.includes(player)) {
      const fromEl = playerRefs.current[player.name];
      const toEl = teamRefs.current[team.filter(Boolean).length];
      if (fromEl && toEl) {
        const fromRect = fromEl.getBoundingClientRect();
        const toRect = toEl.getBoundingClientRect();
        setFlyCard({
          player,
          from: fromRect,
          to: toRect,
        });
        setTimeout(() => {
          const newTeam = [...team];
          const emptyIdx = newTeam.findIndex(x => !x);
          if (emptyIdx !== -1) newTeam[emptyIdx] = player;
          setTeam(newTeam);
          setFlyCard(null);
        }, 700);
      } else {
        const newTeam = [...team];
        const emptyIdx = newTeam.findIndex(x => !x);
        if (emptyIdx !== -1) newTeam[emptyIdx] = player;
        setTeam(newTeam);
      }
    }
  };

  const availablePlayers = players.filter(p => !team.includes(p));

  const sortedPlayers = [...availablePlayers].sort((a, b) => {
    if (sortType === 'name') {
      return a.name.localeCompare(b.name, 'ru');
    } else if (sortType === 'elo') {
      return b.elo - a.elo;
    } else if (sortType === 'points') {
      return b.points - a.points;
    }
    return 0;
  });

  return (
    <div className={styles.draftBoard}>
      <div className={styles.captainRow}>
        <div className={styles.captainSection} onClick={onBack} style={{ cursor: 'pointer' }}>
          <PlayerProfile {...captain} onBack={onBack || (() => {})} />
        </div>
        <div className={styles.teamSection}>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              ref={el => teamRefs.current[i] = el}
              style={{ minHeight: 1 }}
            >
              {team[i] ? <PlayerCard {...team[i]} points={team[i].gg !== undefined ? team[i].gg : team[i].points} /> : <EmptyCard />}
            </div>
          ))}
        </div>
        <TeamStats team={team} />
      </div>
      <div className={styles.playersSection}>
        <h3 className={styles.listTitle}>
          Доступные игроки
          <span className={styles.freeCount}> ({availablePlayers.length})</span>
        </h3>
        <div className={styles.sortButtons}>
          <button onClick={() => setSortType('default')} className={sortType === 'default' ? styles.activeSort : ''}>Без сортировки</button>
          <button onClick={() => setSortType('name')} className={sortType === 'name' ? styles.activeSort : ''}>По имени</button>
          <button onClick={() => setSortType('elo')} className={sortType === 'elo' ? styles.activeSort : ''}>По ELO</button>
          <button onClick={() => setSortType('points')} className={sortType === 'points' ? styles.activeSort : ''}>По баллам</button>
        </div>
        <div className={styles.playerList}>
          {sortedPlayers.map((player, idx) => (
            <div
              key={idx}
              className={styles.playerWrapper}
              ref={el => playerRefs.current[player.name] = el}
              onClick={() => handleAddToTeam(player, idx)}
              style={{ cursor: 'pointer' }}
            >
              <PlayerCard {...player} points={player.gg !== undefined ? player.gg : player.points} />
            </div>
          ))}
        </div>
      </div>
      {flyCard && createPortal(
        <div
          className={styles.flyToTeam}
          style={{
            left: flyCard.from.left,
            top: flyCard.from.top,
            width: flyCard.from.width,
            height: flyCard.from.height,
            '--fly-x': `${flyCard.to.left - flyCard.from.left}px`,
            '--fly-y': `${flyCard.to.top - flyCard.from.top}px`,
          }}
        >
          <PlayerCard {...flyCard.player} />
        </div>,
        document.body
      )}
    </div>
  );
};

export default Draft;
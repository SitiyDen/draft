import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import styles from './draft.module.css';
import PlayerCard from './PlayerCard';
import CountrySelect from './CountrySelect';

const PlayerProfile = ({ photoUrl, name, elo, gg, country, bio, onBack }) => (
  <div className={styles.profilePage}>
    <div className={styles.content}>
      <div className={styles.sideCard}>
        <PlayerCard
          photoUrl={photoUrl}
          name={name}
          elo={elo}
          gg={gg}
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

const TeamStats = ({ team, captainElo, captainGg }) => {
  // Суммируем ELO всех игроков + капитана
  const teamPlayers = team.filter(Boolean);
  const totalElo = teamPlayers.reduce((acc, p) => acc + (p?.elo || 0), 0) + (captainElo || 0);
  const count = teamPlayers.length + 1; // +1 капитан
  const avgElo = count > 0 ? Math.round(totalElo / count) : 0;
  // GG: сумма gg капитана и всех игроков
  const sumGG = team.reduce((acc, p) => acc + (p?.gg || 0), 0) + (captainGg || 0);
  // Максимальные значения для прогресс-бара (можно скорректировать)
  const maxElo = 3000;
  const maxGG = 300;
  return (
    <div className={styles.teamStats}>
      <h4>Итоговые показатели</h4>
      
      <div className={styles.statRow}>
        <span className={styles.statLabel}>Средний ELO:</span>
        <span className={styles.statValue}>{avgElo}</span>
      </div>
      <div className={styles.progressBarWrapper}>
        <div className={styles.progressBarBg}>
          <div
            className={styles.progressBarFill}
            style={{ width: `${Math.min(100, (avgElo / maxElo) * 100)}%`, background: '#a259f7' }}
          />
        </div>
      </div>
      <div className={styles.statRow}>
        <span className={styles.statLabel}>GG общий:</span>
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
const Draft = ({ captainName, captainElo, captainGg, captainPhotoUrl, players = [], onBack, captainCountry, setCaptainCountry, captains, setCaptains }) => {
  const captain = captains.find(c => c.name === captainName) || {};
  const [sortType, setSortType] = useState('default');
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [showCaptainModal, setShowCaptainModal] = useState(false);

  // Получаем команду капитана
  const team = [captain.player1 || null, captain.player2 || null, captain.player3 || null];

  // Добавить игрока в первую свободную ячейку
  const handleAddToTeam = (player) => {
    if (team.filter(Boolean).length < 3 && !team.includes(player)) {
      setCaptains(prev => prev.map(c => {
        if (c.name !== captainName) return c;
        const updated = { ...c };
        if (!updated.player1) updated.player1 = player;
        else if (!updated.player2) updated.player2 = player;
        else if (!updated.player3) updated.player3 = player;
        return updated;
      }));
    }
  };

  // Удалить игрока из команды
  const handleRemoveFromTeam = (idx) => {
    setCaptains(prev => prev.map(c => {
      if (c.name !== captainName) return c;
      const updated = { ...c };
      if (idx === 0) updated.player1 = null;
      if (idx === 1) updated.player2 = null;
      if (idx === 2) updated.player3 = null;
      return updated;
    }));
  };

  // Доступные игроки
  const taken = captains.flatMap(c => [c.player1, c.player2, c.player3].filter(Boolean).map(p => p.name));
  const availablePlayers = players.filter(p => !taken.includes(p.name));

  // Сортировка
  const sortedPlayers = [...availablePlayers].sort((a, b) => {
    if (sortType === 'name') return a.name.localeCompare(b.name, 'ru');
    if (sortType === 'elo') return b.elo - a.elo;
    if (sortType === 'gg') return b.gg - a.gg;
    return 0;
  });

  return (
    <div className={styles.draftBoard}>
      
      <div className={styles.backBtnRow}>
        <button className={styles.backBtn} onClick={onBack}>
          ← Назад к выбору капитанов
        </button>
      </div>
      <div className={styles.captainRow}>
        <div className={styles.captainSection} onClick={() => setShowCaptainModal(true)} style={{ cursor: 'pointer' }}>
          <PlayerProfile {...captain} gg={captainGg} />
        </div>
        <div className={styles.teamSection}>
          {[0, 1, 2].map((i) => (
            <div key={i} style={{ minHeight: 1 }}>
              {team[i] ? (
                <div className={styles.teamPlayerWrapper} onClick={() => setSelectedPlayer(team[i])} style={{ cursor: 'pointer' }}>
                  <PlayerCard {...team[i]} gg={team[i].gg} />
                  <button
                    className={styles.removePlayerBtn}
                    onClick={e => { e.stopPropagation(); handleRemoveFromTeam(i); }}
                    title="Убрать из команды"
                  >×</button>
                </div>
              ) : <EmptyCard />}
            </div>
          ))}
        </div>
        <div className={styles.teamStatsWrapper}>
          <TeamStats team={team} captainElo={captainElo} captainGg={captainGg} />
        </div>
        <div className={styles.countryCardWrapper}>
          <CountrySelect
            value={captainCountry}
            onChange={setCaptainCountry}
            exclude={
              captains
                .filter(c => c.name !== captainName && c.country)
                .map(c => c.country.name)
            }
          />
        </div>
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
          <button onClick={() => setSortType('gg')} className={sortType === 'gg' ? styles.activeSort : ''}>По баллам</button>
        </div>
        <div className={styles.playerList}>
          {sortedPlayers.map((player, idx) => (
            <div
              key={idx}
              className={styles.playerWrapper}
              onClick={() => setSelectedPlayer(player)}
              style={{ cursor: 'pointer' }}
            >
              <PlayerCard
                {...player}
                gg={player.gg}
              />
            </div>
          ))}
        </div>
      </div>
      {selectedPlayer && createPortal(
        <div className={styles.playerModalOverlay} onClick={() => setSelectedPlayer(null)}>
          <div className={styles.playerModal} onClick={e => e.stopPropagation()}>
            <PlayerCard
              {...selectedPlayer}
              gg={selectedPlayer.gg}
              winrate={selectedPlayer.winrate}
              gamesPlayed={selectedPlayer.gamesPlayed}
              bonus={selectedPlayer.bonus}
              bio={selectedPlayer.bio}
              large
              onSelect={async () => {
                // --- Формируем новый объект капитана с выбранным игроком ---
                const updatedCaptain = { ...captain };
                if (!updatedCaptain.player1) updatedCaptain.player1 = selectedPlayer;
                else if (!updatedCaptain.player2) updatedCaptain.player2 = selectedPlayer;
                else if (!updatedCaptain.player3) updatedCaptain.player3 = selectedPlayer;
                // Сначала обновляем состояние (UI мгновенно)
                handleAddToTeam(selectedPlayer);
                setSelectedPlayer(null);
                // --- Google Apps Script интеграция через FormData (в фоне) ---
                const scriptUrl = 'https://script.google.com/macros/s/AKfycbzYe4jo_jfbZ9YGLH5qWmRwxLXZ2dAxxmtf6CK9UJV7nzlr8_seTSk36kUDCU1IVJWd/exec';
                const formData = new FormData();
                formData.append('captain', updatedCaptain.name);
                formData.append('player1', updatedCaptain.player1?.name || '');
                formData.append('player2', updatedCaptain.player2?.name || '');
                formData.append('player3', updatedCaptain.player3?.name || '');
                fetch(scriptUrl, {
                  method: 'POST',
                  body: formData
                })
                  .then(res => res.text())
                  .then(console.log)
                  .catch(console.error);
              }}
              onClose={() => setSelectedPlayer(null)}
            />
          </div>
        </div>,
        document.body
      )}
      {showCaptainModal && createPortal(
        <div className={styles.playerModalOverlay} onClick={() => setShowCaptainModal(false)}>
          <div className={styles.playerModal} onClick={e => e.stopPropagation()}>
            <PlayerCard
              {...captain}
              gg={captainGg}
              large
              onClose={() => setShowCaptainModal(false)}
            />
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default Draft;
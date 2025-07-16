import React, { useEffect, useState } from 'react';

export const players = [
 {
    number: 1,
    name: 'Unicef',
    photoUrl: 'https://sun9-56.userapi.com/impg/2nKhp8BTwSPUspDh-ccmbz3ixl_NpkM_pHnmPA/ZydRaErBaHE.jpg?size=1437x1437&quality=95&sign=93af4c41b6477601b03631995fa46442&type=album',
    elo: 2300,
    gg: 120,
    country: { name: 'Россия', flag: '🇷🇺' },
    team: [null, null, null],
  },
];

function MyComponent() {
  const message = 'Рендер компонента';
  console.log(message); // будет вызываться при каждом рендере

  return <div>{message}</div>;
}

function App() {
  

  const [playerData, setPlayerData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  console.log('Сытый');

  useEffect(() => {
    fetch('http://185.81.251.114/maf/hs/Players')
      .then(response => {
        if (!response.ok) throw new Error('Ошибка при загрузке данных');
        return response.json();
      })
      .then(data => {
        setPlayerData(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Загрузка игроков...</div>;
  if (error) return <div>Ошибка: {error}</div>;

  return (
    <div>
      <h1>Игроки</h1>
      <ul>
        {playerData.map((player, index) => (
          <li key={index}>
            <img src={player.photoUrl} alt={player.name} width={100} />
            <p>{player.name}</p>
            <p>ELO: {player.elo}</p>
            <p>GG: {player.gg}</p>
            <p>Winrate: {player.winrate}%</p>
            <p>Игры: {player.gamesPlayed}</p>
            <p>Бонус: {player.bonus}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MyComponent;


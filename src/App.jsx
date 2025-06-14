import React, { useState, useRef } from 'react';
import PlayerCard from './components/PlayerCard';
import Draft from './components/draft';
import CaptainsBoard from './components/CaptainsBoard';

const players = [
  { photoUrl: 'https://sun9-78.userapi.com/impg/2W80Z6NDID8SWHkif_LcMjstoRHX_3bc4vC5uw/b2sLshGYB1s.jpg?size=853x1280&quality=95&sign=3d008210944b2876ced6b15c7f1e66be&type=album', name: 'Игрок 1', elo: 2000, gg: 80 },
  { photoUrl: 'https://sun9-43.userapi.com/impg/cHucDeX9EOAqDY0369Z6S7CPCLlEDFMapxV-yQ/nLAOc7CqLwg.jpg?size=1792x828&quality=95&sign=ee9de162f26f3b6ca87ffcb82167d3bd&type=album', name: 'Игрок 2', elo: 2100, gg: 90 },
  { photoUrl: 'https://sun9-15.userapi.com/impg/EosR-DOiQtsQrxvX9pgj5h_WRCKOCJ7_Cwa86g/TkMuhoilSpg.jpg?size=898x1280&quality=95&sign=6c030a841103161ca39d2fd46bce9453&type=album', name: 'Игрок 3', elo: 2150, gg: 95 },
  { photoUrl: 'https://sun9-56.userapi.com/impg/2nKhp8BTwSPUspDh-ccmbz3ixl_NpkM_pHnmPA/ZydRaErBaHE.jpg?size=1437x1437&quality=95&sign=93af4c41b6477601b03631995fa46442&type=album', name: 'Игрок 4', elo: 2050, gg: 85 },
  { photoUrl: 'https://sun9-30.userapi.com/impg/MP4A0Qb8zYNjrOBZfpk0cvvDJBrPMeh6mGyQ6g/S8V9uAqow00.jpg?size=1727x2160&quality=95&sign=1fc06fa71745900a232a50fb876c9f75&type=album', name: 'Игрок 5', elo: 2080, gg: 88 },
  { photoUrl: 'https://randomuser.me/api/portraits/women/6.jpg', name: 'Игрок 6', elo: 2120, gg: 92 },
  { photoUrl: 'https://randomuser.me/api/portraits/men/7.jpg', name: 'Игрок 7', elo: 1990, gg: 77 },
  { photoUrl: 'https://randomuser.me/api/portraits/women/8.jpg', name: 'Игрок 8', elo: 2170, gg: 99 },
  { photoUrl: 'https://randomuser.me/api/portraits/men/9.jpg', name: 'Игрок 9', elo: 2030, gg: 81 },
  { photoUrl: 'https://randomuser.me/api/portraits/women/10.jpg', name: 'Игрок 10', elo: 2140, gg: 97 },
  { photoUrl: 'https://randomuser.me/api/portraits/men/11.jpg', name: 'Игрок 11', elo: 2010, gg: 79 },
  { photoUrl: 'https://randomuser.me/api/portraits/women/12.jpg', name: 'Игрок 12', elo: 2130, gg: 93 },
  { photoUrl: 'https://randomuser.me/api/portraits/men/13.jpg', name: 'Игрок 13', elo: 2090, gg: 84 },
  { photoUrl: 'https://randomuser.me/api/portraits/women/14.jpg', name: 'Игрок 14', elo: 2160, gg: 98 },
  { photoUrl: 'https://randomuser.me/api/portraits/men/15.jpg', name: 'Игрок 15', elo: 2020, gg: 82 },
];

const initialCaptains = [
  {
    number: 1,
    name: 'Unicef',
    photoUrl: 'https://sun9-56.userapi.com/impg/2nKhp8BTwSPUspDh-ccmbz3ixl_NpkM_pHnmPA/ZydRaErBaHE.jpg?size=1437x1437&quality=95&sign=93af4c41b6477601b03631995fa46442&type=album',
    elo: 2300,
    gg: 120,
    country: { name: 'Россия', flag: '🇷🇺' },
    team: [null, null, null],
  },
  {
    number: 2,
    name: 'ДаФомин',
    photoUrl: 'https://sun9-25.userapi.com/impg/p4M4uhlqRODqlOwKENrImRXv1MXO09_UpJeh2A/Dj-8n-eGmqs.jpg?size=1440x2160&quality=95&sign=b09ca2d208467a40e75599a09ec37548&type=album',
    elo: 2250,
    gg: 110,
    country: { name: 'Беларусь', flag: '🇧🇾' },
    team: [null, null, null],
  },
  {
    number: 3,
    name: 'MSR',
    photoUrl: 'https://sun9-43.userapi.com/impg/cHucDeX9EOAqDY0369Z6S7CPCLlEDFMapxV-yQ/nLAOc7CqLwg.jpg?size=1792x828&quality=95&sign=ee9de162f26f3b6ca87ffcb82167d3bd&type=album',
    elo: 2400,
    gg: 130,
    country: { name: 'Казахстан', flag: '🇰🇿' },
    team: [null, null, null],
  },
  {
    number: 4,
    name: '007',
    photoUrl: 'https://sun9-43.userapi.com/impg/oolh1bbwAv-jNuYS7VbEnrprvhPkwgdiFIL-pg/9Z34KDUP0_c.jpg?size=480x608&quality=95&sign=9d782aebda1ac0ab69e747c7cc9fdf77&type=album',
    elo: 2400,
    gg: 130,
    country: { name: 'Казахстан', flag: '🇰🇿' },
    team: [null, null, null],
  },
  {
    number: 5,
    name: 'Оксюморон',
    photoUrl: 'https://sun9-15.userapi.com/impg/EosR-DOiQtsQrxvX9pgj5h_WRCKOCJ7_Cwa86g/TkMuhoilSpg.jpg?size=898x1280&quality=95&sign=6c030a841103161ca39d2fd46bce9453&type=album',
    elo: 2400,
    gg: 130,
    country: { name: 'Казахстан', flag: '🇰🇿' },
    team: [null, null, null],
  },
  {
    number: 6,
    name: 'Флай',
    photoUrl: 'https://sun9-48.userapi.com/impg/0ccXJIc1bj6QD4KDtkT1orn4DvFjfAR4UrVWfQ/E1CPjxYcfDU.jpg?size=1920x1220&quality=95&sign=6a9b32cff1a5f6183ee52439f66d60c7&type=album',
    elo: 2400,
    gg: 130,
    country: { name: 'Казахстан', flag: '🇰🇿' },
    team: [null, null, null],
  },
];

const App = () => {
  const [selectedCaptain, setSelectedCaptain] = useState(null);
  const [captains, setCaptains] = useState(initialCaptains);
  const [shuffleAnimation, setShuffleAnimation] = useState(false);
  const [shuffleOrder, setShuffleOrder] = useState([]); // для анимации
  const boardRef = useRef();

  const handleUpdateCaptainTeam = (captainName, newTeam) => {
    setCaptains(prev => prev.map(c =>
      c.name === captainName ? { ...c, team: newTeam } : c
    ));
  };

  const handleShuffleCaptains = () => {
    if (!boardRef.current) return;
    // Если анимация уже идёт — сбросить и запустить заново
    setShuffleAnimation(false);
    setTimeout(() => {
      setCaptains(prev => {
        const shuffled = [...prev]
          .map(c => ({ ...c }))
          .sort(() => Math.random() - 0.5)
          .map((c, idx) => ({ ...c, number: idx + 1 }));
        setShuffleOrder(shuffled.map(c => prev.findIndex(x => x.name === c.name)));
        setShuffleAnimation(true);
        setTimeout(() => {
          setShuffleAnimation(false);
        }, 5000);
        return shuffled;
      });
    }, 10); // небольшой таймаут чтобы сбросить состояние
  };

  // вычисляем количество свободных игроков
  const takenNames = captains.flatMap(c => c.team.filter(Boolean).map(p => p.name));
  const freePlayersCount = players.filter(p => !takenNames.includes(p.name)).length;

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '32px',
      justifyContent: 'flex-start',
      alignItems: 'center',
      padding: '32px',
      maxWidth: '100vw',
      minHeight: '100vh',
      background: '#181c24',
      overflowX: 'auto'
    }}>
      {selectedCaptain === null ? (
        <CaptainsBoard
          captains={[...captains].sort((a, b) => a.number - b.number)}
          onCaptainClick={captain => setSelectedCaptain(captain)}
          onShuffle={handleShuffleCaptains}
          shuffleAnimation={shuffleAnimation}
          shuffleOrder={shuffleOrder}
          boardRef={boardRef}
          freePlayersCount={freePlayersCount}
        />
      ) : (
        <Draft
          captainName={selectedCaptain.name}
          captainElo={selectedCaptain.elo}
          captainGg={selectedCaptain.gg}
          captainPhotoUrl={selectedCaptain.photoUrl}
          players={players.filter(p => !captains.some(c => c.team.some(t => t && t.name === p.name)))}
          team={captains.find(c => c.name === selectedCaptain.name)?.team || [null, null, null]}
          setTeam={newTeam => handleUpdateCaptainTeam(selectedCaptain.name, newTeam)}
          onBack={() => setSelectedCaptain(null)}
        />
      )}
    </div>
  );
};

export default App;
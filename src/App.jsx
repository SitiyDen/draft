import React, { useState, useRef } from 'react';
import Draft from './components/draft';
import CaptainsBoard from './components/CaptainsBoard';
import { useGoogleSheetData } from './components/playersGoogle'; 


const App = () => {
  const { data: googleCaptains = [], loading: loadingP, error: errorP } = useGoogleSheetData(true);
  const { data: players = [], loading: loadingPP, error: errorPP } = useGoogleSheetData(false);

  // Используем только один массив капитанов
  const [captains, setCaptains] = useState([]);
  const [selectedCaptain, setSelectedCaptain] = useState(null);
  const [shuffleAnimation, setShuffleAnimation] = useState(false);
  const [shuffleOrder, setShuffleOrder] = useState([]); // для анимации
  const [draftCountry, setDraftCountry] = useState(null);
  const boardRef = useRef();

  // Синхронизация googleCaptains -> captains при загрузке
  React.useEffect(() => {
    setCaptains(googleCaptains);
  }, [googleCaptains]);

  // вычисляем количество свободных игроков
  const takenNames = captains.flatMap(c => [c.player1, c.player2, c.player3].filter(Boolean).map(p => p.name));
  const freePlayersCount = players.filter(p => !takenNames.includes(p.name)).length;

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '32px',
      justifyContent: 'flex-start',
      alignItems: 'center',
      padding: '32px',
      minHeight: '100vh',
      overflowX: 'hidden'
    }}>
      {selectedCaptain === null ? (
        <CaptainsBoard
          captains={captains}
          onCaptainClick={captain => {
            setSelectedCaptain(captain);
            setDraftCountry(captain.country);
          }}
          onShuffle={() => { /* ...анимация... */ }}
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
          players={players.filter(p => !takenNames.includes(p.name))}
          onBack={() => setSelectedCaptain(null)}
          captainCountry={draftCountry}
          setCaptains={setCaptains}
          setCaptainCountry={country => {
            setDraftCountry(country);
            setCaptains(prev => prev.map(c => c.name === selectedCaptain.name ? { ...c, country } : c));
          }}
          captains={captains}
        />
      )}
    </div>
  );
};

export default App;
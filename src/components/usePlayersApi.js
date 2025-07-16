import { useState, useEffect } from 'react';

export default function usePlayersApi() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rawData, setRawData] = useState(null);

  useEffect(() => {
    setLoading(true);
    console.log('[usePlayersApi] Запуск загрузки игроков...');
    fetch('http://185.81.251.114/maf/hs/Players')
      .then(res => {
        console.log('[usePlayersApi] Ответ от сервера:', res);
        if (!res.ok) throw new Error('HTTP error ' + res.status);
        return res.json();
      })
      .then(data => {
        console.log('[usePlayersApi] Получены данные:', data);
        setRawData(data);
        setPlayers(data.players || []);
        setLoading(false);
      })
      .catch((e) => {
        console.error('[usePlayersApi] Ошибка загрузки:', e);
        setPlayers([]);
        setRawData(null);
        setError(e);
        setLoading(false);
      });
  }, []);

  return { players, loading, error, rawData };
}

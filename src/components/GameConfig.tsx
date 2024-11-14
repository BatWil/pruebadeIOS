import React, { useState } from 'react';

interface GameConfigProps {
  onStart: (rounds: number, time: number) => void;
}

const GameConfig: React.FC<GameConfigProps> = ({ onStart }) => {
  const [rounds, setRounds] = useState<number>(5);
  const [time, setTime] = useState<number>(10);

  return (
    <div>
      <h2>Configuración del Juego</h2>
      <label>
        Número de rondas:
        <input
          type="number"
          value={rounds}
          onChange={(e) => setRounds(Number(e.target.value))}
        />
      </label>
      <label>
        Tiempo por ronda (segundos):
        <input
          type="number"
          value={time}
          onChange={(e) => setTime(Number(e.target.value))}
        />
      </label>
      <button onClick={() => onStart(rounds, time)}>Iniciar Juego</button>
    </div>
  );
};

export default GameConfig;

import React from 'react';

interface GameResultProps {
  rounds: number;
  correctAnswers: number[];
}

const GameResult: React.FC<GameResultProps> = ({ rounds, correctAnswers }) => {
  const totalCorrect = correctAnswers.reduce((acc, curr) => acc + curr, 0);

  return (
    <div>
      <h2>¡Juego Terminado!</h2>
      <p>Rondas completadas: {rounds}</p>
      <p>Aciertos: {totalCorrect} de {rounds}</p>
      <button onClick={() => window.location.reload()}>Reiniciar Juego</button>
    </div>
  );
};

export default GameResult;

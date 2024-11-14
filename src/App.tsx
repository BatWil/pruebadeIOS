import React, { useState } from 'react';
import GameConfig from './components/GameConfig';
import BibleVerseDisplay from './components/BibleVerseDisplay';
import GameResult from './components/GameResult';
import bibleData from './DataBiblia/bibleData.json';




import './App.css';

const App: React.FC = () => {
  const [rounds, setRounds] = useState<number>(0);
  const [timePerRound, setTimePerRound] = useState<number>(30);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [gameEnded, setGameEnded] = useState<boolean>(false); // Nuevo estado
  const [currentRound, setCurrentRound] = useState<number>(1);
  const [verses, setVerses] = useState<{ verse: string; reference: string }[]>([]);
  const [correctAnswers, setCorrectAnswers] = useState<number[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const startGame = async (rounds: number, time: number) => {
    setRounds(rounds);
    setTimePerRound(time);
    setGameStarted(true);
    setGameEnded(false); // Reiniciar el estado al iniciar un nuevo juego
    setCurrentRound(1);
    setCorrectAnswers([]); // Reiniciar las respuestas correctas al iniciar el juego
    await generateVerses(rounds);
  };



  const generateVerses = async (rounds: number) => {
    const books = Object.keys(bibleData);
    const selectedVerses: { verse: string; reference: string }[] = [];
    setLoading(true);
  
    for (let i = 0; i < rounds; i++) {
      const book = books[Math.floor(Math.random() * books.length)];
      const bookData = bibleData[book as keyof typeof bibleData]; // Ahora `bookData` tiene el tipo correcto
  
      if (!bookData) {
        selectedVerses.push({
          verse: "Libro no encontrado.",
          reference: `${book}`
        });
        continue;
      }
  
      const chapters = Object.keys(bookData).length;
      if (chapters === 0) {
        selectedVerses.push({
          verse: "No hay capítulos en el libro.",
          reference: `${book}`
        });
        continue;
      }
  
      const chapter = Math.floor(Math.random() * chapters) + 1;
      const verseNumber = Math.floor(Math.random() * bookData[String(chapter) as keyof typeof bookData].versiculos) + 1;
  
      const url = `https://bible-api.deno.dev/api/read/rv1960/${book.toLowerCase()}/${chapter}/${verseNumber}`;
      try {
        const response = await fetch(url);
        const data = await response.json();
        if (data && data.verse) {
          selectedVerses.push({
            verse: data.verse,
            reference: `${book} ${chapter}:${verseNumber}`
          });
        } else {
          selectedVerses.push({
            verse: "No se pudo obtener el verso.",
            reference: `${book} ${chapter}:${verseNumber}`
          });
        }
      } catch (error) {
        selectedVerses.push({
          verse: "Error al obtener el verso.",
          reference: `${book} ${chapter}:${verseNumber}`
        });
      }
    }
  
    setLoading(false);
    setVerses(selectedVerses);
  };
  
  const nextRound = (found: boolean) => {
    setCorrectAnswers((prev) => [...prev, found ? 1 : 0]);

    if (currentRound < rounds) {
      setCurrentRound((prevRound) => prevRound + 1);
    } else {
      endGame();
    }
  };

  const endGame = () => {
    setGameStarted(false);
    setGameEnded(true); // Indicar que el juego ha terminado
  };

  return (
    <div className="App">
      {gameStarted ? (
        loading ? (
          <p>Cargando...</p>
        ) : (
          currentRound <= rounds && verses.length > 0 ? (
            <BibleVerseDisplay
              round={currentRound}
              timePerRound={timePerRound}
              verse={verses[currentRound - 1]}
              onNextRound={nextRound}
            />
          ) : null
        )
      ) : gameEnded ? (
        <GameResult rounds={rounds} correctAnswers={correctAnswers} />
      ) : (
        <GameConfig onStart={startGame} />
      )}
    </div>
  );
};

export default App;

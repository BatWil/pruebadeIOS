import React, { useState, useEffect } from 'react';

interface VerseProps {
    round: number;
    timePerRound: number;
    verse: { verse: string; reference: string } | undefined;
    onNextRound: (found: boolean) => void;
}

const BibleVerseDisplay: React.FC<VerseProps> = ({ round, timePerRound, verse, onNextRound }) => {
    const [timeLeft, setTimeLeft] = useState<number>(timePerRound);
    const [roundEnded, setRoundEnded] = useState<boolean>(false);

    useEffect(() => {
        if (timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        } else if (!roundEnded) {
            setRoundEnded(true);
        }
    }, [timeLeft, roundEnded]);

    useEffect(() => {
        setTimeLeft(timePerRound);
        setRoundEnded(false);
    }, [round, timePerRound]);

    if (!verse) {
        return <div>No hay versículo disponible.</div>;
    }

    const handleNext = (found: boolean) => {
        onNextRound(found);
    };

    return (
        <div>
            <h3>{verse.reference}</h3>
            <p>{verse.verse}</p>
            <p>Tiempo restante: {timeLeft} segundos</p>
            {roundEnded ? (
                <div>
                    <p>¿Encontraste la cita en el tiempo indicado?</p>
                    <button onClick={() => handleNext(true)} style={{ background: "green" }}>Sí</button>
                    <span></span>
                    <button onClick={() => handleNext(false)} style={{ background: "red" }}>No</button>
                </div>
            ) : null}
        </div>
    );
};

export default BibleVerseDisplay;

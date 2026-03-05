"use client"

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useGameSound } from '@/hooks/use-game-sound';
import { ArrowLeft, RotateCcw, Home, SkipForward } from 'lucide-react';
import { cn } from '@/lib/utils';

type Round = {
  numL: number;
  numR: number;
  correct: string;
};

export default function CompareGame() {
  const [rounds, setRounds] = useState<Round[]>([]);
  const [currentRoundIdx, setCurrentRoundIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | null, msg: string }>({ type: null, msg: '' });
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);
  const { playSuccess, playError } = useGameSound();

  const generateGame = useCallback(() => {
    const range = parseInt(localStorage.getItem('numero-aventuras-range') || '100');
    const newRounds: Round[] = [];
    
    // Al menos una ronda con números iguales
    const equalIdx = Math.floor(Math.random() * 10);

    for (let i = 0; i < 10; i++) {
      let numL = Math.floor(Math.random() * range);
      let numR = Math.floor(Math.random() * range);

      if (i === equalIdx) {
        numR = numL;
      } else {
        while (numL === numR) {
          numR = Math.floor(Math.random() * range);
        }
      }

      newRounds.push({
        numL,
        numR,
        correct: numL > numR ? '>' : numL < numR ? '<' : '=',
      });
    }

    setRounds(newRounds);
    setCurrentRoundIdx(0);
    setScore(0);
    setAttempts(0);
    setGameOver(false);
    setFeedback({ type: null, msg: '' });
    setSelectedSymbol(null);
  }, []);

  useEffect(() => {
    generateGame();
  }, [generateGame]);

  const handleValidation = (selected: string) => {
    const current = rounds[currentRoundIdx];
    if (selected === current.correct) {
      playSuccess();
      setScore(prev => prev + 1);
      setFeedback({ type: 'success', msg: '¡CORRECTO!' });
      setSelectedSymbol(null);
      setTimeout(nextRound, 1200);
    } else {
      playError();
      if (attempts === 0) {
        setAttempts(1);
        setFeedback({ type: 'error', msg: '¡CASI! INTENTA OTRA VEZ' });
        setSelectedSymbol(null);
        setTimeout(() => setFeedback({ type: null, msg: '' }), 1200);
      } else {
        setFeedback({ type: 'error', msg: 'PASAMOS AL SIGUIENTE' });
        setSelectedSymbol(null);
        setTimeout(nextRound, 1200);
      }
    }
  };

  const nextRound = () => {
    if (currentRoundIdx < 9) {
      setCurrentRoundIdx(prev => prev + 1);
      setAttempts(0);
      setFeedback({ type: null, msg: '' });
      setSelectedSymbol(null);
    } else {
      setGameOver(true);
    }
  };

  if (rounds.length === 0) return null;

  if (gameOver) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center space-y-8 animate-pop">
        <h2 className="text-6xl font-black text-kid-orange drop-shadow-md">¡TERMINADO!</h2>
        <div className="bg-white p-10 rounded-[3rem] shadow-2xl border-[12px] border-white space-y-4 w-full max-w-sm">
          <p className="text-3xl font-black text-slate-500">Puntaje:</p>
          <p className="text-8xl font-black text-blue-500">{score} / 10</p>
        </div>
        <div className="flex flex-col gap-4 w-full max-w-xs">
          <Button onClick={generateGame} className="h-20 text-3xl font-black bg-orange-500 kid-shadow rounded-3xl">
            <RotateCcw className="mr-2 h-8 w-8" /> REPETIR
          </Button>
          <Button asChild variant="ghost" className="h-16 text-xl font-bold text-slate-500">
            <Link href="/"><Home className="mr-2" /> INICIO</Link>
          </Button>
        </div>
      </div>
    );
  }

  const currentRound = rounds[currentRoundIdx];

  return (
    <div className="flex flex-col items-center flex-1 p-4 max-w-lg mx-auto w-full">
      <header className="w-full flex justify-between items-center mb-6 px-2">
        <Button asChild variant="ghost" className="rounded-full text-slate-400 h-12 w-12 p-0">
          <Link href="/"><ArrowLeft className="h-8 w-8" /></Link>
        </Button>
        <div className="bg-white/50 px-6 py-2 rounded-full border-4 border-white shadow-sm">
          <span className="text-2xl font-black text-slate-600">Puntaje: {score}/10</span>
        </div>
        <Button onClick={nextRound} variant="ghost" className="rounded-full text-slate-400 h-12 w-12 p-0">
          <SkipForward className="h-8 w-8" />
        </Button>
      </header>

      <div className="flex-1 w-full flex flex-col justify-center space-y-16">
        <div className="flex items-center justify-between w-full">
          <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-[2.5rem] bg-blue-500 flex items-center justify-center text-5xl sm:text-7xl font-black text-white shadow-xl transform -rotate-3">
            {currentRound.numL}
          </div>

          <div 
            onClick={() => selectedSymbol && handleValidation(selectedSymbol)}
            className={cn(
              "w-24 h-24 sm:w-28 sm:h-28 rounded-full border-[6px] border-dashed flex items-center justify-center text-6xl font-black transition-all cursor-pointer shadow-inner bg-white/50",
              feedback.type === 'success' ? 'border-green-400 text-green-500 scale-110' :
              feedback.type === 'error' ? 'border-red-400 text-red-500' :
              selectedSymbol ? 'border-orange-400 text-orange-500 animate-pulse bg-orange-50' : 'border-slate-300 text-slate-300'
            )}
          >
            {selectedSymbol || "?"}
          </div>

          <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-[2.5rem] bg-red-500 flex items-center justify-center text-5xl sm:text-7xl font-black text-white shadow-xl transform rotate-3">
            {currentRound.numR}
          </div>
        </div>

        {feedback.type && (
          <div className={cn(
            "text-4xl font-black text-center animate-bounce",
            feedback.type === 'success' ? 'text-green-500' : 'text-red-500'
          )}>
            {feedback.msg}
          </div>
        )}

        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-6 px-4">
            {['<', '=', '>'].map((s) => (
              <button
                key={s}
                onClick={() => setSelectedSymbol(s)}
                className={cn(
                  "h-24 sm:h-28 flex items-center justify-center rounded-3xl text-6xl font-black transition-all kid-shadow active:translate-y-1 active:shadow-none",
                  s === '<' ? 'bg-green-500 text-white' :
                  s === '=' ? 'bg-orange-500 text-white' : 'bg-blue-500 text-white',
                  selectedSymbol === s && "ring-8 ring-white ring-offset-4 scale-105"
                )}
              >
                {s}
              </button>
            ))}
          </div>
          <p className="text-center font-black text-slate-400 text-lg">TOCA UN SIGNO Y LUEGO EL "?"</p>
        </div>
      </div>
    </div>
  );
}
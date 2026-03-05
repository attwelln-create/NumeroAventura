"use client"

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useGameSound } from '@/hooks/use-game-sound';
import { ArrowLeft, RotateCcw, Home, CircleCheck, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

type GameState = {
  level: number;
  orderType: 'asc' | 'desc';
  numbers: number[];
  shuffled: number[];
  placed: (number | null)[];
};

export default function OrderGame() {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | null, msg: string }>({ type: null, msg: '' });
  const { playSuccess, playError } = useGameSound();

  const generateLevel = useCallback((level: number) => {
    let range = 100;
    if (typeof window !== 'undefined') {
      range = parseInt(localStorage.getItem('numero-aventuras-range') || '100');
    }
    
    // Si estamos en el nivel 1, reiniciamos el juego completo
    if (level === 1) {
      setScore(0);
      setGameOver(false);
    }

    // 1-3: Ascendente, 4-6: Descendente
    const orderType = level <= 3 ? 'asc' : 'desc';
    // Cantidad de números basada en el progreso dentro de cada fase (asc/desc)
    const relativeLevel = level <= 3 ? level : level - 3;
    const count = relativeLevel === 1 ? 5 : relativeLevel === 2 ? 6 : 7;
    
    const nums: number[] = [];
    while (nums.length < count) {
      const n = Math.floor(Math.random() * range);
      if (!nums.includes(n)) nums.push(n);
    }

    const sorted = [...nums].sort((a, b) => orderType === 'asc' ? a - b : b - a);
    const shuffledNums = [...nums].sort(() => Math.random() - 0.5);

    setGameState({
      level,
      orderType,
      numbers: sorted,
      shuffled: shuffledNums,
      placed: Array(count).fill(null)
    });
    setSelectedIndex(null);
    setAttempts(0);
    setFeedback({ type: null, msg: '' });
  }, []);

  useEffect(() => {
    generateLevel(1);
  }, [generateLevel]);

  const handleSlotClick = (slotIdx: number) => {
    if (!gameState) return;
    
    const newPlaced = [...gameState.placed];
    const newShuffled = [...gameState.shuffled];
    const currentNumInSlot = newPlaced[slotIdx];

    // SI EL HUECO TIENE UN NÚMERO -> Lo quitamos y lo devolvemos abajo
    if (currentNumInSlot !== null) {
      // Buscamos el primer hueco vacío (-1) en la reserva
      const emptyReservaIdx = newShuffled.indexOf(-1);
      if (emptyReservaIdx !== -1) {
        newShuffled[emptyReservaIdx] = currentNumInSlot;
      } else {
        newShuffled.push(currentNumInSlot);
      }
      newPlaced[slotIdx] = null;

      // Si teníamos algo seleccionado, lo ponemos en el hueco que acabamos de vaciar
      if (selectedIndex !== null) {
        const numberToPlace = gameState.shuffled[selectedIndex];
        newPlaced[slotIdx] = numberToPlace;
        newShuffled[selectedIndex] = -1;
      }
      
      setGameState({ ...gameState, placed: newPlaced, shuffled: newShuffled });
      setSelectedIndex(null);
      return;
    }

    // SI EL HUECO ESTÁ VACÍO -> Colocamos el seleccionado
    if (selectedIndex !== null) {
      const numberToPlace = gameState.shuffled[selectedIndex];
      newPlaced[slotIdx] = numberToPlace;
      newShuffled[selectedIndex] = -1;
      setGameState({ ...gameState, placed: newPlaced, shuffled: newShuffled });
      setSelectedIndex(null);
    }
  };

  const resetLevel = () => {
    if (!gameState) return;
    const shuffledNums = [...gameState.numbers].sort(() => Math.random() - 0.5);
    setGameState({
      ...gameState,
      shuffled: shuffledNums,
      placed: Array(gameState.numbers.length).fill(null)
    });
    setSelectedIndex(null);
  };

  const validate = () => {
    if (!gameState) return;
    if (gameState.placed.includes(null)) {
      setFeedback({ type: 'error', msg: '¡FALTAN NÚMEROS!' });
      setTimeout(() => setFeedback({ type: null, msg: '' }), 1500);
      return;
    }

    const isCorrect = gameState.placed.every((val, i) => val === gameState.numbers[i]);

    if (isCorrect) {
      playSuccess();
      setScore(prev => prev + 1);
      setFeedback({ type: 'success', msg: '¡MUY BIEN!' });
      setTimeout(() => {
        if (gameState.level < 6) {
          generateLevel(gameState.level + 1);
        } else {
          setGameOver(true);
        }
      }, 1500);
    } else {
      playError();
      if (attempts === 0) {
        setAttempts(1);
        setFeedback({ type: 'error', msg: '¡INTENTA OTRA VEZ!' });
        setTimeout(() => {
          setFeedback({ type: null, msg: '' });
          resetLevel();
        }, 1500);
      } else {
        setFeedback({ type: 'error', msg: 'VAMOS AL SIGUIENTE' });
        setTimeout(() => {
          if (gameState.level < 6) {
            generateLevel(gameState.level + 1);
          } else {
            setGameOver(true);
          }
        }, 1500);
      }
    }
  };

  if (!gameState) return null;

  if (gameOver) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center space-y-8 animate-pop">
        <h2 className="text-6xl font-black text-orange-500 drop-shadow-md">¡FIN DEL JUEGO!</h2>
        <div className="bg-white p-10 rounded-[3rem] shadow-2xl border-[12px] border-white space-y-4 w-full max-w-sm">
          <p className="text-2xl font-black text-slate-500">Niveles logrados:</p>
          <p className="text-8xl font-black text-blue-500">{score} / 6</p>
        </div>
        <div className="flex flex-col gap-4 w-full max-w-xs">
          <Button onClick={() => generateLevel(1)} className="h-20 text-3xl font-black bg-orange-500 kid-shadow rounded-3xl text-white">
            <RotateCcw className="mr-2 h-8 w-8" /> REPETIR
          </Button>
          <Button asChild variant="ghost" className="h-16 text-xl font-bold text-slate-500">
            <Link href="/"><Home className="mr-2" /> INICIO</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center flex-1 p-4 max-w-3xl mx-auto w-full">
      <header className="w-full flex justify-between items-center mb-4 px-2">
        <Button asChild variant="ghost" className="rounded-full text-slate-400 h-12 w-12 p-0">
          <Link href="/"><ArrowLeft className="h-8 w-8" /></Link>
        </Button>
        <div className="bg-white/50 px-6 py-2 rounded-full border-4 border-white shadow-sm">
          <span className="text-2xl font-black text-slate-600">Nivel: {gameState.level}/6</span>
        </div>
        <div className="w-12" />
      </header>

      <div className="flex-1 w-full flex flex-col justify-center space-y-8">
        <div className="space-y-2">
          <h2 className={cn(
            "text-3xl font-black text-center uppercase tracking-tight",
            gameState.orderType === 'asc' ? "text-green-500" : "text-blue-500"
          )}>
            {gameState.orderType === 'asc' ? "Menor a Mayor" : "Mayor a Menor"}
          </h2>
          <p className="text-center font-bold text-slate-400">Ordena los números correctamente:</p>
        </div>

        {/* ZONA DE HUECOS CON FLECHAS */}
        <div className="flex flex-wrap items-center justify-center gap-2 min-h-[110px]">
          {gameState.placed.map((num, i) => (
            <div key={`container-${i}`} className="flex items-center gap-2">
              <div
                onClick={() => handleSlotClick(i)}
                className={cn(
                  "w-20 h-20 sm:w-24 sm:h-24 rounded-3xl border-4 border-dashed flex items-center justify-center text-3xl font-black transition-all cursor-pointer shadow-inner",
                  num !== null ? "bg-white border-blue-400 text-blue-500 shadow-md scale-105" : 
                  selectedIndex !== null ? "bg-orange-50 border-orange-300 animate-pulse" : "bg-white/30 border-white"
                )}
              >
                {num !== null ? num : "?"}
              </div>
              {i < gameState.placed.length - 1 && (
                <ChevronRight className="h-8 w-8 text-slate-300 stroke-[4px]" />
              )}
            </div>
          ))}
        </div>

        {feedback.type && (
          <div className={cn(
            "text-4xl font-black text-center animate-bounce h-12",
            feedback.type === 'success' ? 'text-green-500' : 'text-red-500'
          )}>
            {feedback.msg}
          </div>
        )}

        {/* RESERVA DE NÚMEROS ABAJO */}
        <div className="bg-white/40 p-6 rounded-[3rem] space-y-4">
          <p className="text-center font-black text-slate-500 uppercase text-xs">
            Toca un número y luego un hueco
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {gameState.shuffled.map((num, i) => (
              num === -1 ? (
                <div key={`empty-${i}`} className="w-16 h-16 sm:w-20 sm:h-20 opacity-0 pointer-events-none" />
              ) : (
                <button
                  key={`num-${i}`}
                  onClick={() => setSelectedIndex(i)}
                  className={cn(
                    "w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center rounded-2xl text-2xl font-black transition-all kid-shadow active:translate-y-1 active:shadow-none bg-blue-500 text-white",
                    selectedIndex === i && "ring-8 ring-white ring-offset-2 scale-110"
                  )}
                >
                  {num}
                </button>
              )
            ))}
          </div>
        </div>

        <Button 
          onClick={validate}
          className="h-20 w-full max-w-xs mx-auto text-3xl font-black bg-green-500 hover:bg-green-600 kid-shadow rounded-3xl text-white"
        >
          <CircleCheck className="mr-2 h-8 w-8" /> VALIDAR
        </Button>
      </div>
    </div>
  );
}

"use client"

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Check } from 'lucide-react';

export default function SettingsPage() {
  const [maxRange, setMaxRange] = useState<number>(100);

  useEffect(() => {
    const stored = localStorage.getItem('numero-aventuras-range');
    if (stored) setMaxRange(parseInt(stored));
  }, []);

  const saveRange = (range: number) => {
    setMaxRange(range);
    localStorage.setItem('numero-aventuras-range', range.toString());
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-6 bg-kid-warm">
      <header className="w-full flex items-center mb-12">
        <Button asChild variant="ghost" className="rounded-full h-12 w-12 p-0 text-kid-orange hover:text-kid-orange hover:bg-kid-orange/10">
          <Link href="/">
            <ArrowLeft className="h-8 w-8" />
          </Link>
        </Button>
        <h1 className="flex-1 text-3xl font-bold text-center text-slate-800">Ajustes</h1>
      </header>

      <div className="w-full max-w-sm space-y-8">
        <div className="space-y-4">
          <label className="text-lg font-bold text-slate-600">Rango de Números:</label>
          <div className="grid grid-cols-1 gap-4">
            <button
              onClick={() => saveRange(100)}
              className={`flex items-center justify-between p-6 rounded-2xl border-4 transition-all ${
                maxRange === 100 
                ? 'border-kid-orange bg-kid-orange text-white' 
                : 'border-slate-200 bg-white text-slate-600'
              }`}
            >
              <div className="text-left">
                <span className="block text-2xl font-extrabold">Hasta 100</span>
                <span className="text-sm opacity-80">Ideal para empezar</span>
              </div>
              {maxRange === 100 && <Check className="h-8 w-8" />}
            </button>

            <button
              onClick={() => saveRange(1000)}
              className={`flex items-center justify-between p-6 rounded-2xl border-4 transition-all ${
                maxRange === 1000 
                ? 'border-kid-orange bg-kid-orange text-white' 
                : 'border-slate-200 bg-white text-slate-600'
              }`}
            >
              <div className="text-left">
                <span className="block text-2xl font-extrabold">Hasta 1000</span>
                <span className="text-sm opacity-80">¡Un gran desafío!</span>
              </div>
              {maxRange === 1000 && <Check className="h-8 w-8" />}
            </button>
          </div>
        </div>
      </div>

      <div className="mt-auto py-8">
        <Button asChild className="h-16 px-12 text-2xl font-bold bg-kid-orange rounded-2xl kid-shadow">
          <Link href="/">GUARDAR</Link>
        </Button>
      </div>
    </div>
  );
}

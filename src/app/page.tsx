"use client"

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Settings, ListOrdered, Scale } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center flex-1 p-6 space-y-12 text-center">
      <div className="space-y-4">
        <h1 className="text-5xl sm:text-7xl font-black text-kid-orange tracking-tight drop-shadow-sm animate-pop">
          Aprender Números
        </h1>
        <p className="text-xl font-bold text-slate-500 max-w-xs mx-auto">
          ¡Diversión matemática para niños!
        </p>
      </div>

      <div className="flex flex-col gap-6 w-full max-w-sm">
        <Button asChild className="h-24 text-2xl font-black bg-green-500 hover:bg-green-600 kid-shadow transition-all active:translate-y-1 active:shadow-none rounded-3xl">
          <Link href="/game">
            <Scale className="mr-4 h-10 w-10" />
            Comparar números
          </Link>
        </Button>

        <Button asChild className="h-24 text-2xl font-black bg-blue-500 hover:bg-blue-600 kid-shadow transition-all active:translate-y-1 active:shadow-none rounded-3xl">
          <Link href="/order">
            <ListOrdered className="mr-4 h-10 w-10" />
            Ordenar números
          </Link>
        </Button>
        
        <Button asChild variant="outline" className="h-16 text-xl font-bold border-4 border-kid-orange text-kid-orange hover:bg-white bg-white/50 rounded-3xl mt-4">
          <Link href="/settings">
            <Settings className="mr-2 h-6 w-6" />
            Ajustes
          </Link>
        </Button>
      </div>

      <div className="pt-8">
        <p className="text-sm text-slate-400 font-bold italic bg-white/30 px-4 py-2 rounded-full">
          Diseñado para niños de 6 a 10 años
        </p>
      </div>
    </div>
  );
}
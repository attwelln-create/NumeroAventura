"use client"

import { useCallback, useEffect, useRef } from 'react';

export function useGameSound() {
  const isEnabled = useRef(false);
  const toneRef = useRef<any>(null);
  const successSynth = useRef<any>(null);
  const errorSynth = useRef<any>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Carga dinámica de Tone.js para evitar errores en el servidor
    const initTone = async () => {
      const Tone = await import('tone');
      toneRef.current = Tone;
      
      if (!successSynth.current) {
        successSynth.current = new Tone.PolySynth(Tone.Synth).toDestination();
      }
      if (!errorSynth.current) {
        errorSynth.current = new Tone.Synth().toDestination();
      }
    };

    initTone();

    const enableAudio = async () => {
      const Tone = toneRef.current;
      if (!Tone) return;
      
      try {
        if (Tone.getContext().state !== 'running') {
          await Tone.start();
        }
        isEnabled.current = true;
      } catch (e) {
        console.warn("Audio initialization failed", e);
      }
    };

    window.addEventListener('click', enableAudio, { once: true });
    window.addEventListener('touchstart', enableAudio, { once: true });
  }, []);

  const playSuccess = useCallback(() => {
    if (!isEnabled.current || !successSynth.current) return;
    try {
      successSynth.current.triggerAttackRelease(["C4", "E4", "G4", "C5"], "8n");
    } catch (e) {}
  }, []);

  const playError = useCallback(() => {
    if (!isEnabled.current || !errorSynth.current) return;
    try {
      errorSynth.current.triggerAttackRelease("G2", "4n");
    } catch (e) {}
  }, []);

  return { playSuccess, playError };
}

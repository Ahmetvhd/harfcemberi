'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import {
  TURKISH_ALPHABET,
  POINTS_PER_CORRECT,
  type GameState,
  type LetterStatus,
  type HistoryEntry,
} from '@/lib/game-types';

const createInitialLetters = (): LetterStatus[] =>
  TURKISH_ALPHABET.map((letter) => ({ letter, state: 'pending' as const }));

export function useGame() {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Get the next available letter index (pending or pass)
  const getNextAvailableIndex = useCallback(
    (letters: LetterStatus[], currentIdx: number): number | null => {
      const availableIndices = letters
        .map((l, i) => ({ ...l, index: i }))
        .filter((l) => l.state === 'pending' || l.state === 'pass')
        .map((l) => l.index);

      if (availableIndices.length === 0) return null;

      // Find the next index after current
      const nextIdx = availableIndices.find((i) => i > currentIdx);
      return nextIdx !== undefined ? nextIdx : availableIndices[0];
    },
    []
  );

  // Start timer
  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setGameState((prev) => {
        if (!prev || !prev.isRunning) return prev;

        const newTime = prev.timeRemaining - 1;
        if (newTime <= 0) {
          if (timerRef.current) clearInterval(timerRef.current);
          return { ...prev, timeRemaining: 0, isRunning: false, isFinished: true };
        }
        return { ...prev, timeRemaining: newTime };
      });
    }, 1000);
  }, []);

  // Stop timer
  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Initialize game
  const initGame = useCallback((contestantName: string, duration: number) => {
    const letters = createInitialLetters();
    setGameState({
      contestantName,
      duration,
      score: 0,
      letters,
      currentIndex: 0,
      timeRemaining: duration,
      isRunning: false,
      isFinished: false,
      history: [],
    });
  }, []);

  // Toggle timer (start/pause)
  const toggleTimer = useCallback(() => {
    setGameState((prev) => {
      if (!prev || prev.isFinished) return prev;

      if (prev.isRunning) {
        stopTimer();
        return { ...prev, isRunning: false };
      } else {
        startTimer();
        return { ...prev, isRunning: true };
      }
    });
  }, [startTimer, stopTimer]);

  // Create history entry
  const createHistoryEntry = useCallback((state: GameState): HistoryEntry => ({
    prevScore: state.score,
    prevLetters: state.letters.map((l) => ({ ...l })),
    prevCurrentIndex: state.currentIndex,
  }), []);

  // Handle correct answer
  const handleCorrect = useCallback(() => {
    setGameState((prev) => {
      if (!prev || prev.isFinished || !prev.isRunning) return prev;

      const history = [...prev.history, createHistoryEntry(prev)];
      const newLetters = prev.letters.map((l, i) =>
        i === prev.currentIndex ? { ...l, state: 'correct' as const } : l
      );
      const newScore = prev.score + POINTS_PER_CORRECT;
      const nextIndex = getNextAvailableIndex(newLetters, prev.currentIndex);

      if (nextIndex === null) {
        stopTimer();
        return {
          ...prev,
          letters: newLetters,
          score: newScore,
          history,
          isRunning: false,
          isFinished: true,
        };
      }

      return {
        ...prev,
        letters: newLetters,
        score: newScore,
        currentIndex: nextIndex,
        history,
      };
    });
  }, [createHistoryEntry, getNextAvailableIndex, stopTimer]);

  // Handle wrong answer
  const handleWrong = useCallback(() => {
    setGameState((prev) => {
      if (!prev || prev.isFinished || !prev.isRunning) return prev;

      const history = [...prev.history, createHistoryEntry(prev)];
      const newLetters = prev.letters.map((l, i) =>
        i === prev.currentIndex ? { ...l, state: 'wrong' as const } : l
      );
      const nextIndex = getNextAvailableIndex(newLetters, prev.currentIndex);

      if (nextIndex === null) {
        stopTimer();
        return {
          ...prev,
          letters: newLetters,
          history,
          isRunning: false,
          isFinished: true,
        };
      }

      return {
        ...prev,
        letters: newLetters,
        currentIndex: nextIndex,
        history,
      };
    });
  }, [createHistoryEntry, getNextAvailableIndex, stopTimer]);

  // Handle pass
  const handlePass = useCallback(() => {
    setGameState((prev) => {
      if (!prev || prev.isFinished || !prev.isRunning) return prev;

      const history = [...prev.history, createHistoryEntry(prev)];
      const newLetters = prev.letters.map((l, i) =>
        i === prev.currentIndex ? { ...l, state: 'pass' as const } : l
      );
      const nextIndex = getNextAvailableIndex(newLetters, prev.currentIndex);

      if (nextIndex === null) {
        stopTimer();
        return {
          ...prev,
          letters: newLetters,
          history,
          isRunning: false,
          isFinished: true,
        };
      }

      return {
        ...prev,
        letters: newLetters,
        currentIndex: nextIndex,
        history,
      };
    });
  }, [createHistoryEntry, getNextAvailableIndex, stopTimer]);

  // Handle undo
  const handleUndo = useCallback(() => {
    setGameState((prev) => {
      if (!prev || prev.history.length === 0) return prev;

      const lastEntry = prev.history[prev.history.length - 1];
      const newHistory = prev.history.slice(0, -1);

      // If the game was finished but there's still time remaining,
      // restore isRunning to true so buttons become active again
      const shouldResumeRunning = prev.isFinished && prev.timeRemaining > 0;

      if (shouldResumeRunning) {
        startTimer();
      }

      return {
        ...prev,
        score: lastEntry.prevScore,
        letters: lastEntry.prevLetters,
        currentIndex: lastEntry.prevCurrentIndex,
        history: newHistory,
        isFinished: false,
        isRunning: shouldResumeRunning ? true : prev.isRunning,
      };
    });
  }, [startTimer]);

  // Set time remaining manually
  const setTimeRemaining = useCallback((newTime: number) => {
    setGameState((prev) => {
      if (!prev) return prev;
      const clampedTime = Math.max(0, Math.min(9999, newTime));
      return { ...prev, timeRemaining: clampedTime };
    });
  }, []);

  // Reset game
  const resetGame = useCallback(() => {
    stopTimer();
    setGameState(null);
  }, [stopTimer]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return {
    gameState,
    initGame,
    toggleTimer,
    handleCorrect,
    handleWrong,
    handlePass,
    handleUndo,
    resetGame,
    setTimeRemaining,
  };
}

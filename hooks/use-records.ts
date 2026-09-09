'use client';

import { useState, useEffect, useCallback } from 'react';
import type { LetterStatus } from '@/lib/game-types';

export interface GameRecord {
  id: string;
  contestantName: string;
  score: number;
  createdAt: number;
  letters?: LetterStatus[];
}

const STORAGE_KEY = 'harf-cemberi-records';

export function useRecords() {
  const [records, setRecords] = useState<GameRecord[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load records from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setRecords(parsed);
        }
      }
    } catch (error) {
      console.error('Failed to load records from localStorage:', error);
    }
    setIsLoaded(true);
  }, []);

  // Save records to localStorage whenever they change
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
      } catch (error) {
        console.error('Failed to save records to localStorage:', error);
      }
    }
  }, [records, isLoaded]);

  // Add a new record
  const addRecord = useCallback((contestantName: string, score: number, letters: LetterStatus[]) => {
    const newRecord: GameRecord = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      contestantName,
      score,
      createdAt: Date.now(),
      letters: letters.map((letter) => ({ ...letter })),
    };
    setRecords((prev) => [...prev, newRecord]);
  }, []);

  // Update an existing record
  const updateRecord = useCallback((id: string, contestantName: string, score: number) => {
    setRecords((prev) =>
      prev.map((record) =>
        record.id === id ? { ...record, contestantName, score } : record
      )
    );
  }, []);

  // Delete a record
  const deleteRecord = useCallback((id: string) => {
    setRecords((prev) => prev.filter((record) => record.id !== id));
  }, []);

  return {
    records,
    isLoaded,
    addRecord,
    updateRecord,
    deleteRecord,
  };
}

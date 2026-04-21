// Turkish alphabet without Ğ (as specified)
export const TURKISH_ALPHABET = [
  'A', 'B', 'C', 'Ç', 'D', 'E', 'F', 'G', 'H', 'I', 'İ', 'J', 'K', 'L', 'M',
  'N', 'O', 'Ö', 'P', 'R', 'S', 'Ş', 'T', 'U', 'Ü', 'V', 'Y', 'Z'
] as const;

export type Letter = typeof TURKISH_ALPHABET[number];

export type LetterState = 'pending' | 'correct' | 'wrong' | 'pass';

export interface LetterStatus {
  letter: Letter;
  state: LetterState;
}

export interface GameState {
  contestantName: string;
  duration: number;
  score: number;
  letters: LetterStatus[];
  currentIndex: number;
  timeRemaining: number;
  isRunning: boolean;
  isFinished: boolean;
  history: HistoryEntry[];
}

export interface HistoryEntry {
  prevScore: number;
  prevLetters: LetterStatus[];
  prevCurrentIndex: number;
}

export const POINTS_PER_CORRECT = 100;

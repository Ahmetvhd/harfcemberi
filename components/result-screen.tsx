'use client';

import { Button } from '@/components/ui/button';
import { LetterWheel } from '@/components/letter-wheel';
import { Trophy, User, Star } from 'lucide-react';
import type { GameState } from '@/lib/game-types';

interface ResultScreenProps {
  gameState: GameState;
  onUndo: () => void;
  onReset: () => void;
}

export function ResultScreen({ gameState, onUndo, onReset }: ResultScreenProps) {
  const { contestantName, score, letters, timeRemaining, history } = gameState;
  const title = timeRemaining === 0 ? 'Süre Bitti!' : 'Oyun Tamamlandı!';

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-background/95 p-4 md:p-6 flex flex-col">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-pass/10 via-transparent to-transparent pointer-events-none" />

      <header className="relative z-10 flex items-center justify-between mb-4 md:mb-6 gap-3 flex-wrap">
        <div className="flex items-center gap-3 bg-card/60 backdrop-blur-sm border border-border/50 rounded-xl px-4 py-3 shadow-lg">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
            <User className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Yarışmacı</p>
            <h1 className="text-lg font-semibold text-foreground">{contestantName}</h1>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-card/60 backdrop-blur-sm border border-pass/40 rounded-xl px-5 py-3 shadow-lg shadow-pass/10">
          <div className="relative">
            <div className="absolute inset-0 bg-pass/30 rounded-full blur-md scale-150" />
            <Trophy className="relative w-7 h-7 text-pass drop-shadow-lg" />
          </div>
          <h2 className="text-2xl font-bold text-foreground tracking-tight">{title}</h2>
        </div>

        <div className="flex items-center gap-3 bg-card/60 backdrop-blur-sm border border-border/50 rounded-xl px-5 py-3 shadow-lg">
          <Star className="w-5 h-5 text-pass" />
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Toplam Puan</p>
            <p className="text-3xl font-bold text-foreground tabular-nums leading-none">{score}</p>
          </div>
          <Star className="w-5 h-5 text-pass" />
        </div>
      </header>

      <main className="relative z-10 flex-1 flex flex-col items-center justify-center gap-8">
        <div className="relative pointer-events-none select-none">
          <LetterWheel letters={letters} currentIndex={-1} />
        </div>
      </main>

      <footer className="relative z-10 py-4 md:py-6 flex justify-center gap-4">
        <Button
          onClick={onUndo}
          disabled={history.length === 0}
          variant="outline"
          className="px-8 py-6 text-base border-border/60 text-foreground bg-card/60 backdrop-blur-sm hover:bg-accent/50 rounded-xl"
        >
          Geri Al
        </Button>
        <Button
          onClick={onReset}
          className="px-8 py-6 text-base bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl shadow-lg shadow-primary/25"
        >
          Yeni Oyun
        </Button>
      </footer>
    </div>
  );
}

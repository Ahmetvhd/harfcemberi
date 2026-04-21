'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { LetterWheel } from '@/components/letter-wheel';
import { GameControls } from '@/components/game-controls';
import { Play, Pause, Clock, User, Star } from 'lucide-react';
import type { GameState } from '@/lib/game-types';

interface GameScreenProps {
  gameState: GameState;
  onToggleTimer: () => void;
  onCorrect: () => void;
  onWrong: () => void;
  onPass: () => void;
  onUndo: () => void;
  onReset: () => void;
  onSetTimeRemaining: (time: number) => void;
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function GameScreen({
  gameState,
  onToggleTimer,
  onCorrect,
  onWrong,
  onPass,
  onUndo,
  onReset,
  onSetTimeRemaining,
}: GameScreenProps) {
  const { contestantName, score, letters, currentIndex, timeRemaining, isRunning, isFinished, history } =
    gameState;

  const [isEditingTime, setIsEditingTime] = useState(false);
  const [editTimeValue, setEditTimeValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleTimeClick = () => {
    if (isFinished) return;
    setEditTimeValue(timeRemaining.toString());
    setIsEditingTime(true);
  };

  const handleTimeConfirm = () => {
    const newTime = parseInt(editTimeValue, 10);
    if (!isNaN(newTime) && newTime >= 0) {
      onSetTimeRemaining(newTime);
    }
    setIsEditingTime(false);
  };

  const handleTimeKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleTimeConfirm();
    } else if (e.key === 'Escape') {
      setIsEditingTime(false);
    }
  };

  useEffect(() => {
    if (isEditingTime && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditingTime]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-background/95 p-4 md:p-6 flex flex-col">
      {/* Subtle background pattern */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent pointer-events-none" />
      
      {/* Header */}
      <header className="relative z-10 flex items-center justify-between mb-4 md:mb-6">
        {/* Contestant card */}
        <div className="flex items-center gap-3 bg-card/60 backdrop-blur-sm border border-border/50 rounded-xl px-4 py-3 shadow-lg">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
            <User className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Yarışmacı</p>
            <h1 className="text-lg font-semibold text-foreground">{contestantName}</h1>
          </div>
        </div>

        {/* Timer and controls */}
        <div className="flex items-center gap-3">
          <Button
            onClick={onToggleTimer}
            disabled={isFinished}
            variant="outline"
            size="sm"
            className="border-border/60 text-foreground bg-card/60 backdrop-blur-sm hover:bg-card/80 rounded-lg px-4 transition-all duration-200"
          >
            {isRunning ? (
              <>
                <Pause className="w-4 h-4 mr-2" />
                Durdur
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Başlat
              </>
            )}
          </Button>
          
          {/* Timer display */}
          <div 
            className={`flex items-center gap-2 bg-card/60 backdrop-blur-sm border border-border/50 rounded-xl px-4 py-3 shadow-lg transition-all duration-300 ${
              timeRemaining <= 10 ? 'border-wrong/50 bg-wrong/10' : ''
            }`}
          >
            <Clock className={`w-5 h-5 ${timeRemaining <= 10 ? 'text-wrong' : 'text-muted-foreground'}`} />
            {isEditingTime ? (
              <input
                ref={inputRef}
                type="number"
                min="0"
                max="9999"
                value={editTimeValue}
                onChange={(e) => setEditTimeValue(e.target.value)}
                onBlur={handleTimeConfirm}
                onKeyDown={handleTimeKeyDown}
                className="w-24 text-3xl font-mono font-bold tabular-nums bg-background/80 border border-border rounded-lg px-2 py-1 text-foreground outline-none focus:ring-2 focus:ring-primary"
              />
            ) : (
              <span
                onClick={handleTimeClick}
                title="Süreyi düzenlemek için tıklayın"
                className={`text-3xl font-mono font-bold tabular-nums transition-all duration-300 cursor-pointer hover:opacity-70 ${
                  timeRemaining <= 10 ? 'text-wrong animate-pulse' : 'text-foreground'
                } ${isFinished ? 'cursor-default hover:opacity-100' : ''}`}
              >
                {formatTime(timeRemaining)}
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center gap-6">
        {/* Score display */}
        <div className="flex items-center gap-3 bg-card/60 backdrop-blur-sm border border-border/50 rounded-2xl px-8 py-4 shadow-xl">
          <Star className="w-6 h-6 text-pass" />
          <div className="text-center">
            <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium">Puan</p>
            <p className="text-5xl font-bold text-foreground tabular-nums tracking-tight">{score}</p>
          </div>
          <Star className="w-6 h-6 text-pass" />
        </div>

        {/* Letter wheel */}
        <div className="relative">
          <LetterWheel letters={letters} currentIndex={currentIndex} />
        </div>

      </main>

      {/* Controls */}
      <footer className="relative z-10 py-4 md:py-6">
        <GameControls
          onCorrect={onCorrect}
          onWrong={onWrong}
          onPass={onPass}
          onUndo={onUndo}
          onReset={onReset}
          canUndo={history.length > 0}
          isDisabled={!isRunning || isFinished}
        />
      </footer>
    </div>
  );
}

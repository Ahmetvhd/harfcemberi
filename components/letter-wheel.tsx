'use client';

import { cn } from '@/lib/utils';
import type { LetterStatus } from '@/lib/game-types';

interface LetterWheelProps {
  letters: LetterStatus[];
  currentIndex: number;
}

export function LetterWheel({ letters, currentIndex }: LetterWheelProps) {
  const radius = 155;
  const centerX = 200;
  const centerY = 200;

  return (
    <div className="relative w-[400px] h-[400px] mx-auto">
      {/* Outer decorative ring with gradient */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 via-transparent to-primary/10" />
      <div className="absolute inset-1 rounded-full border border-border/50" />
      <div className="absolute inset-2 rounded-full border border-border/30" />
      
      {/* Letter track ring */}
      <div className="absolute inset-6 rounded-full bg-card/30 backdrop-blur-sm border border-border/40" />

      {/* Inner circle for current letter display */}
      <div className="absolute inset-[90px] rounded-full bg-gradient-to-br from-card via-card to-card/80 border border-border/60 shadow-2xl shadow-black/30 flex items-center justify-center overflow-hidden">
        {/* Inner glow effect */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/5 to-transparent" />
        
        {/* Current letter highlight ring */}
        <div 
          className={cn(
            "absolute inset-3 rounded-full transition-all duration-300",
            letters[currentIndex]?.state === 'correct' && 'bg-correct/10 shadow-[inset_0_0_40px_rgba(34,197,94,0.2)]',
            letters[currentIndex]?.state === 'wrong' && 'bg-wrong/10 shadow-[inset_0_0_40px_rgba(239,68,68,0.2)]',
            letters[currentIndex]?.state === 'pass' && 'bg-pass/10 shadow-[inset_0_0_40px_rgba(234,179,8,0.2)]',
            (letters[currentIndex]?.state === 'pending' || letters[currentIndex]?.state === undefined) && 
              'bg-primary/5 shadow-[inset_0_0_60px_rgba(99,102,241,0.15)]'
          )}
        />
        
        <div className="relative text-center z-10">
          <span
            className={cn(
              'text-8xl font-bold transition-all duration-300 drop-shadow-lg',
              letters[currentIndex]?.state === 'correct' && 'text-correct',
              letters[currentIndex]?.state === 'wrong' && 'text-wrong',
              letters[currentIndex]?.state === 'pass' && 'text-pass',
              (letters[currentIndex]?.state === 'pending' ||
                letters[currentIndex]?.state === undefined) &&
                'text-white drop-shadow-[0_2px_10px_rgba(255,255,255,0.3)]'
            )}
          >
            {letters[currentIndex]?.letter}
          </span>
        </div>
      </div>

      {/* Letters positioned in a circle */}
      {letters.map((letterStatus, index) => {
        const angle = (index / letters.length) * 2 * Math.PI - Math.PI / 2;
        const x = centerX + radius * Math.cos(angle) - 18;
        const y = centerY + radius * Math.sin(angle) - 18;

        const isCurrent = index === currentIndex;

        return (
          <div
            key={letterStatus.letter}
            className={cn(
              'absolute w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 shadow-md',
              letterStatus.state === 'correct' && 'bg-correct text-white font-bold shadow-correct/30',
              letterStatus.state === 'wrong' && 'bg-wrong text-white font-bold shadow-wrong/30',
              letterStatus.state === 'pass' && 'bg-pass text-black font-bold shadow-pass/30',
              letterStatus.state === 'pending' && !isCurrent && 'bg-secondary/80 text-muted-foreground border border-border/50',
              isCurrent && letterStatus.state === 'pending' && 'ring-2 ring-white/70 ring-offset-2 ring-offset-background scale-125 z-10 bg-slate-800 text-white font-extrabold shadow-lg shadow-black/50 border border-white/20',
              isCurrent && letterStatus.state !== 'pending' && 'ring-2 ring-white ring-offset-2 ring-offset-background scale-125 z-10 font-extrabold'
            )}
            style={{ left: x, top: y }}
          >
            {letterStatus.letter}
          </div>
        );
      })}
    </div>
  );
}

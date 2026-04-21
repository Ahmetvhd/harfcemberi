'use client';

import { Button } from '@/components/ui/button';
import { Undo2, RotateCcw, X, ArrowRight, Check } from 'lucide-react';

interface GameControlsProps {
  onCorrect: () => void;
  onWrong: () => void;
  onPass: () => void;
  onUndo: () => void;
  onReset: () => void;
  canUndo: boolean;
  isDisabled: boolean;
}

export function GameControls({
  onCorrect,
  onWrong,
  onPass,
  onUndo,
  onReset,
  canUndo,
  isDisabled,
}: GameControlsProps) {
  return (
    <div className="space-y-5">
      {/* Main action buttons */}
      <div className="flex items-center justify-center gap-16">
        <Button
          onClick={onWrong}
          disabled={isDisabled}
          size="lg"
          className="w-36 h-18 bg-wrong hover:bg-wrong/90 text-white font-bold text-xl rounded-xl shadow-lg shadow-wrong/25 transition-all duration-200 active:scale-95 disabled:opacity-40 disabled:shadow-none border-b-4 border-wrong/60 hover:border-wrong/40"
        >
          <X className="w-6 h-6 mr-2" strokeWidth={3} />
          Yanlış
        </Button>
        <Button
          onClick={onPass}
          disabled={isDisabled}
          size="lg"
          className="w-36 h-18 bg-pass hover:bg-pass/90 text-black font-bold text-xl rounded-xl shadow-lg shadow-pass/25 transition-all duration-200 active:scale-95 disabled:opacity-40 disabled:shadow-none border-b-4 border-pass/60 hover:border-pass/40"
        >
          <ArrowRight className="w-6 h-6 mr-2" strokeWidth={3} />
          Pas
        </Button>
        <Button
          onClick={onCorrect}
          disabled={isDisabled}
          size="lg"
          className="w-36 h-18 bg-correct hover:bg-correct/90 text-white font-bold text-xl rounded-xl shadow-lg shadow-correct/25 transition-all duration-200 active:scale-95 disabled:opacity-40 disabled:shadow-none border-b-4 border-correct/60 hover:border-correct/40"
        >
          <Check className="w-6 h-6 mr-2" strokeWidth={3} />
          Doğru
        </Button>
      </div>

      {/* Secondary buttons */}
      <div className="flex items-center justify-center gap-4">
        <Button
          onClick={onUndo}
          disabled={!canUndo}
          variant="outline"
          className="px-5 py-2 border-border/60 text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-lg transition-all duration-200 disabled:opacity-30"
        >
          <Undo2 className="w-4 h-4 mr-2" />
          Geri Al
        </Button>
        <Button
          onClick={onReset}
          variant="outline"
          className="px-5 py-2 border-border/60 text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-lg transition-all duration-200"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Yeni Oyun
        </Button>
      </div>
    </div>
  );
}

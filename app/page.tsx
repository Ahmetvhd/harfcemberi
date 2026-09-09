'use client';

import { useEffect, useRef } from 'react';
import { SetupScreen } from '@/components/setup-screen';
import { GameScreen } from '@/components/game-screen';
import { ResultScreen } from '@/components/result-screen';
import { useGame } from '@/hooks/use-game';
import { useRecords } from '@/hooks/use-records';

export default function Home() {
  const {
    gameState,
    initGame,
    toggleTimer,
    handleCorrect,
    handleWrong,
    handlePass,
    handleUndo,
    resetGame,
    setTimeRemaining,
  } = useGame();

  const { records, addRecord, updateRecord, deleteRecord } = useRecords();
  
  // Track if we've already saved the record for the current game session
  const hasRecordedRef = useRef(false);

  // Reset the recorded flag when a new game starts
  useEffect(() => {
    if (gameState && !gameState.isFinished) {
      hasRecordedRef.current = false;
    }
  }, [gameState?.isFinished, gameState]);

  // Save record when game finishes
  useEffect(() => {
    if (gameState?.isFinished && !hasRecordedRef.current) {
      addRecord(gameState.contestantName, gameState.score, gameState.letters);
      hasRecordedRef.current = true;
    }
  }, [gameState?.isFinished, gameState?.contestantName, gameState?.score, addRecord]);

  if (!gameState) {
    return (
      <SetupScreen
        onStartGame={initGame}
        records={records}
        onUpdateRecord={updateRecord}
        onDeleteRecord={deleteRecord}
      />
    );
  }

  if (gameState.isFinished) {
    return (
      <ResultScreen
        gameState={gameState}
        onUndo={handleUndo}
        onReset={resetGame}
      />
    );
  }

  return (
    <GameScreen
      gameState={gameState}
      onToggleTimer={toggleTimer}
      onCorrect={handleCorrect}
      onWrong={handleWrong}
      onPass={handlePass}
      onUndo={handleUndo}
      onReset={resetGame}
      onSetTimeRemaining={setTimeRemaining}
    />
  );
}

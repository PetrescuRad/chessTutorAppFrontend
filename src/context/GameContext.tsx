import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

interface GameContextType {
  currentFen: string;
  setCurrentFen: (fen: string) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
  const [currentFen, setCurrentFen] = useState<string>('');

  return (
    <GameContext.Provider value={{ currentFen, setCurrentFen }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
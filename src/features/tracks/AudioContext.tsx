import { createContext, useContext, useState } from 'react';

const AudioCtx = createContext<{
  currentId: string | null;
  setCurrent: (id: string | null) => void;
}>({ currentId: null, setCurrent: () => {} });

export const AudioProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentId, setCurrent] = useState<string | null>(null);
  return (
    <AudioCtx.Provider value={{ currentId, setCurrent }}>
      {children}
    </AudioCtx.Provider>
  );
};

export const useAudioCtx = () => useContext(AudioCtx);

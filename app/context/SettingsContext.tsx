import React, { createContext, useState, useContext } from 'react';

type SettingsContextType = {
  selectedSound: string;
  volume: number;
  isAlertEnabled: boolean;
  setSelectedSound: (sound: string) => void;
  setVolume: (volume: number) => void;
  setIsAlertEnabled: (enabled: boolean) => void;
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedSound, setSelectedSound] = useState<string>('bell');
  const [volume, setVolume] = useState<number>(50);
  const [isAlertEnabled, setIsAlertEnabled] = useState<boolean>(true);

  return (
    <SettingsContext.Provider
      value={{ selectedSound, volume, isAlertEnabled, setSelectedSound, setVolume, setIsAlertEnabled }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
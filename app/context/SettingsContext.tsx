import React, { createContext, useState, useContext } from 'react';

type SoundOption = {
  label: string;
  value: string;
  source: string;
};

type SettingsContextType = {
  selectedSound: SoundOption;
  setSelectedSound: (sound: SoundOption) => void;
  volume: number;
  setVolume: (volume: number) => void;
  isAlertEnabled: boolean;
  setIsAlertEnabled: (enabled: boolean) => void;
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedSound, setSelectedSound] = useState<SoundOption>({
    label: 'Chimes',
    value: 'chimes',
    source: require('@/assets/sounds/chime.mp3'),
  });
  const [volume, setVolume] = useState<number>(50);
  const [isAlertEnabled, setIsAlertEnabled] = useState<boolean>(true);

  return (
    <SettingsContext.Provider
      value={{ selectedSound, setSelectedSound, volume, setVolume, isAlertEnabled, setIsAlertEnabled }}
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
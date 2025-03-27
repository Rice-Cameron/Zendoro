export type SoundOption = {
  label: string;
  value: string;
  source: any; // Use `any` because `require` returns a dynamic type
};

export const soundOptions: SoundOption[] = [
  { label: 'Chimes', value: 'chimes', source: require('@/assets/sounds/chime.mp3') },
  { label: 'Rain', value: 'rain', source: require('@/assets/sounds/rain.mp3') },
  { label: 'Meditation', value: 'meditation', source: require('@/assets/sounds/meditation.mp3') },
  { label: 'Tibetan Bowl', value: 'tibetan', source: require('@/assets/sounds/tibetan.mp3') },
];
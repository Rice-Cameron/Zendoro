import { Audio } from 'expo-av';

class SoundManager {
  private sound: Audio.Sound | null = null;

  async playSound(soundSource: any, volume = 1.0) {
    // Stop any currently playing sound
    if (this.sound) {
      await this.sound.unloadAsync();
    }

    try {
      // Create and load the sound
      const { sound } = await Audio.Sound.createAsync(soundSource);
      this.sound = sound;

      // Set volume
      await sound.setVolumeAsync(volume / 100);

      // Play the sound
      await sound.playAsync();
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  }

  async stopSound() {
    if (this.sound) {
      await this.sound.stopAsync();
      await this.sound.unloadAsync();
      this.sound = null;
    }
  }
}

export default new SoundManager();
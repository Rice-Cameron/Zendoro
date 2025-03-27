import { Audio } from 'expo-av';

class SoundManager {
  private sound: Audio.Sound | null = null;

  async playSound(soundSource: any, volume = 1.0) {
    // Validate soundSource
    if (!soundSource || (typeof soundSource !== 'number' && !soundSource.uri)) {
      console.error('Invalid sound source:', soundSource);
      return;
    }

    // Stop any currently playing sound
    if (this.sound) {
      await this.sound.unloadAsync();
      this.sound = null;
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
      try {
        await this.sound.stopAsync();
        await this.sound.unloadAsync();
        this.sound = null;
      } catch (error) {
        console.error('Error stopping sound:', error);
      }
    }
  }
}

export default new SoundManager();
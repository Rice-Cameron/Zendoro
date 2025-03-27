import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  ImageBackground, 
  Switch, 
  Modal, 
  FlatList 
} from 'react-native';
import Slider from '@react-native-community/slider';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import SoundManager from '../SoundManager';

// Type for sound options
type SoundOption = {
  label: string;
  value: string;
  source: string;
};

export default function PomodoroSettingsScreen() {
  const insets = useSafeAreaInsets();
  const [selectedSound, setSelectedSound] = useState<string>('bell');
  const [volume, setVolume] = useState<number>(50);
  const [isAlertEnabled, setIsAlertEnabled] = useState<boolean>(true);
  const [isDropdownVisible, setIsDropdownVisible] = useState<boolean>(false);


  const soundOptions: SoundOption[] = [
    { label: 'Chimes', value: 'chimes', source: require('@/assets/sounds/chime.mp3') },
    { label: 'Rain', value: 'rain', source: require('@/assets/sounds/rain.mp3') },
    { label: 'Meditation', value: 'meditation', source: require('@/assets/sounds/meditation.mp3') },
    { label: 'Tibetan Bowl', value: 'tibetan', source: require('@/assets/sounds/tibetan.mp3') },  
  ];

  const handleSoundSelect = (sound: SoundOption) => {
    setSelectedSound(sound.value);
    handleSoundPreview(sound); // Play the sound preview
    setIsDropdownVisible(false);
  };

  const handleSoundPreview = (soundOption: SoundOption) => {
    // Preview the sound when selected in dropdown
    SoundManager.playSound(soundOption.source, volume);
  };

  const saveSettings = () => {
    // Save selected sound and other settings
    console.log('Settings saved:', { 
      sound: selectedSound, 
      volume, 
      alertEnabled: isAlertEnabled 
    });
    
    // Optional: Play save confirmation sound
    if (isAlertEnabled) {
      const selectedSoundOption = soundOptions.find(
        sound => sound.value === selectedSound
      );
      if (selectedSoundOption) {
        SoundManager.playSound(selectedSoundOption.source, volume);
      }
    }
  };
  
  return (
    <ImageBackground
      source={require('@/assets/images/zen.jpg')}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={[styles.container, { 
        paddingTop: insets.top + 20,
        paddingBottom: insets.bottom + 20 
      }]}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>Pomodoro Settings</Text>
        </View>

        <View style={styles.settingSection}>
          <View style={styles.switchContainer}>
            <Text style={styles.sectionTitle}>Enable Alert Sound</Text>
            <Switch
              value={isAlertEnabled}
              onValueChange={setIsAlertEnabled}
              trackColor={{ 
                false: '#D2B48C',
                true: '#5C8C46'
              }}
              thumbColor={isAlertEnabled ? '#F5DEB3' : '#E6D2B5'}
            />
          </View>
        </View>

        {isAlertEnabled && (
          <>
            <View style={styles.settingSection}>
              <Text style={styles.sectionTitle}>Alert Sound</Text>
              <TouchableOpacity 
                style={styles.dropdownContainer}
                onPress={() => setIsDropdownVisible(true)}
              >
                <Text style={styles.dropdownText}>
                  {soundOptions.find(sound => sound.value === selectedSound)?.label || 'Select Sound'}
                </Text>
                <Ionicons name="chevron-down" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <Modal
              transparent={true}
              visible={isDropdownVisible}
              animationType="slide"
              onRequestClose={() => setIsDropdownVisible(false)}
            >
              <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                  <Text style={styles.modalTitle}>Select Alert Sound</Text>
                  <FlatList
                    data={soundOptions}
                    keyExtractor={(item) => item.value}
                    renderItem={({ item }) => (
                      <TouchableOpacity 
                        style={styles.dropdownItem}
                        onPress={() => handleSoundSelect(item)}
                      >
                        <Text style={styles.dropdownItemText}>{item.label}</Text>
                        {selectedSound === item.value && (
                          <Ionicons name="checkmark" size={24} color="#5C8C46" />
                        )}
                      </TouchableOpacity>
                    )}
                  />
                  <TouchableOpacity 
                    style={styles.cancelButton}
                    onPress={() => setIsDropdownVisible(false)}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>

            <View style={styles.settingSection}>
              <Text style={styles.sectionTitle}>Alert Volume</Text>
              <View style={styles.sliderContainer}>
                <Ionicons name="volume-low" size={24} color="#333" />
                <Slider
                  style={styles.slider}
                  minimumValue={0}
                  maximumValue={100}
                  step={1}
                  value={volume}
                  onValueChange={setVolume}
                  minimumTrackTintColor="#5C8C46"
                  maximumTrackTintColor="#D2B48C"
                  thumbTintColor="#5C8C46"
                />
                <Ionicons name="volume-high" size={24} color="#333" />
              </View>
              <Text style={styles.volumeText}>{volume}%</Text>
            </View>
          </>
        )}

        <TouchableOpacity 
          style={styles.saveButton} 
          onPress={saveSettings}
        >
          <Text style={styles.saveButtonText}>Save Settings</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  settingSection: {
    marginBottom: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 10,
    padding: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  saveButton: {
    backgroundColor: '#5C8C46',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  dropdownContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
  },
  dropdownText: {
    fontSize: 16,
    color: '#333',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  dropdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  dropdownItemText: {
    fontSize: 16,
  },
  cancelButton: {
    marginTop: 15,
    padding: 15,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  slider: {
    flex: 1,
    marginHorizontal: 10,
  },
  volumeText: {
    textAlign: 'center',
    marginTop: 10,
    fontSize: 16,
    color: '#333',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
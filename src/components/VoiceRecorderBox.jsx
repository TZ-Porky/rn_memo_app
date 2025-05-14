import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import React, {useRef, useEffect} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Voice from '@react-native-voice/voice';

// Get the height of the window
const {height} = Dimensions.get('window');

const VoiceRecorderBox = ({isVisible, onClosePressed, onSpeechResult}) => {
  // Animated value for the slide animation
  // This value will be used to animate the position of the component
  const slideAnim = useRef(new Animated.Value(height)).current;

  // State to manage the result of speech recognition
  // This state will store the recognized text
  const [result, setResult] = React.useState('');

  // State to manage errors
  // This state will store any error messages
  const [error, setError] = React.useState('');

  // State to manage recording status
  // This state will indicate whether the recording is in progress or not
  const [isRecording, setIsRecording] = React.useState(false);

  // ================================================================== //

  // This function is called when the component mounts
  useEffect(() => {
    // Initialize Voice
    // This function is called to initialize the Voice library
    Voice.onSpeechStart = () => setIsRecording(true);

    // End of speech recognition
    // This function is called when the speech recognition ends
    Voice.onSpeechEnd = () => setIsRecording(false);

    // Handle speech recognition errors
    // This function is called when there is an error during speech recognition
    Voice.onSpeechError = err =>
      setError(err?.error || 'Une erreur inconnue est survenue');

    // Handle speech recognition results
    // This function is called when the speech recognition results are available
    Voice.onSpeechResults = results => {
      if (results.value && results.value.length > 0) {
        setResult(results.value[0]);
        const spokenText = results.value?.[0] || '';
        setResult(spokenText);
        if (onSpeechResult) {
          onSpeechResult(spokenText);
        }
      }
    };

    return () => {
      // Clean up the event listeners when the component unmounts
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, [onSpeechResult]);

  // Animate the position
  // This function is called to animate the position of the component
  // It uses the Animated API to create a slide effect
  // The component will slide up when isVisible is true and slide down when it is false
  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: isVisible ? 0 : height,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isVisible, slideAnim]);

  // This function is called when the close button is pressed
  const animatedStyle = {
    transform: [{translateY: slideAnim}],
  };

  // ================================================================== //

  // Request microphone permission for Android
  // This function is called to request permission to access the microphone
  const requestMicrophonePermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          {
            title: 'Permission Microphone',
            message:
              "L'application a besoin d'accéder à votre microphone " +
              'pour la reconnaissance vocale.',
            buttonNeutral: 'Plus tard',
            buttonNegative: 'Refuser',
            buttonPositive: 'Autoriser',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Permission microphone accordée');
          return true;
        } else {
          console.log('Permission microphone refusée');
          return false;
        }
      } catch (err) {
        console.warn(err);
        return false;
      }
    } else {
      return true;
    }
  };

  // Start recording
  // This function is called to start recording audio
  const startRecording = async () => {
    const hasPermission = await requestMicrophonePermission();
    if (hasPermission) {
      try {
        console.log('[Voice] Starting...');
        await Voice.destroy;
        await Voice.start('fr-FR');
        setIsRecording(true);
      } catch (e) {
        console.log('[Voice] Start error:', e);
        setError(e.message || 'Failed to start recording');
      }
    } else {
      console.log('[Voice] Permission denied');
      setError('Permission microphone non accordée.');
    }
  };

  // Stop recording
  // This function is called to stop recording audio
  const stopRecording = async () => {
    try {
      await Voice.stop();
      setIsRecording(false);
    } catch (e) {
      setError(e.message || 'Failed to stop recording');
    }
  };

  // ================================================================== //

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <View style={styles.toolsContainer}>
        <TouchableOpacity
          style={styles.toolsItem}
          onPress={isRecording ? stopRecording : startRecording}>
          <Icon
            name="microphone"
            style={
              isRecording
                ? styles.toolsItemIconActive
                : styles.toolsItemIconInactive
            }
          />
        </TouchableOpacity>
        <Text style={styles.toolsItemText}>
          {isRecording
            ? 'Enregistrement en cours...'
            : 'Appuyez pour enregistrer'}
        </Text>
      </View>
      <TouchableOpacity style={styles.closeButton} onPress={onClosePressed}>
        <Icon name="times" size={20} />
      </TouchableOpacity>
    </Animated.View>
  );
};

export default VoiceRecorderBox;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#FFF',
    borderRadius: 0,
    margin: 0,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    elevation: 5,
  },
  toolsContainer: {
    margin: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  toolsItem: {
    marginRight: 10,
    alignItems: 'center',
  },
  toolsItemIconInactive: {
    fontSize: 20,
    color: '#EE0808',
  },
  toolsItemIconActive: {
    fontSize: 20,
    color: '#008000',
  },
  toolsItemText: {
    fontSize: 12,
    color: '#000',
  },
  closeButton: {
    padding: 5,
  },
  transcriptionText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#333',
  },
});

import {View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions} from 'react-native';
import React, { useRef, useEffect } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome5';

const { height } = Dimensions.get('window');

const VoiceRecorderBox = ({isVisible, onClosePressed}) => {
  const slideAnim = useRef(new Animated.Value(height)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: isVisible ? 0 : height,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isVisible, slideAnim]);

  const animatedStyle = {
    transform: [{ translateY: slideAnim }],
  };

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <View style={styles.toolsContainer}>
        <TouchableOpacity style={styles.toolsItem}>
          <Icon name="microphone" style={styles.toolsItemIcon} />
        </TouchableOpacity>
        <Text style={styles.toolsItemText}>Appuyer pour enregistrer</Text>
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
  toolsItemIcon: {
    fontSize: 20,
    color: '#EE0808',
  },
  toolsItemText: {
    fontSize: 12,
    color: '#000',
  },
  closeButton: {
    padding: 5,
  },
});

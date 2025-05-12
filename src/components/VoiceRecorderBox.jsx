import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome5';

const VoiceRecorderBox = ({onClosePressed}) => {
  return (
    <View>
      <View style={styles.container}>
        <View style={styles.toolsContainer}>
          <TouchableOpacity style={styles.toolsItem}>
            <Icon name="microphone" style={styles.toolsItemIcon} />
          </TouchableOpacity>
          <Text style={styles.toolsItemText}>Appuyer pour enregistrer</Text>
        </View>
        <TouchableOpacity style={styles.toolsItem} onPress={onClosePressed}>
          <Icon name="times" size={20} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default VoiceRecorderBox;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 5,
    backgroundColor: '#FFF',
    borderRadius: 8,
    margin: 5,
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
});

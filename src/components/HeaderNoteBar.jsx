import React from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const HeaderNoteBar = ({
  onSave,
  onCategoryPress,
  onTaskPress,
  onImagePress,
  onDrawingPress,
  onVoicePress,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.toolsContainer}>
        <TouchableOpacity style={styles.toolsItem} onPress={onCategoryPress}>
          <Icon name="list" style={styles.toolsItemIcon} />
          <Text style={styles.toolsItemText}>Catég...</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.toolsItem} onPress={onTaskPress}>
          <Icon name="check" style={styles.toolsItemIcon} />
          <Text style={styles.toolsItemText}>Tâches</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.toolsItem} onPress={onImagePress}>
          <Icon name="image" style={styles.toolsItemIcon} />
          <Text style={styles.toolsItemText}>Image</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.toolsItem} onPress={onDrawingPress}>
          <Icon name="pencil" style={styles.toolsItemIcon} />
          <Text style={styles.toolsItemText}>Dessin</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.toolsItem} onPress={onVoicePress}>
          <Icon name="microphone" style={styles.toolsItemIcon} />
          <Text style={styles.toolsItemText}>Voix</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={onSave}>
        <Text style={styles.saveButtonText}>ENREGISTRER</Text>
      </TouchableOpacity>
    </View>
  );
};

export default HeaderNoteBar;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 7,
    backgroundColor: '#EEE',
  },
  toolsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    padding: 8,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#AAA',
  },
  toolsItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  toolsItemText: {
    color: '#585555',
    fontSize: 12,
  },
  toolsItemIcon: {
    color: '#585555',
    fontSize: 15,
  },
  saveButton: {
    padding: 10,
    paddingHorizontal: 17,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#ffa500',
  },
});

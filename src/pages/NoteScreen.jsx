import React, { useState } from 'react';
import { View, TextInput, StyleSheet, ScrollView, Alert } from 'react-native';
import HeaderNoteBar from '../components/HeaderNoteBar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import VoiceRecorderBox from '../components/VoiceRecorderBox';

const NoteScreen = ({ navigation }) => {
  const [isRecorderVisible, setIsRecorderVisible] = useState(false);
  const [note, setNote] = useState({
    id: null,
    title: '',
    content: '',
    category: 'Catégorie',
    date: new Date().toLocaleDateString('fr-FR'),
    pref: false,
  });

  const handleSave = async () => {
    if (!note.title.trim()) {
      Alert.alert('Titre requis', 'Veuillez saisir un titre pour votre note');
      return;
    }

    try {
      const noteToSave = {
        ...note,
        id: note.id || Date.now(),
        title: note.title.trim(),
        content: note.content.trim(),
      };

      await saveNote(noteToSave);
      Alert.alert('Succès', 'Votre note a été sauvegardée');
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de sauvegarder la note');
      console.error(error);
    }
  };

  const saveNote = async (note) => {
    const existingNotes = await AsyncStorage.getItem('notes');
    let notes = existingNotes ? JSON.parse(existingNotes) : [];

    if (note.id) {
      // Édition : on remplace la note existante
      notes = notes.map((n) => (n.id === note.id ? note : n));
    } else {
      // Création : on ajoute la nouvelle note
      notes = [...notes, note];
    }

    await AsyncStorage.setItem('notes', JSON.stringify(notes));
  };

  // Fonctions pour les outils
  const handleCategoryPress = () => {
    console.log('Ouvrir sélecteur de catégorie');
  };

  const handleTaskPress = () => {
    console.log('Ajouter une tâche');
  };

  const handleImagePress = () => {
    console.log('Ajouter une image');
  };

  const handleDrawingPress = () => {
    navigation.navigate('DrawPage');
  };

  const handleVoicePress = () => {
    setIsRecorderVisible(!isRecorderVisible);
    console.log('Enregistrer une note vocale');
  };

  return (
    <View style={styles.container}>
      <HeaderNoteBar
        onSave={handleSave}
        onCategoryPress={handleCategoryPress}
        onTaskPress={handleTaskPress}
        onImagePress={handleImagePress}
        onDrawingPress={handleDrawingPress}
        onVoicePress={handleVoicePress}
      />

      <TextInput
        style={styles.titleBar}
        placeholder="Saisir un titre"
        value={note.title}
        onChangeText={(text) => setNote({ ...note, title: text })}
      />

      <ScrollView style={styles.contentArea}>
        <TextInput
          multiline={true}
          placeholder="Saisir un mémo"
          value={note.content}
          onChangeText={(text) => setNote({ ...note, content: text })}
        />
      </ScrollView>

      {isRecorderVisible && (
        <VoiceRecorderBox
          isVisible={isRecorderVisible}
          onClosePressed={handleVoicePress}
        />
      )}

    </View>
  );
};

export default NoteScreen;

const styles = StyleSheet.create({
  container: {
    height: '100%',
    backgroundColor: '#E9E9E8',
  },
  titleBar: {
    backgroundColor: '#fff',
    padding: 15,
    marginHorizontal: 10,
    marginTop: 10,
    marginBottom: 5,
    borderRadius: 8,
    fontSize: 16,
    fontWeight: '800',
    elevation: 0,
  },
  contentArea: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
    height: '450',
    maxHeight: '450',
    marginHorizontal: 10,
    marginTop: 3,
    marginBottom: 5,
    borderRadius: 8,
    textAlign: 'left',
    textAlignVertical: 'top',
    flexWrap: 'wrap',
    fontSize: 16,
    elevation: 0,
  },
});

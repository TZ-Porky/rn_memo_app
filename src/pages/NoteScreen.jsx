import React, { useState } from 'react';
import { View, TextInput, StyleSheet, ScrollView, Alert } from 'react-native';
import HeaderNoteBar from '../components/HeaderNoteBar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import VoiceRecorderBox from '../components/VoiceRecorderBox';

const NoteScreen = ({ navigation }) => {

  // State for the voice recorder
  // This state controls the visibility of the voice recorder
  const [isRecorderVisible, setIsRecorderVisible] = useState(false);

  // State for the note
  // This state holds the note data
  const [note, setNote] = useState({
    id: null,
    title: '',
    content: '',
    category: 'Catégorie',
    date: new Date().toLocaleDateString('fr-FR'),
    pref: false,
  });

  // ========================================================================== //

  // Save note function
  // This function is called when the user presses the save button
  const handleSave = async () => {
    if (!note.title.trim()) {
      Alert.alert('Titre requis', 'Veuillez saisir un titre pour votre note');
      return;
    }

    try {
      // Check if the note has a title
      const noteToSave = {
        ...note,
        id: note.id || Date.now(),
        title: note.title.trim(),
        content: note.content.trim(),
      };

      // Save the note to AsyncStorage
      await saveNote(noteToSave);
      Alert.alert('Succès', 'Votre note a été sauvegardée');
      navigation.navigate('HomePage');
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de sauvegarder la note');
      console.error(error);
    }
  };

  // Save note to AsyncStorage
  // This function saves the note to AsyncStorage
  const saveNote = async (noteToSave) => {
    const existingNotes = await AsyncStorage.getItem('notes');
    let notes = existingNotes ? JSON.parse(existingNotes) : [];

    if (noteToSave.id) {
      notes = notes.map((n) => (n.id === noteToSave.id ? noteToSave : n));
    } else {
      notes = [...notes, noteToSave];
    }

    await AsyncStorage.setItem('notes', JSON.stringify(notes));
  };

  // Handle speech result
  // This function is called when the speech recognition result is available
  const handleSpeechResult = (spokenText) => {
    setNote(prevNote => ({
      ...prevNote,
      content: prevNote.content + (prevNote.content ? ' ' : '') + spokenText,
    }));
  };

  // ========================================================================== //

  // Handle category press
  // This function is called when the user presses the category button
  const handleCategoryPress = () => {
    console.log('Ouvrir sélecteur de catégorie');
  };

  // Handle task press
  // This function is called when the user presses the task button
  const handleTaskPress = () => {
    console.log('Ajouter une tâche');
  };

  // Handle image press
  // This function is called when the user presses the image button
  const handleImagePress = () => {
    console.log('Ajouter une image');
  };

  // Handle drawing press
  // This function is called when the user presses the drawing button
  const handleDrawingPress = () => {
    navigation.navigate('DrawPage');
  };

  // Handle voice press
  // This function is called when the user presses the voice button
  const handleVoicePress = () => {
    setIsRecorderVisible(!isRecorderVisible);
    console.log('Enregistrer une note vocale');
  };

  // ========================================================================== //

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
          onSpeechResult={handleSpeechResult}
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

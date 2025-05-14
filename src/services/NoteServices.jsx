import AsyncStorage from '@react-native-async-storage/async-storage';

// This file contains functions to manage notes using AsyncStorage
// It includes functions to get, save, and delete notes
// It also includes a function to filter notes based on the selected category and search text

// Get notes from AsyncStorage
// This function gets the notes from AsyncStorage
const getNotes = async () => {
  try {
    const notes = await AsyncStorage.getItem('notes');
    return notes ? JSON.parse(notes) : [];
  } catch (error) {
    console.log(error);
    return [];
  }
};

// Save note to AsyncStorage
// This function saves the note to AsyncStorage
const saveNote = async note => {
  try {
    console.log('Notes avant mise à jour:', await getNotes());
    const notes = await getNotes();
    let updatedNotes;

    if (note.id) {
      updatedNotes = notes.map(n => (n.id === note.id ? note : n));
    } else {
      note.id = Date.now();
      updatedNotes = [...notes, note];
    }

    console.log('Notes après mise à jour:', updatedNotes);
    await AsyncStorage.setItem('notes', JSON.stringify(updatedNotes));
    console.log('Sauvegarde réussie pour ID:', note.id);
    return note;
  } catch (error) {
    console.error('Error saveNote:', error);
    throw error;
  }
};

// Delete note from AsyncStorage
// This function deletes the note from AsyncStorage
// It filters out the note with the specified id and updates AsyncStorage
const deleteNote = async (id) => {
  try {
      const notes = await getNotes();
      const updatedNotes = notes.filter(n => n.id !== id);
      await AsyncStorage.setItem('notes', JSON.stringify(updatedNotes));
      return updatedNotes;
  } catch (error) {
      console.error('Error deleteNote:', error);
      throw error;
  }
};

// Function to toggle the favorite status of a note
  // This function updates the note's favorite status and saves it to AsyncStorage
  // It uses useCallback to memoize the function and prevent unnecessary re-renders
const toggleFavorite = async (id) => {
  try {
    const notes = await getNotes();
    const updatedNotes = notes.map(note =>
      note.id === id ? { ...note, pref: !note.pref } : note
    );
    await AsyncStorage.setItem('notes', JSON.stringify(updatedNotes));
    return updatedNotes;
  } catch (error) {
    console.error('Error toggleFavorite:', error);
    throw error;
  }
};

export {getNotes, saveNote, deleteNote, toggleFavorite};

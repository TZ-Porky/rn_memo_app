import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  ScrollView,
  Alert,
  Image,
  TouchableOpacity,
  BackHandler,
} from 'react-native';

import {useFocusEffect} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome5';

import HeaderNoteBar from '../components/HeaderNoteBar';
import VoiceRecorderBox from '../components/VoiceRecorderBox';
import { getNotes, saveNote } from '../services/NoteServices';

const NoteScreen = ({navigation, route}) => {
  // State for the voice recorder
  // This state controls the visibility of the voice recorder
  const [isRecorderVisible, setIsRecorderVisible] = useState(false);

  // State for the drawing
  // This state controls the visibility of the drawing canvas
  const [drawing, setDrawing] = useState(null);

  // State for the note
  // This state holds the note data
  const [note, setNote] = useState({
    id: null,
    title: '',
    content: '',
    category: 'Aucune',
    date: new Date().toLocaleDateString('fr-FR'),
    pref: false,
    drawing: null,
  });

  // ========================================================================== //

  // This function is called when the component mounts
  // It checks if there is any drawing data passed from the previous screen
  useEffect(() => {
    if (route.params?.drawingData) {
      console.log('[NoteScreen] Donnée reçue pour le dessin :');
      console.log(route.params.drawingData.slice(0, 100));
      setDrawing(route.params.drawingData);
    }
  }, [route.params?.drawingData]);

  // This function is called when the component mounts
  // It navigate to HomeScreen when the user press the Back Button
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        navigation.navigate('Home', { refresh: true });
        return true;
      };

      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress
      );

      return () => {
        subscription.remove();
      };
    }, [navigation]),
  );

  // This function is called when the component mounts
  // It will load a note if receives an ID from params
  useEffect(() => {
    const loadNote = async () => {
      if (route.params?.noteId) {
        try {
          const notes = await getNotes();
          const existingNote = notes.find(n => n.id === route.params.noteId);
          if (existingNote) {
            setNote(existingNote);
            if (existingNote.drawing) {
              setDrawing(existingNote.drawing);
            }
          }
        } catch (error) {
          console.error('Erreur lors du chargement de la note', error);
        }
      }
    };

    loadNote();
  }, [route.params?.noteId]);

  // ========================================================================== //
  // Save note function
  // This function is called when the user presses the save button
  const handleSave = async () => {
    console.log('Sauvegarde déclenchée');
    if (!note.title.trim()) {
      Alert.alert('Titre requis', 'Veuillez saisir un titre pour votre note');
      return;
    }

    try {
      // Check if the note has a title
      const noteToSave = {
        ...note,
        title: note.title.trim(),
        content: note.content.trim(),
        drawing: drawing || null,
      };

      // Save the note to AsyncStorage
      await saveNote(noteToSave);
      console.log('Note sauvegardée:', noteToSave);
      Alert.alert('Succès', 'Votre note a été sauvegardée');
      navigation.navigate('Home', { refresh: true });
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de sauvegarder la note');
      console.error(error);
    }
  };

  // ========================================================================== //

  // Handle speech result
  // This function is called when the speech recognition result is available
  const handleSpeechResult = spokenText => {
    setNote(prevNote => ({
      ...prevNote,
      content: prevNote.content + (prevNote.content ? ' ' : '') + spokenText,
    }));
  };

  // Handle Drawing Delete Icon Press
  // This function is called when the user presses the times icon button on drawing
  const handleDeleteDrawing = () => {
    console.log('Drawing Deleted !');
    setDrawing(null);
    setNote(prevNote => ({
      ...prevNote,
      drawing: null,
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
        onChangeText={text => setNote({...note, title: text})}
      />

      <ScrollView style={styles.contentArea}>
        {drawing && (
          <View style={styles.contentImageContainer}>
            <Image source={{uri: drawing}} style={styles.contentImage} />
            <TouchableOpacity
              onPress={handleDeleteDrawing}
              style={styles.contentImageCloseButton}>
              <Icon name="times" size={20} />
            </TouchableOpacity>
          </View>
        )}

        <TextInput
          multiline={true}
          placeholder="Saisir un mémo"
          value={note.content}
          onChangeText={text => setNote({...note, content: text})}
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
  contentImageContainer: {
    position: 'relative',
    width: 200,
    height: 200,
    marginBottom: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 1,
  },
  contentImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    overflow: 'hidden',
  },
  contentImageCloseButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    padding: 5,
    borderRadius: 5,
  },
});

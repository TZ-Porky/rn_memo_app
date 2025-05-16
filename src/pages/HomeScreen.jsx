import React, {useState, useEffect, useMemo} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  TextInput,
  Modal,
  BackHandler,
  Alert,
} from 'react-native';

import HeaderBar from '../components/HeaderBar';
import MemoCard from '../models/MemoCard';

import {useFocusEffect} from '@react-navigation/native';
import {SwipeListView} from 'react-native-swipe-list-view';
import Icon from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FloatingButton from '../components/FloatingButton';

import {getNotes, deleteNote} from '../services/NoteServices';

const HomeScreen = ({navigation}) => {
  // State to manage the memos
  // This state holds the list of notes fetched from AsyncStorage
  const [notes, setNotes] = useState([]);

  // State to manage categories
  // This state holds the selected category for filtering notes
  const [selectedCategory, setSelectedCategory] = useState('Tous les mémos');

  // State to manage the categories modal
  // This state controls the visibility of the category selection modal
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  // State to manage the visibility of the search bar
  // This state controls whether the search bar is shown or hidden
  const [showSearch, setShowSearch] = useState(false);

  // State to hold the search text
  // This state is used to filter notes based on the search input
  const [searchText, setSearchText] = useState('');

  // State to track the deleted row keys
  // This state is used to manage the swipe-to-delete functionality
  // It holds the keys of the rows that have been deleted
  const [deletedRowKeys, setDeletedRowKeys] = useState([]);

  // State to manage the refresh modal
  // This state controls the visibility of the refresh modal
  const [isRefreshModalVisible, setIsRefreshModalVisible] = useState(false);

  // ================================================================================== //

  // Effect to load notes from AsyncStorage when the component mounts
  // This effect also sets up a listener to reload notes when the screen is focused
  useEffect(() => {
    const loadNotes = async () => {
      try {
        const loadedNotes = await getNotes();
        setNotes(loadedNotes);
        console.log('Notes chargées depuis AsyncStorage:', loadedNotes);
        const rawData = await AsyncStorage.getItem('notes');
        console.log('Données brutes dans AsyncStorage:', rawData);
      } catch (error) {
        console.error('Erreur de chargement des notes', error);
      }
    };

    const unsubscribe = navigation.addListener('focus', loadNotes);
    loadNotes();

    return unsubscribe;
  }, [navigation]);

  const loadNotes = async () => {
    try {
      const loadedNotes = await getNotes();
      setNotes(loadedNotes);
      console.log('Notes chargées depuis AsyncStorage:', loadedNotes);
      const rawData = await AsyncStorage.getItem('notes');
      console.log('Données brutes dans AsyncStorage:', rawData);
    } catch (error) {
      console.error('Erreur de chargement des notes', error);
    }
  };

  // ==================================================================================== //

  // Setting the default selected category when the component mounts
  // This effect sets the selected category to 'Tous les mémos' when the component mounts
  const categories = [...new Set(notes.map(note => note.category))];

  // Filter notes based on the selected category and search text
  // This function uses useMemo to optimize performance by memoizing the result
  const filteredNotes = useMemo(() => {
    let result = notes;

    if (selectedCategory === 'Favoris') {
      result = result.filter(note => note.pref);
    } else if (selectedCategory !== 'Tous les mémos') {
      result = result.filter(note => note.category === selectedCategory);
    }

    if (searchText) {
      const searchLower = searchText.toLowerCase();
      result = result.filter(
        note =>
          note.title.toLowerCase().includes(searchLower) ||
          note.content.toLowerCase().includes(searchLower),
      );
    }

    return result;
  }, [notes, selectedCategory, searchText]);

  // Handle back button press to show an alert before exiting the app
  // This function uses useFocusEffect to set up the back button listener
  // and show an alert when the back button is pressed
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        Alert.alert(
          "Quitter l'application",
          "Êtes-vous sûr de vouloir quitter l'application ?",
          [
            {
              text: 'Annuler',
              onPress: () => console.log('Annulation du quitter'),
              style: 'cancel',
            },
            {text: 'Oui', onPress: () => BackHandler.exitApp()},
          ],
          {cancelable: false},
        );
        return true;
      };

      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress,
      );

      return () => {
        subscription.remove();
      };
    }, []),
  );

  // ==================================================================================== //

  // Function to delete a note
  // This function removes the note from the state and updates AsyncStorage
  const handleDeleteNote = async id => {
    try {
      await deleteNote(id);
      setNotes(prevNotes => prevNotes.filter(note => note.id !== id));
    } catch (error) {
      console.error('Erreur lors de la suppression', error);
    }
  };

  // Function to handle the swipe action
  // This function checks if the swipe value is less than -200 and deletes the note
  const onSwipeValueChange = swipeData => {
    const {key, value} = swipeData;
    if (value < -200 && !deletedRowKeys.includes(key)) {
      setDeletedRowKeys(prev => [...prev, key]);
      handleDeleteNote(parseInt(key, 10));
    }
  };

  // Function to toggle the favorite status of a note
  // This function updates the state of the notes and AsyncStorage
  const toggleFavorite = async id => {
    try {
      // Set the favorite status of the note
      // This function updates the state of the notes and AsyncStorage
      setNotes(prevNotes => {
        const updatedNotes = prevNotes.map(note =>
          note.id === id ? {...note, pref: !note.pref} : note,
        );
        return updatedNotes;
      });
      // Update AsyncStorage with the new notes array
      // This function fetches the notes from AsyncStorage and updates the favorite status
      const savedNotes = await getNotes();
      const updatedNotes = savedNotes.map(note =>
        note.id === id ? {...note, pref: !note.pref} : note,
      );
      await AsyncStorage.setItem('notes', JSON.stringify(updatedNotes));
    } catch (error) {
      console.error('Erreur toggleFavorite:', error);
    }
  };

  // Function to render the hidden item (delete button) in the swipe list
  // This function uses the rowData and rowMap to identify the note to delete
  // and the corresponding row map
  const renderHiddenItem = (rowData, rowMap) => (
    <View style={styles.rowBack}>
      <TouchableOpacity
        style={[styles.backRightBtn, styles.backRightBtnRight]}
        onPress={() => handleDeleteNote(rowData.item.id)}>
        <Icon name="trash" size={25} style={styles.backTextWhite} />
      </TouchableOpacity>
    </View>
  );

  // Function to render the memo card
  // This function uses the MemoCard component to display each note
  const renderItem = ({item}) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('NotePage', {noteId: item.id})}
      activeOpacity={1}>
      <MemoCard
        memo={item}
        onToggleFavorite={toggleFavorite}
        key={item.id.toString()}
      />
    </TouchableOpacity>
  );

  // Function to handle the category button press
  // This function opens the category modal
  const handleCategoryPress = () => {
    setShowCategoryModal(true);
  };

  // Function to handle the search input
  // This function updates the search text and debounces the input
  const handleSearch = text => {
    setSearchText(text);
    debounce(() => setSearchText(text), 300)();
  };

  // Function to handle the menu button press
  // This function can be used to open a side menu or perform other actions
  const handleMenuPress = () => {
    setIsRefreshModalVisible(true);
  };

  // Function to select a category from the modal
  // This function updates the selected category and closes the modal
  const selectCategory = category => {
    setSelectedCategory(category);
    setShowCategoryModal(false);
  };

  // Function to debounce the search input
  // This function prevents the search input from firing too frequently
  function debounce(fn, delay) {
    let timer;
    return function () {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, arguments), delay);
    };
  }

  // ================================================================================== //

  return (
    <View style={styles.container}>
      <HeaderBar
        onCategoryPress={handleCategoryPress}
        onSearchPress={() => setShowSearch(!showSearch)}
        onMenuPress={handleMenuPress}
        selectedCategory={selectedCategory}
      />

      <Modal
        visible={showCategoryModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowCategoryModal(false)}>
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressOut={() => setShowCategoryModal(false)}>
          <View style={styles.modalContainer}>
            <TouchableOpacity
              activeOpacity={1}
              style={styles.modalContent}
              onPress={() => {}}>
              {['Tous les mémos', 'Favoris', ...categories].map(cat => (
                <TouchableOpacity
                  key={cat}
                  style={styles.categoryItem}
                  onPress={() => selectCategory(cat)}>
                  <Text>{cat}</Text>
                </TouchableOpacity>
              ))}
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      <Modal
        visible={isRefreshModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsRefreshModalVisible(false)}>
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressOut={() => setIsRefreshModalVisible(false)}>
          <View style={styles.modalOptionContainer}>
            <TouchableOpacity
              activeOpacity={1}
              style={styles.modalContent}
              onPress={() => {}}>
              <TouchableOpacity
                style={styles.modalOption}
                onPress={() => {
                  loadNotes();
                  setIsRefreshModalVisible(false);
                }}>
                <Text>Actualiser l'écran</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {showSearch && (
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher..."
          value={searchText}
          onChangeText={handleSearch}
          autoFocus={true}
        />
      )}

      <SwipeListView
        data={filteredNotes}
        renderItem={renderItem}
        renderHiddenItem={renderHiddenItem}
        rightOpenValue={-90}
        disableRightSwipe={false}
        stopLeftSwipe={1}
        previewRowKey={'0'}
        contentContainerStyle={styles.listContent}
        previewOpenValue={-40}
        previewOpenDelay={1000}
        closeOnRowPress={true}
        closeOnRowOpen={true}
        onSwipeValueChange={onSwipeValueChange}
        keyExtractor={item => item.id.toString()}
        style={styles.memoList}
      />

      <FloatingButton
        onPress={() => navigation.navigate('NotePage')}
        title={'+'}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#E9E9E8',
    height: '100%',
  },
  memoList: {
    flex: 1,
  },
  rowBack: {
    alignItems: 'center',
    height: 'auto',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginRight: 10,
    padding: 10,
    paddingLeft: 5,
  },
  backRightBtn: {
    alignItems: 'center',
    bottom: 5,
    justifyContent: 'space-around',
    position: 'absolute',
    top: 5,
    width: 85,
  },
  backRightBtnRight: {
    backgroundColor: 'red',
    right: 0,
    borderRadius: 5,
  },
  backTextWhite: {
    color: '#FFF',
  },
  listContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  modalContainer: {
    marginTop: 50,
    backgroundColor: 'white',
    padding: 5,
    borderRadius: 5,
    marginRight: 100,
  },
  categoryItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  searchInput: {
    backgroundColor: '#fff',
    padding: 12,
    marginHorizontal: 10,
    marginTop: 10,
    marginBottom: 5,
    borderRadius: 8,
    fontSize: 16,
    elevation: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOptionContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 5,
    width: '60%',
  },
  modalContent: {
    padding: 10,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalIcon: {
    marginRight: 15,
  },
});

export default HomeScreen;

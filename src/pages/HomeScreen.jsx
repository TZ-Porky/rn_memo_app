import React, {useState, useEffect, useCallback, useMemo} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  TextInput,
  Modal,
} from 'react-native';

import HeaderBar from '../components/HeaderBar';
import MemoData from '../data/memos.json';
import MemoCard from '../models/MemoCard';

import {SwipeListView} from 'react-native-swipe-list-view';
import Icon from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FloatingButton from '../components/FloatingButton';

const HomeScreen = ({navigation}) => {
  useEffect(() => {
    const loadMemos = async () => {
      try {
        const savedMemos = await AsyncStorage.getItem('memos');
        if (savedMemos) setMemos(JSON.parse(savedMemos));
      } catch (error) {
        console.error('Erreur de chargement', error);
      }
    };
    loadMemos();
  }, []);

  useEffect(() => {
    const saveMemos = async () => {
      try {
        await AsyncStorage.setItem('memos', JSON.stringify(memos));
      } catch (error) {
        console.error('Erreur de sauvegarde', error);
      }
    };
    saveMemos();
  }, [memos]);

  const [memos, setMemos] = useState(MemoData);
  const [selectedCategory, setSelectedCategory] = useState('Tous les mémos');
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [deletedRowKeys, setDeletedRowKeys] = useState([]);

  const allMemos = memos;

  const categories = [...new Set(memos.map(memo => memo.category))];
  const data = categories.map(label => ({label, value: label}));

  const filteredMemos = useMemo(() => {
    let result =
      selectedCategory === 'Tous les mémos'
        ? allMemos
        : allMemos.filter(memo => memo.category === selectedCategory);

    if (searchText) {
      const searchLower = searchText.toLowerCase();
      result = result.filter(
        memo =>
          memo.title.toLowerCase().includes(searchLower) ||
          memo.content.toLowerCase().includes(searchLower),
      );
    }

    return result;
  }, [selectedCategory, searchText, allMemos]);

  const toggleFavorite = useCallback(id => {
    setMemos(prevMemos =>
      prevMemos.map(memo =>
        memo.id === id ? {...memo, pref: !memo.pref} : memo,
      ),
    );
  }, []);

  const onSwipeValueChange = swipeData => {
    const {key, value} = swipeData;
    if (value < -200 && !deletedRowKeys.includes(key)) {
      setDeletedRowKeys(prev => [...prev, key]);
      setMemos(prevMemos =>
        prevMemos.filter(memo => memo.id.toString() !== key),
      );
    }
  };

  const renderHiddenItem = (data, rowMap) => (
    <View style={styles.rowBack}>
      <TouchableOpacity
        style={[styles.backRightBtn, styles.backRightBtnRight]}
        onPress={() => {
          setDeletedRowKeys(prev => [...prev, data.item.id.toString()]);
          setMemos(prevMemos =>
            prevMemos.filter(
              memo => memo.id.toString() !== data.item.id.toString(),
            ),
          );
        }}>
        <Icon name="trash" size={25} style={styles.backTextWhite} />
      </TouchableOpacity>
    </View>
  );

  const renderItem = ({item}) => (
    <MemoCard
      memo={item}
      onToggleFavorite={toggleFavorite}
      key={item.id.toString()}
    />
  );

  const handleCategoryPress = () => {
    setShowCategoryModal(true);
  };

  const handleSearch = text => {
    setSearchText(text);
    debounce(() => setSearchText(text), 300)();
  };

  const handleMenuPress = () => {
    console.log('Menu pressed');
  };

  const selectCategory = category => {
    setSelectedCategory(category);
    setShowCategoryModal(false);
  };

  function debounce(fn, delay) {
    let timer;
    return function () {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, arguments), delay);
    };
  }

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
              onPress={() => {}} // Empêche la fermeture quand on clique à l'intérieur
            >
              {['Tous les mémos', ...categories].map(cat => (
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
        data={filteredMemos}
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
      <FloatingButton onPress={() => navigation.navigate('NotePage')} title={'+'} />
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
});

export default HomeScreen;

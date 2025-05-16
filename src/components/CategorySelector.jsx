import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {getCategories, addCategory} from '../services/NoteServices';

const CategorySelector = ({selectedCategory, onSelect}) => {
  const [categories, setCategories] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newCategory, setNewCategory] = useState('');

  useEffect(() => {
    const loadCategories = async () => {
      const loadedCategories = await getCategories();
      setCategories(loadedCategories);
    };
    loadCategories();
  }, []);

  const handleAddCategory = async () => {
    if (newCategory.trim()) {
      await addCategory(newCategory);
      setCategories([...categories, newCategory]);
      onSelect(newCategory);
      setNewCategory('');
      setIsModalVisible(false);
    }
  };

  return (
    <>
      <TouchableOpacity onPress={() => setIsModalVisible(true)}>
        <View style={styles.categoryDisplay}>
          <Text style={styles.categoryText}>
            {selectedCategory || 'Choisir une catégorie'}
          </Text>
          <Icon name="chevron-down" size={14} />
        </View>
      </TouchableOpacity>

      <Modal visible={isModalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Catégories</Text>

            {categories.map(category => (
              <TouchableOpacity
                key={category}
                style={styles.categoryItem}
                onPress={() => {
                  onSelect(category);
                  setIsModalVisible(false);
                }}>
                <Text>{category}</Text>
                {selectedCategory === category && <Icon name="check" />}
              </TouchableOpacity>
            ))}

            <View style={styles.addCategoryContainer}>
              <TextInput
                style={styles.input}
                placeholder="Nouvelle catégorie"
                value={newCategory}
                onChangeText={setNewCategory}
              />
              <TouchableOpacity onPress={handleAddCategory}>
                <Icon name="plus" size={20} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  categoryDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 5,
    backgroundColor: '#f0f0f0',
  },
  categoryText: {
    marginRight: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 10,
    padding: 15,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  categoryItem: {
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  addCategoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 8,
    marginRight: 10,
  },
});

export default CategorySelector;

import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const HeaderBar = ({
  onCategoryPress,
  onSearchPress,
  onMenuPress,
  selectedCategory,
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.headerDropdownMenu}
        onPress={onCategoryPress}
      >
        <Text style={styles.categoryText}>
          {selectedCategory || 'Catégorie'}
        </Text>
        <Icon name="caret-down" size={20} color="#fff" />
      </TouchableOpacity>
      <TouchableOpacity onPress={onSearchPress}>
        <Text style={styles.headerText}>RECHERCHER</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onMenuPress}>
        <Icon name="ellipsis-v" size={20} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#ffa500',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  headerText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#fff',
  },
  headerDropdownMenu: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  categoryText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFF',
  },
});

export default HeaderBar;

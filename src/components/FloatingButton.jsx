import React from 'react';
import { StyleSheet, TouchableOpacity, Text } from 'react-native';

const FloatingButton = ({ onPress, title }) => (
    <TouchableOpacity style={styles.fab} onPress={onPress}>
      <Text style={styles.fabText}>{title}</Text>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#ffa500',
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  fabText: {
    height: 65,
    color: 'white',
    fontSize: 45,
    fontWeight: '400',
  },
});


export default FloatingButton;

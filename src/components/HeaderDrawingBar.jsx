import React from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';

const HeaderDrawingBar = ({onCancelPress, onRestartPress, onSavePress}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.Button} onPress={onCancelPress}>
        <Text style={styles.ButtonText}>ANNULER</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.Button} onPress={onRestartPress}>
        <Text style={styles.ButtonText}>RECOMM..</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.Button} onPress={onSavePress}>
        <Text style={styles.ButtonText}>OK</Text>
      </TouchableOpacity>
    </View>
  );
};

export default HeaderDrawingBar;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: 4,
    backgroundColor: '#EEE',
    elevation: 2,
  },
  Button: {
    padding: 10,
    paddingHorizontal: 17,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ButtonText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#ffa500',
  },
});

import React from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

const ToolBoxDrawing = ({
  isEraser,
  setIsEraser,
  size,
  setSize,
  color,
  setColor,
}) => {
  const sizes = [1, 2, 5, 8];

  const colors = [
    'black',
    'red',
    'green',
    'blue',
    'yellow',
    'orange',
    'lightblue',
    'lightgray',
  ];

  const handleToolPress = (action, value) => {
    if (action === 'eraser') {
      setIsEraser(true);
    } else if (action === 'pencil') {
      setIsEraser(false);
    } else if (action === 'size') {
      setSize(value);
    } else if (action === 'color') {
      setIsEraser(false);
      setColor(value);
    }
  };


  return (
    <View style={styles.container}>
      <View style={styles.toolSection} flex={2}>
        <TouchableOpacity
          style={[styles.eraserButton, isEraser && styles.activeTool]}
          onPress={() => handleToolPress('eraser')}>
          <View
            style={styles.toolSelection}>
            <Icon name="eraser" size={20} />
            <Text style={styles.buttonText}>Gomme</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.eraserButton, !isEraser && styles.activeTool]}
          onPress={() => handleToolPress('pencil')}>
          <View
            style={styles.toolSelection}>
            <Icon name="pen" size={20} />
            <Text style={styles.buttonText}>Crayon</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.toolSection} flex={2}>
        <Text style={styles.sectionTitle}>Taille</Text>
        <View style={styles.sizeContainer}>
          {sizes.map(sizeOption => (
            <TouchableOpacity
              key={sizeOption}
              style={[
                styles.sizeButton,
                size === sizeOption && styles.activeTool,
              ]}
              onPress={() => handleToolPress('size', sizeOption)}>
              <View style={[
                styles.sizeIndicator,
                { width: sizeOption * 3, height: sizeOption * 3 },
              ]} />
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.toolSection} flex={3}>
        <Text style={styles.sectionTitle}>Couleur</Text>
        <View style={styles.colorContainer}>
          {colors.map(colorOption => (
            <TouchableOpacity
              key={colorOption}
              style={[
                styles.colorButton,
                {backgroundColor: colorOption},
                color === colorOption && styles.activeColor,
              ]}
              onPress={() => handleToolPress('color', colorOption)}
            />
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#eee',
    padding: 5,
    height: 115,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  toolSection: {
    backgroundColor: '#fff',
    marginHorizontal: 4,
    height: '90%',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 1,
    elevation: 1,
  },
  toolSelection: {
    display: 'flex',
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center',
  },
  sizeIndicator: {
    backgroundColor: 'black',
    borderRadius: 50,
  },
  sectionTitle: {
    textAlign: 'left',
    fontSize: 12,
    marginBottom: 4,
    fontWeight: '500',
    color: '#A9A9A9',
  },
  eraserButton: {
    padding: 8,
    borderRadius: 4,
    backgroundColor: '#fff',
  },
  sizeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 4,
  },
  sizeButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  colorContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 6,
    maxWidth: '100%',
  },
  colorButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  buttonText: {
    fontSize: 12,
    fontWeight: '500',
  },
  sizeText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  activeTool: {
    backgroundColor: '#ffa500',
  },
  activeColor: {
    borderWidth: 2,
    borderColor: '#ffa500',
  },
});

export default ToolBoxDrawing;

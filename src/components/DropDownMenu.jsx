import React from 'react';
import {Text, View} from 'react-native';
import {StyleSheet} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';

const DropDownMenu = ({
  data,
  label,
  placeholder,
  searchPlaceholder,
  onValueChanged,
  showLabel = true,
}) => {
  const [value, setValue] = React.useState(null);
  const [isFocus, setIsFocus] = React.useState(false);

  const renderLabel = () => {
    if (showLabel) {
      if (value) {
        return (
          <Text
            style={[styles.label, isFocus && styles.focusedLabel]}
            numberOfLines={1}>
            {data.find(item => item.value === value)?.label}
          </Text>
        );
      }
      return label ? (
        <Text style={styles.label} numberOfLines={1}>
          {label}
        </Text>
      ) : null;
    }
  };

  return (
    <View>
      {renderLabel()}
      <Dropdown
        style={[styles.dropdown, isFocus && styles.dropdownFocus]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={data}
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder={!isFocus ? 'Sélectionner un mémo' : '...'}
        searchPlaceholder="Rechercher..."
        value={value}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={item => {
          setValue(item.value);
          setIsFocus(false);
          if (onValueChanged) {
            onValueChanged(item.value);
          }
        }}
      />
    </View>
  );
};

export default DropDownMenu;

const styles = StyleSheet.create({
  dropdown: {
    width: 150,
    height: 30,
    borderColor: '#ffa500',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    backgroundColor: '#ffa500',
  },
  icon: {
    marginRight: 5,
  },
  placeholderStyle: {
    fontSize: 16,
    color: '#fff',
  },
  selectedTextStyle: {
    fontSize: 18,
    fontWeight: '700',
    whiteSpace: 'nowrap',
    color: '#fff',
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  dropdownFocus: {
    borderColor: '#ffa500',
  },
  label: {
    fontSize: 14,
    color: '#000',
    marginBottom: 5,
  },
  focusedLabel: {
    color: '#fff',
  },
});

import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome5';

const MemoCard = React.memo(({memo, onToggleFavorite}) => {
  return (
    <View style={styles.Container}>
      <View style={styles.rowContainer}>
        <Text style={styles.cardTitle}>{memo.title}</Text>
        <TouchableOpacity onPress={(e) => {
          e.stopPropagation();
          onToggleFavorite(memo.id);
          }}
        >
          <Icon
            name="star"
            size={20}
            color={memo.pref ? '#FFD700' : '#CCC'}
            solid={memo.pref}
            light={!memo.pref}
          />
        </TouchableOpacity>
      </View>
      <Text style={styles.cardContent}>{memo.content}</Text>
      <Text style={styles.cardDate}>{memo.date}</Text>
    </View>
  );
}, (prevProps, nextProps) => {
  return prevProps.memo.title === nextProps.memo.title
    && prevProps.memo.content === nextProps.memo.content
    && prevProps.memo.date === nextProps.memo.date;
});

export default MemoCard;

const styles = StyleSheet.create({
  Container: {
    margin: 5,
    marginHorizontal: 8,
    padding: 15,
    backgroundColor: '#FFF',
    display: 'flex',
    borderRadius: 5,
    flexDirection: 'column',
    gap: 5,
    height: 'auto',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2, // Pour Android
  },
  rowContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  cardContent: {
    fontSize: 14,
    fontWeight: '600',
    color: '#999',
  },
  cardDate: {
    fontSize: 11,
    fontWeight: '400',
    color: '#777',
  },
});

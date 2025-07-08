import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const BookItem = ({ item }) => (
  <View style={styles.container}>
    <Image
      source={{ uri: item.imageLinks?.thumbnail || 'https://via.placeholder.com/100x150' }}
      style={styles.thumbnail}
    />
    <View style={{ flex: 1 }}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.publisher}>{item.publisher || 'Sin editorial'}</Text>
      <Text style={styles.description}>
        {item.description?.substring(0, 150) || 'Sin descripción'}...
      </Text>
    </View>
  </View>
);

export default BookItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 0.5,
    borderColor: '#ccc',
  },
  thumbnail: {
    width: 100,
    height: 150,
    marginRight: 10,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  publisher: {
    fontStyle: 'italic',
    marginVertical: 4,
  },
  description: {
    fontSize: 12,
    color: '#333',
  },
});

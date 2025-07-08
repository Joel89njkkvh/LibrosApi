import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  SectionList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import axios from 'axios';
import { CATEGORIES } from '../constants/categories';
import BookItem from '../components/BookItem';

const BookScreen = () => {
  const [selectedCategory, setSelectedCategory] = useState('Fiction');
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedBook, setSelectedBook] = useState(null); 

  const fetchBooks = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(
        `https://www.googleapis.com/books/v1/volumes?q=subject:${selectedCategory}&maxResults=40`
      );

      const grouped = {};
      res.data.items?.forEach((item) => {
        const volume = item.volumeInfo;
        const authors = volume.authors || ['Autor desconocido'];
        authors.forEach((author) => {
          if (!grouped[author]) grouped[author] = [];
          grouped[author].push(volume);
        });
      });

      const sections = Object.keys(grouped).map((author) => ({
        title: author,
        data: grouped[author],
      }));

      setBooks(sections);
    } catch (e) {
      setError('Error al cargar libros.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setSelectedBook(null);
    fetchBooks();
  }, [selectedCategory]);

  const renderDetailView = () => (
    <ScrollView style={styles.detailContainer}>
      <Text style={styles.detailTitle}>{selectedBook.title}</Text>
      <Text style={styles.detailAuthor}>
        {selectedBook.authors?.join(', ') || 'Autor desconocido'}
      </Text>
      <Text style={styles.detailPublisher}>
        {selectedBook.publisher ? `Editorial: ${selectedBook.publisher}` : ''}
      </Text>
      <Text style={styles.detailDescription}>
        {selectedBook.description || 'Sin descripción disponible.'}
      </Text>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => setSelectedBook(null)}
      >
        <Text style={styles.backText}>← Volver</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      {selectedBook ? (
        renderDetailView()
      ) : (
        <>
          <View style={styles.categoryBar}>
            {CATEGORIES.map((cat) => (
              <TouchableOpacity key={cat} onPress={() => setSelectedCategory(cat)}>
                <Text
                  style={[
                    styles.categoryText,
                    selectedCategory === cat && styles.activeCategory,
                  ]}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {loading && <ActivityIndicator size="large" color="#0000ff" />}
          {error ? (
            <Text style={styles.error}>{error}</Text>
          ) : (
            <SectionList
              sections={books}
              keyExtractor={(item, index) => item.title + index}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => setSelectedBook(item)}>
                  <BookItem item={item} />
                </TouchableOpacity>
              )}
              renderSectionHeader={({ section: { title } }) => (
                <Text style={styles.sectionHeader}>{title}</Text>
              )}
            />
          )}
        </>
      )}
    </View>
  );
};

export default BookScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingTop: 40 },
  categoryBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
    borderBottomWidth: 1,
    paddingBottom: 5,
  },
  categoryText: {
    fontSize: 16,
    padding: 6,
    color: '#555',
  },
  activeCategory: {
    fontWeight: 'bold',
    color: '#000',
    borderBottomWidth: 2,
    borderColor: '#000',
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    backgroundColor: '#eee',
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
  detailContainer: {
    padding: 20,
  },
  detailTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  detailAuthor: {
    fontSize: 16,
    fontStyle: 'italic',
    marginBottom: 6,
  },
  detailPublisher: {
    fontSize: 14,
    color: '#555',
    marginBottom: 10,
  },
  detailDescription: {
    fontSize: 14,
    lineHeight: 22,
    color: '#333',
  },
  backButton: {
    marginTop: 30,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#000',
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  backText: {
    color: '#fff',
    fontWeight: '600',
  },
});

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  SectionList,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Image,
} from 'react-native';
import axios from 'axios';
import BookItem from '../components/BookItem';
import { CATEGORIES } from '../constants/categories';

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
      const results = [];
      let i = 0;
      while (results.length < 800 && i < 20) {
        const response = await axios.get(
          `https://www.googleapis.com/books/v1/volumes?q=subject:${selectedCategory}&maxResults=40&startIndex=${i * 40}`
        );
        results.push(...(response.data.items || []));
        i++;
      }

      const groupedBooks = {};
      results.forEach((item) => {
        const volume = item.volumeInfo;
        const author = volume.authors?.[0] || 'Autor desconocido';
        if (volume.description && volume.publisher) {
          if (!groupedBooks[author]) groupedBooks[author] = [];
          groupedBooks[author].push(volume);
        }
      });

      const sections = Object.keys(groupedBooks).map((author) => ({
        title: author,
        data: groupedBooks[author],
      }));

      const total = sections.reduce((sum, s) => sum + s.data.length, 0);
      if (total >= 10) {
        setBooks(sections);
      } else {
        setError('No se encontraron suficientes libros con descripción y editorial.');
        setBooks([]);
      }
    } catch (err) {
      setError('No se pudieron cargar los libros. Intenta más tarde.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [selectedCategory]);

  const renderBookDetail = () => {
    if (!selectedBook) return null;
    return (
      <View style={styles.detailContainer}>
        <Text style={styles.detailTitle}>{selectedBook.title}</Text>
        <Text style={styles.detailAuthor}>{selectedBook.authors?.join(', ') || 'Autor desconocido'}</Text>
        <Text style={styles.detailDescription}>{selectedBook.description || 'Sin descripción disponible.'}</Text>
        <Text style={styles.detailPublisher}>Editorial: {selectedBook.publisher || 'No disponible'}</Text>
        <TouchableOpacity onPress={() => setSelectedBook(null)} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Volver</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      {selectedBook ? (
        renderBookDetail()
      ) : (
        <>
          <View style={styles.headerBar}>
            <Image source={require('../assets/logo.png')} style={styles.logo} />
            <Text style={styles.headerTitle}>Lectura Fusión</Text>
          </View>

          <View style={styles.tabContainer}>
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <TouchableOpacity
                  key={cat}
                  onPress={() => setSelectedCategory(cat)}
                  style={[styles.tab, isActive && styles.activeTab]}
                >
                  <Text style={[styles.tabText, isActive && styles.activeTabText]}>{cat}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {loading && <ActivityIndicator size="large" color="#222" style={{ marginTop: 30 }} />}

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
                <View style={styles.sectionHeaderContainer}>
                  <Text style={styles.sectionHeader}>{title}</Text>
                </View>
              )}
              contentContainerStyle={{ paddingBottom: 60 }}
            />
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: '#f9f9f9',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  logo: {
    width: 32,
    height: 32,
    marginRight: 12,
    resizeMode: 'contain',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#222',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    backgroundColor: '#f0f0f3',
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 18,
    backgroundColor: '#e2e2e2',
  },
  activeTab: {
    backgroundColor: '#222',
  },
  tabText: {
    color: '#444',
    fontSize: 14,
  },
  activeTabText: {
    color: '#fff',
    fontWeight: '600',
  },
  sectionHeaderContainer: {
    backgroundColor: '#f5f5f7',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1c1c1e',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    fontSize: 16,
    marginTop: 20,
  },
  detailContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  detailTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 10,
    color: '#222',
  },
  detailAuthor: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#666',
    marginBottom: 20,
  },
  detailDescription: {
    fontSize: 14,
    lineHeight: 22,
    color: '#333',
    marginBottom: 12,
  },
  detailPublisher: {
    fontSize: 14,
    color: '#555',
    fontWeight: '500',
  },
  backButton: {
    marginTop: 30,
    padding: 12,
    backgroundColor: '#222',
    alignSelf: 'flex-start',
    borderRadius: 8,
  },
  backButtonText: {
    color: '#fff',
    fontWeight: '500',
  },
});

export default BookScreen;

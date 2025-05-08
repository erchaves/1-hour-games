// src/components/HomeScreen.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const HomeScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Welcome to Claude AI</Text>
        </View>

        <View style={styles.heroSection}>
          <Text style={styles.heroTitle}>Your Intelligent Assistant</Text>
          <Text style={styles.heroSubtitle}>
            Powered by Claude 3.7 Sonnet, one of the most advanced AI assistants.
          </Text>
        </View>

        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>What can Claude do?</Text>

          <View style={styles.featureCard}>
            <Text style={styles.featureTitle}>Answer Questions</Text>
            <Text style={styles.featureDescription}>
              Get detailed answers on a wide range of topics.
            </Text>
          </View>

          <View style={styles.featureCard}>
            <Text style={styles.featureTitle}>Creative Writing</Text>
            <Text style={styles.featureDescription}>
              Generate stories, poems, and creative content.
            </Text>
          </View>

          <View style={styles.featureCard}>
            <Text style={styles.featureTitle}>Problem Solving</Text>
            <Text style={styles.featureDescription}>
              Get help with coding, math, and analytical thinking.
            </Text>
          </View>
        </View>

        <TouchableOpacity style={styles.startButton} onPress={() => navigation.navigate('Chat')}>
          <Text style={styles.startButtonText}>Start Chatting</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    height: 60,
    backgroundColor: '#6750A4',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#5D4599',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 16,
  },
  heroSection: {
    marginTop: 30,
    marginBottom: 40,
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1D1B20',
    marginBottom: 12,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#49454F',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  featuresSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1D1B20',
    marginBottom: 20,
  },
  featureCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1D1B20',
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 15,
    color: '#49454F',
  },
  startButton: {
    backgroundColor: '#6750A4',
    borderRadius: 30,
    paddingVertical: 14,
    marginHorizontal: 30,
    marginBottom: 30,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  startButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default HomeScreen;

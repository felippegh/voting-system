import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { featuresAPI } from '../services/api';

type CreateFeatureNavigationProp = NativeStackNavigationProp<RootStackParamList, 'CreateFeature'>;

interface Props {
  navigation: CreateFeatureNavigationProp;
}

export const CreateFeatureScreen: React.FC<Props> = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (title.trim().length < 3) {
      Alert.alert('Error', 'Title must be at least 3 characters long');
      return;
    }

    if (description.trim().length < 10) {
      Alert.alert('Error', 'Description must be at least 10 characters long');
      return;
    }

    try {
      setIsLoading(true);
      
      await featuresAPI.create({
        title: title.trim(),
        description: description.trim(),
      });
      
      Alert.alert(
        'Success',
        'Feature created successfully!',
        [
          {
            text: 'OK',
            onPress: () => {
              // Navigate back to Home and refresh the list
              navigation.navigate('Home');
            }
          }
        ]
      );
    } catch (error: any) {
      console.error('Error creating feature:', error);
      
      let errorMessage = 'Failed to create feature. Please try again.';
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.response?.data?.details) {
        // Handle validation errors
        const details = error.response.data.details;
        errorMessage = details.map((detail: any) => detail.message).join('\n');
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.formContainer}>
          <Text style={styles.title}>Create Feature Request</Text>
          <Text style={styles.subtitle}>
            Share your idea with the community and gather support!
          </Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Feature Title *</Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="Enter a clear, descriptive title"
              maxLength={100}
              autoCapitalize="words"
              returnKeyType="next"
            />
            <Text style={styles.charCount}>{title.length}/100</Text>
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Description *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Provide a detailed description of your feature request. What problem does it solve? How would it benefit users?"
              multiline
              numberOfLines={6}
              maxLength={500}
              textAlignVertical="top"
              returnKeyType="default"
            />
            <Text style={styles.charCount}>{description.length}/500</Text>
          </View>
          
          <TouchableOpacity 
            style={[
              styles.submitButton, 
              (isLoading || !title.trim() || !description.trim()) && styles.submitButtonDisabled
            ]} 
            onPress={handleSubmit}
            disabled={isLoading || !title.trim() || !description.trim()}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.submitButtonText}>Create Feature Request</Text>
            )}
          </TouchableOpacity>
          
          <View style={styles.guidelines}>
            <Text style={styles.guidelinesTitle}>Guidelines:</Text>
            <Text style={styles.guidelinesText}>
              • Be specific and clear about your feature request
            </Text>
            <Text style={styles.guidelinesText}>
              • Explain why this feature would be valuable
            </Text>
            <Text style={styles.guidelinesText}>
              • Check if a similar feature already exists
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  formContainer: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  charCount: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
    marginTop: 4,
  },
  submitButton: {
    backgroundColor: '#007AFF',
    padding: 18,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  submitButtonDisabled: {
    backgroundColor: '#99C9FF',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  guidelines: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  guidelinesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  guidelinesText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
    lineHeight: 20,
  },
});
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp, useFocusEffect } from '@react-navigation/native';
import { RootStackParamList } from '../../App';
import { featuresAPI, votesAPI, Feature } from '../services/api';
import { useAuth } from '../context/AuthContext';

type FeatureDetailNavigationProp = NativeStackNavigationProp<RootStackParamList, 'FeatureDetail'>;
type FeatureDetailRouteProp = RouteProp<RootStackParamList, 'FeatureDetail'>;

interface Props {
  navigation: FeatureDetailNavigationProp;
  route: FeatureDetailRouteProp;
}

export const FeatureDetailScreen: React.FC<Props> = ({ navigation, route }) => {
  const { featureId } = route.params;
  const { user } = useAuth();
  
  const [feature, setFeature] = useState<Feature | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isVoting, setIsVoting] = useState(false);
  const [userHasVoted, setUserHasVoted] = useState(false);
  const [voteCount, setVoteCount] = useState(0);

  const loadFeature = async () => {
    try {
      setIsLoading(true);
      const featureResponse = await featuresAPI.getById(parseInt(featureId));
      setFeature(featureResponse.feature);
      setVoteCount(featureResponse.feature.vote_count);
      
      // Check if user has voted
      try {
        const voteResponse = await votesAPI.getByFeature(parseInt(featureId));
        setUserHasVoted(voteResponse.votes.some(vote => vote.user_id === user?.id));
      } catch (error) {
        console.log('Error checking vote status:', error);
        setUserHasVoted(false);
      }
    } catch (error: any) {
      console.error('Error loading feature:', error);
      Alert.alert('Error', 'Failed to load feature details');
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadFeature();
    }, [featureId])
  );

  const handleVote = async () => {
    if (!feature || isVoting) return;
    
    try {
      setIsVoting(true);
      
      if (userHasVoted) {
        // Remove vote
        await votesAPI.delete(feature.id);
        setUserHasVoted(false);
        setVoteCount(prev => prev - 1);
        Alert.alert('Success', 'Vote removed successfully');
      } else {
        // Add vote
        await votesAPI.create(feature.id);
        setUserHasVoted(true);
        setVoteCount(prev => prev + 1);
        Alert.alert('Success', 'Vote added successfully');
      }
    } catch (error: any) {
      console.error('Error voting:', error);
      
      let errorMessage = 'Failed to vote. Please try again.';
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }
      
      Alert.alert('Error', errorMessage);
    } finally {
      setIsVoting(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading feature...</Text>
      </View>
    );
  }

  if (!feature) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Feature not found</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{feature.title}</Text>
          <Text style={styles.author}>by {feature.created_by_username}</Text>
        </View>
        <View style={styles.voteContainer}>
          <Text style={styles.voteCount}>{voteCount}</Text>
          <Text style={styles.voteLabel}>votes</Text>
        </View>
      </View>
      
      <Text style={styles.description}>{feature.description}</Text>
      
      <TouchableOpacity
        style={[
          styles.voteButton,
          userHasVoted && styles.voteButtonActive,
          isVoting && styles.voteButtonDisabled
        ]}
        onPress={handleVote}
        disabled={isVoting}
      >
        {isVoting ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={[
            styles.voteButtonText,
            userHasVoted && styles.voteButtonTextActive
          ]}>
            {userHasVoted ? '✓ Voted' : '👍 Vote'}
          </Text>
        )}
      </TouchableOpacity>
      
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          Created on {new Date(feature.created_at).toLocaleDateString()}
        </Text>
        {feature.updated_at !== feature.created_at && (
          <Text style={styles.infoText}>
            Updated on {new Date(feature.updated_at).toLocaleDateString()}
          </Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  backButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  titleContainer: {
    flex: 1,
    marginRight: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  author: {
    fontSize: 14,
    color: '#666',
  },
  voteContainer: {
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  voteCount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  voteLabel: {
    fontSize: 12,
    color: '#666',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    marginBottom: 32,
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  voteButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  voteButtonActive: {
    backgroundColor: '#34C759',
  },
  voteButtonDisabled: {
    backgroundColor: '#99C9FF',
  },
  voteButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  voteButtonTextActive: {
    color: 'white',
  },
  infoContainer: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
});
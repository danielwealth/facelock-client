
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native-web';

export default function MatchHistory() {
  const [matches, setMatches] = useState([]);
  const [status, setStatus] = useState('Loading match history...');

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const resp = await fetch(`${process.env.REACT_APP_API_URI}/match/history`, {
          credentials: 'include', // 🔑 session cookie proves user identity
        });
        const data = await resp.json();

        const matchArray = Array.isArray(data) ? data : data.history || [];
        setMatches(matchArray);
        setStatus(matchArray.length ? '' : 'No match history found');
      } catch (err) {
        console.error('Failed to fetch match history', err);
        setStatus('Error fetching match history');
      }
    };

    fetchMatches();
  }, []);

  const renderItem = ({ item }) => (
    <Text style={styles.listItem}>
      {/* Adjust keys if backend returns different structure */}
      {item.name || 'Unknown'} matched on{' '}
      {item.timestamp ? new Date(item.timestamp).toLocaleString() : 'Unknown time'}
    </Text>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Face Match History</Text>
      {status ? (
        <Text style={styles.status}>{status}</Text>
      ) : (
        <FlatList
          data={matches}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  heading: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  listItem: {
    marginBottom: 6,
    paddingLeft: 12,
  },
  status: {
    fontSize: 16,
    color: 'gray',
    marginTop: 8,
  },
});

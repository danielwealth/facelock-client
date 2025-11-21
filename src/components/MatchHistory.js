// client/src/components/MatchHistory.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native-web';

export default function MatchHistory() {
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const resp = await fetch('https://facelockserver.onrender.com/match-history', {
          credentials: 'include',
        });
        const data = await resp.json();
        setMatches(data);
      } catch (err) {
        console.error('Failed to fetch match history', err);
      }
    };
    fetchMatches();
  }, []);

  const renderItem = ({ item }) => (
    <Text style={styles.listItem}>
      {item.name} matched on {new Date(item.timestamp).toLocaleString()}
    </Text>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Face Match History</Text>
      <FlatList
        data={matches}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
      />
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
});
export default MatchHistory;

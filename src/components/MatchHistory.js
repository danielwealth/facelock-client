// client/src/components/MatchHistory.js
import { View, Text } from 'react-native-web';
import React, { useEffect, useState } from 'react';

function MatchHistory() {
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    const fetchMatches = async () => {
      const resp = await fetch('https://facelockserver.onrender.com/match-history', {
        credentials: 'include',
      });
      const data = await resp.json();
      setMatches(data);
    };
    fetchMatches();
  }, []);

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-2">Face Match History</h2>
      <ul className="list-disc pl-6">
        {matches.map((match, i) => (
          <li key={i}>{match.name} matched on {new Date(match.timestamp).toLocaleString()}</li>
        ))}
      </ul>
    </div>
  );
}

export default MatchHistory;

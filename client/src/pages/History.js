// src/pages/History.js
import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

function History() {
  const [savedMatches, setSavedMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = auth.currentUser;

  useEffect(() => {
    const fetchHistory = async () => {
      if (user) {
        const userRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(userRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setSavedMatches(data.matches || []);
        }
      }
      setLoading(false);
    };

    fetchHistory();
  }, [user]);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-blue-700 mb-4">My Match History</h1>

      {loading ? (
        <p className="text-gray-500">Loading history...</p>
      ) : savedMatches.length === 0 ? (
        <p className="text-gray-500">No match history found.</p>
      ) : (
        <div className="space-y-4">
          {savedMatches.map((match, i) => (
            <div key={i} className="p-4 bg-white rounded shadow border">
              <h3 className="text-lg font-bold text-blue-700">{match.name}</h3>
              <p className="text-sm text-gray-700">{match.major} • {match.industry}</p>
              <p className="text-sm text-gray-500">{match.school} • Class of {match.graduationYear}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default History;

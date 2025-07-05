import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

function Dashboard() {
  const [formData, setFormData] = useState({
    school: '',
    major: '',
    industry: ''
  });
  const [matches, setMatches] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = auth.currentUser;

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      const userRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(userRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setFavorites(data.favorites || []);
        setMatches(data.matches || []);
        setFormData(data.lastForm || { school: '', major: '', industry: '' });
      }

      setLoading(false);
    };

    fetchData();
  }, [user]);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const results = await response.json();
      setMatches(results);

      if (user) {
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);
        const oldMatches = userSnap.exists() ? userSnap.data().matches || [] : [];

        await setDoc(userRef, {
          matches: [...oldMatches, ...results],
          lastForm: formData
        }, { merge: true });
      }
    } catch (err) {
      console.error('Error fetching matches', err);
    }
  };

  const addFavorite = async (person) => {
    if (!user) return;

    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);
    const currentFavorites = userSnap.exists() ? userSnap.data().favorites || [] : [];

    const alreadyFavorited = currentFavorites.some(fav => fav.name === person.name && fav.school === person.school);
    if (!alreadyFavorited) {
      const updated = [...currentFavorites, person];
      setFavorites(updated);
      await setDoc(userRef, { favorites: updated }, { merge: true });
    }
  };

  const removeFavorite = async (index) => {
    const updated = favorites.filter((_, i) => i !== index);
    setFavorites(updated);
    if (user) {
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, { favorites: updated }, { merge: true });
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left - Inputs & Favorites (smaller now) */}
      <div className="w-1/3 p-8 overflow-y-auto border-r bg-white">
        <h2 className="text-2xl font-bold text-blue-700 mb-4">Refine Your Results</h2>

        <form onSubmit={handleSubmit} className="space-y-4 mb-8">
          <select
            name="school"
            value={formData.school}
            onChange={handleChange}
            className="w-full p-3 border rounded"
            required
          >
            <option value="">Select your school</option>
            <option value="UNC Chapel Hill">UNC Chapel Hill</option>
            <option value="Harvard University">Harvard University</option>
          </select>

          <select
            name="major"
            value={formData.major}
            onChange={handleChange}
            className="w-full p-3 border rounded"
            required
          >
            <option value="">Select your major</option>
            <option value="Economics">Economics</option>
            <option value="Computer Science">Computer Science</option>
            <option value="Biology">Biology</option>
          </select>

          <select
            name="industry"
            value={formData.industry}
            onChange={handleChange}
            className="w-full p-3 border rounded"
            required
          >
            <option value="">Select your industry</option>
            <option value="Finance">Finance</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Tech">Tech</option>
          </select>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded font-semibold hover:bg-blue-700"
          >
            Get New Matches
          </button>
        </form>

        <h2 className="text-xl font-bold text-blue-700 mb-4">Your Favorites</h2>
        {favorites.length === 0 ? (
          <p className="text-gray-500">You haven’t favorited anyone yet.</p>
        ) : (
          <div className="space-y-3">
            {favorites.map((fav, i) => (
              <div key={i} className="bg-white p-3 rounded shadow border flex justify-between items-center">
                <div>
                  <h3 className="text-md font-semibold text-blue-700">{fav.name}</h3>
                  <p className="text-sm text-gray-600">{fav.major} • {fav.industry}</p>
                </div>
                <button
                  onClick={() => removeFavorite(i)}
                  className="text-red-500 text-sm hover:underline"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Right - Matches (larger now) */}
      <div className="w-2/3 p-6 overflow-y-auto bg-gray-50 shadow-inner">
        <h2 className="text-2xl font-bold text-blue-700 mb-4">Matched Alumni</h2>

        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : matches.length === 0 ? (
          <p className="text-gray-500">No matches yet.</p>
        ) : (
          <div className="space-y-4">
            {matches.map((person, i) => (
              <div key={i} className="bg-white p-4 rounded shadow border">
                <h3 className="text-lg font-bold text-blue-800">{person.name}</h3>
                <p className="text-sm text-gray-700">{person.major} • {person.industry}</p>
                <p className="text-sm text-gray-500">{person.school} • Class of {person.graduationYear}</p>
                <button
                  onClick={() => addFavorite(person)}
                  className="text-sm text-blue-600 mt-1 hover:underline"
                >
                  ⭐ Add to Favorites
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;

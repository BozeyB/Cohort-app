import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

function Match() {
  const [formData, setFormData] = useState({
    school: '',
    major: '',
    industry: ''
  });
  const navigate = useNavigate();
  const user = auth.currentUser;

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

      if (user) {
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);
        const oldMatches = userSnap.exists() ? userSnap.data().matches || [] : [];

        await setDoc(userRef, {
          matches: [...oldMatches, ...results],
          lastForm: formData
        }, { merge: true });
      }

      navigate('/dashboard');

    } catch (err) {
      console.error('Match submission failed:', err);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold text-blue-700 mb-4">Find Your Alumni Matches</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
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
          Match Me
        </button>
      </form>
    </div>
  );
}

export default Match;
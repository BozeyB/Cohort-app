// src/pages/Home.js
import React from 'react';

function Home() {
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold text-blue-700 mb-4">Welcome to Cohort</h2>
      <p className="text-gray-700 text-lg">
        Cohort is a tool for recent graduates to connect with alumni from their schools, fields, and industries.
        Whether you're job hunting, networking, or just curious about where your degree can take you — we've got the people who’ve been there.
      </p>
      <p className="mt-4 text-gray-600">
        Use the Match tool to find alumni that share your background and see where they’ve gone.
      </p>
    </div>
  );
}

export default Home;

// src/pages/About.js
import React from 'react';

function About() {
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-blue-700 mb-4">About Cohort</h2>
      <p className="text-gray-700">
        Cohort was built to solve a simple problem: how can recent college graduates connect meaningfully with alumni who
        share their path? Rather than relying on random LinkedIn messages or cold outreach, Cohort helps you match based on
        school, major, and industry — giving you a head start in the conversations that matter most.
      </p>
      <p className="mt-4 text-gray-600">
        This project is designed to evolve. We’ll soon introduce profiles, favorites, and direct messaging.
        Built with React, Node, and TailwindCSS — Cohort is designed for speed, clarity, and real connections.
      </p>
    </div>
  );
}

export default About;

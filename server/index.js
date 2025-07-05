const express = require('express');
const cors = require('cors');
const alumni = require('./alumniData'); // Load sample alumni

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Default route
app.get('/', (req, res) => {
  res.send('Cohort API is running ✅');
});

// Match route
app.post('/match', (req, res) => {
  const { school, major, industry } = req.body;

  const matches = alumni.filter(person =>
    person.school === school &&
    (person.major === major || person.industry === industry)
  );

  res.json(matches);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
const path = require('path');
app.use(express.static(path.join(__dirname, '../client/build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});
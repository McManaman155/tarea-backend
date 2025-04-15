const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

app.post('/submit', (req, res) => {
  const data = req.body;
  const submissions = fs.existsSync('submissions.json')
    ? JSON.parse(fs.readFileSync('submissions.json'))
    : [];

  submissions.push({ ...data, date: new Date().toISOString() });
  fs.writeFileSync('submissions.json', JSON.stringify(submissions, null, 2));
  res.json({ message: 'Guardado correctamente' });
});

app.get('/submissions', (req, res) => {
  if (fs.existsSync('submissions.json')) {
    const submissions = JSON.parse(fs.readFileSync('submissions.json'));
    res.json(submissions);
  } else {
    res.json([]);
  }
});

app.listen(PORT, () => {
  console.log(`Servidor backend escuchando en http://localhost:${PORT}`);
});

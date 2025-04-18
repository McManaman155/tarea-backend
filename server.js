const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Ruta para recibir nuevas entregas
app.post('/submit', (req, res) => {
  const data = req.body;
  const submissions = fs.existsSync('submissions.json')
    ? JSON.parse(fs.readFileSync('submissions.json'))
    : [];

  submissions.push({
    text: data.text,
    date: new Date().toISOString(),
    status: "Pendiente",
    comment: ""
  });

  fs.writeFileSync('submissions.json', JSON.stringify(submissions, null, 2));
  res.json({ message: 'Guardado correctamente' });
});

// Ruta para obtener todas las entregas
app.get('/submissions', (req, res) => {
  if (fs.existsSync('submissions.json')) {
    const submissions = JSON.parse(fs.readFileSync('submissions.json'));
    res.json(submissions);
  } else {
    res.json([]);
  }
});

// NUEVA Ruta para guardar cambios de profesor
app.post('/save', (req, res) => {
  const updatedSubmissions = req.body;
  fs.writeFileSync('submissions.json', JSON.stringify(updatedSubmissions, null, 2));
  res.json({ message: 'Actualizado correctamente' });
});

app.listen(PORT, () => {
  console.log(`Servidor backend escuchando en http://localhost:${PORT}`);
});

const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();

// Configurar CORS completo
app.use(cors());
app.options('*', cors()); // Permitir todas las OPTIONS

app.use(express.json());

// Ruta para recibir nuevas entregas
app.post('/submit', (req, res) => {
  const { name, text } = req.body;

  if (!name || !text) {
    return res.status(400).json({ error: 'Faltan datos' });
  }

  let submissions = [];

  if (fs.existsSync('submissions.json')) {
    const fileData = fs.readFileSync('submissions.json');
    submissions = JSON.parse(fileData);
  }

  submissions.push({
    name,
    text,
    date: new Date().toISOString(),
    status: "Pendiente",
    comment: ""
  });

  fs.writeFileSync('submissions.json', JSON.stringify(submissions, null, 2));

  res.status(200).json({ message: 'Entrega guardada' });
});

// Ruta para ver todas las entregas
app.get('/submissions', (req, res) => {
  if (fs.existsSync('submissions.json')) {
    const fileData = fs.readFileSync('submissions.json');
    const submissions = JSON.parse(fileData);
    res.status(200).json(submissions);
  } else {
    res.status(200).json([]);
  }
});

// Ruta para guardar correcciones del profesor
app.post('/save', (req, res) => {
  const updatedSubmissions = req.body;

  if (!Array.isArray(updatedSubmissions)) {
    return res.status(400).json({ error: 'Formato incorrecto' });
  }

  fs.writeFileSync('submissions.json', JSON.stringify(updatedSubmissions, null, 2));

  res.status(200).json({ message: 'Cambios guardados' });
});

// Escuchar en el puerto que Railway asigna
const PORT = process.env.PORT || 4000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});

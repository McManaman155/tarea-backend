const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({
  origin: "*",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"],
}));
app.options('*', cors()); // Permitir todas las preflight requests

app.use(express.json());

// Ruta para recibir nuevas entregas
app.post('/submit', (req, res) => {
  const data = req.body;
  const submissions = fs.existsSync('submissions.json')
    ? JSON.parse(fs.readFileSync('submissions.json'))
    : [];

  submissions.push({
    name: data.name || "Anónimo",  // 👈 Nuevo campo: nombre del alumno
    text: data.text,
    date: new Date().toISOString(),
    status: "Pendiente",           // 👈 Nuevo campo: estado inicial
    comment: ""                    // 👈 Nuevo campo: comentario inicial vacío
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

// Ruta para guardar cambios de profesor (estado y comentario)
app.post('/save', (req, res) => {
  const updatedSubmissions = req.body;
  fs.writeFileSync('submissions.json', JSON.stringify(updatedSubmissions, null, 2));
  res.json({ message: 'Actualizado correctamente' });
});

app.listen(PORT, () => {
  console.log(`Servidor backend escuchando en http://localhost:${PORT}`);
});

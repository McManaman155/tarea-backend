const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();

// Middleware para permitir CORS
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
}));
app.use(express.json());

// 🔥 RESPONDER BIEN A CUALQUIER PRE-FLIGHT (OPTIONS)
app.options('*', (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type');
  res.sendStatus(200);
});

// Ruta principal para confirmar que el servidor está activo
app.get('/', (req, res) => {
  res.send('🚀 Servidor backend activo en Render.');
});

// Ruta para recibir nuevas entregas
app.post('/submit', (req, res) => {
  try {
    const { name, text } = req.body;

    if (!name || !text) {
      console.log('❌ Error: Faltan datos en la entrega');
      return res.status(400).json({ error: 'Faltan datos en la entrega' });
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
    console.log('✅ Entrega guardada correctamente:', name);

    res.status(200).json({ message: 'Entrega recibida correctamente' });

  } catch (error) {
    console.error('💥 Error al procesar /submit:', error);
    res.status(500).json({ error: 'Error interno en el servidor' });
  }
});

// Ruta para listar todas las entregas
app.get('/submissions', (req, res) => {
  try {
    if (fs.existsSync('submissions.json')) {
      const fileData = fs.readFileSync('submissions.json');
      const submissions = JSON.parse(fileData);
      res.status(200).json(submissions);
    } else {
      res.status(200).json([]);
    }
  } catch (error) {
    console.error('💥 Error al leer submissions.json:', error);
    res.status(500).json({ error: 'Error al leer entregas' });
  }
});

// Ruta para guardar cambios del profesor
app.post('/save', (req, res) => {
  try {
    const updatedSubmissions = req.body;

    if (!Array.isArray(updatedSubmissions)) {
      console.log('❌ Error: Formato incorrecto en actualización');
      return res.status(400).json({ error: 'Formato incorrecto' });
    }

    fs.writeFileSync('submissions.json', JSON.stringify(updatedSubmissions, null, 2));
    console.log('✅ Cambios guardados correctamente');

    res.status(200).json({ message: 'Cambios guardados correctamente' });

  } catch (error) {
    console.error('💥 Error al procesar /save:', error);
    res.status(500).json({ error: 'Error interno en el servidor' });
  }
});

// 🚀 Escuchar en el puerto que Render asigne
const PORT = process.env.PORT || 4000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});


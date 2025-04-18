const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();

// 💣 1. Permitir CORS correctamente desde el principio
app.use(cors());
app.use(express.json());

// 🔥 2. NO HACER app.options('*', ...) manualmente
// cors() ya se encarga de responder OPTIONS internamente

// Rutas
app.get('/', (req, res) => {
  res.send('🚀 Servidor backend activo en Render.');
});

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
    console.error('💥 Error en /submit:', error);
    res.status(500).json({ error: 'Error interno en el servidor' });
  }
});

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
    console.error('💥 Error en /submissions:', error);
    res.status(500).json({ error: 'Error al leer entregas' });
  }
});

app.post('/save', (req, res) => {
  try {
    const updatedSubmissions = req.body;

    if (!Array.isArray(updatedSubmissions)) {
      console.log('❌ Error: Formato incorrecto en /save');
      return res.status(400).json({ error: 'Formato incorrecto' });
    }

    fs.writeFileSync('submissions.json', JSON.stringify(updatedSubmissions, null, 2));
    console.log('✅ Cambios guardados correctamente');

    res.status(200).json({ message: 'Cambios guardados correctamente' });

  } catch (error) {
    console.error('💥 Error en /save:', error);
    res.status(500).json({ error: 'Error interno en el servidor' });
  }
});

// 🚀 Escuchar en puerto asignado
const PORT = process.env.PORT || 4000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});



const express = require('express');
const cors = require('cors');
const { Ollama } = require('ollama');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const ollama = new Ollama({ host: 'http://127.0.0.1:11434' });

app.post('/generate-cover-letter', async (req, res) => {
  try {
    const { prompt } = req.body;
    const response = await ollama.chat({
      model: 'llama3.1',
      messages: [{ role: 'user', content: prompt }],
    });
    res.json({ result: response.message.content });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}).on('error', (error) => {
  console.error('Failed to start server:', error);
});
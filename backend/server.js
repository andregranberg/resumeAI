const express = require('express');
const cors = require('cors');
const pplx = require('@api/pplx');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

pplx.auth('perplexity_api_key');

app.post('/generate-cover-letter', async (req, res) => {
  try {
    const { prompt } = req.body;
    const response = await pplx.post_chat_completions({
      model: 'llama-3.1-8b-instruct',
      messages: [
        { role: 'system', content: 'You are a professional cover letter writer.' },
        { role: 'user', content: prompt }
      ]
    });
    res.json({ result: response.data.choices[0].message.content });
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
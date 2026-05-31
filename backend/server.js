import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.post('/api/translate', async (req, res) => {
  const { text, sourceLangName, targetLangName } = req.body;

  if (!text || !sourceLangName || !targetLangName) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    return res.status(500).json({ error: 'API Key not configured on the server.' });
  }

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `You are a professional translator. Translate the following text from ${sourceLangName} to ${targetLangName}. Only return the translated text without any quotes, explanations, or additional text:\n\n${text}`
          }]
        }]
      })
    });

    if (!response.ok) {
      throw new Error(`Google API error: ${response.status}`);
    }

    const data = await response.json();
    const translation = data.candidates?.[0]?.content?.parts?.[0]?.text || "Translation failed to parse.";
    
    res.json({ translatedText: translation });
  } catch (error) {
    console.error("Translation Error:", error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

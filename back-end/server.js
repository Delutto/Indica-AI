require('dotenv').config();

const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const endpointExt = 'https://generative-ai-platform-ext.ifood-sandbox.com.br/api/v1/proxy';

const apikey = process.env.API_KEY;

app.post('/api/proxy', async (req, res) => {
    try {
        const response = await fetch(`${endpointExt}/openai/v1/chat/completions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Privacy-Filter': 'enabled',
                'X-API-Key': apikey
            },
            body: JSON.stringify(req.body.body)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error in API request:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Proxy server running on port ${PORT}`);
});

import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import  Bard  from 'bard-ai';

// Load environment variables from .env file
dotenv.config();

// Initialize Bard configuration
const bard = new Bard({
  apiKey: process.env.BARD_AI_API_KEY,
});


// Initialize Express app
const app = express();

// Enable CORS for cross-origin requests
app.use(cors());

// Parse JSON data in request body
app.use(express.json());

// Define API endpoint for generating text
app.post('/', async (req, res) => {
  try {
    // Get the prompt from the request body
    const prompt = req.body.prompt;

    // Generate text using Bard
    const response = await bard.generateText({
      prompt,
      temperature: 0, // Temperature for sampling
      maxTokens: 3000, // Maximum number of tokens to generate
      topP: 1, // Nucleus sampling parameter
      frequencyPenalty: 0.5, // Frequency penalty for penalizing new tokens based on their frequency in the text so far
      presencePenalty: 0, // Presence penalty for penalizing new tokens based on whether they appear in the text so far
    });

    // Extract the generated text from the response
    const generatedText = response.data.choices[0].text;

    // Send the generated text as a response
    res.status(200).send({
      bot: generatedText,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send(error || 'Something went wrong');
  }
});

// Start the Express app on port 5000
app.listen(5000, () => console.log('AI server started on http://localhost:5000'));
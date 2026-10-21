import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Generous payload limit for PDF base64 data
app.use(express.json({ limit: '60mb' }));
app.use(express.urlencoded({ extended: true, limit: '60mb' }));

// Shared Gemini client with telemetry header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Helper to safely parse JSON from model output
function cleanAndParseJSON(rawText: string) {
  let cleaned = rawText.trim();
  // Strip markdown code fences if present
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
  }
  try {
    return JSON.parse(cleaned);
  } catch (err) {
    // Attempt to extract the first balanced JSON object or array
    const jsonMatch = cleaned.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    throw new Error(`Failed to parse AI response as JSON: ${err instanceof Error ? err.message : String(err)}`);
  }
}

// 1. Analyze PDF endpoint
app.post('/api/analyze-pdf', async (req, res) => {
  try {
    const { pdfBase64, fileName, mimeType = 'application/pdf' } = req.body;

    if (!pdfBase64) {
      return res.status(400).json({ error: 'Missing pdfBase64 in request body' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: 'GEMINI_API_KEY environment variable is not configured on the server.' });
    }

    const prompt = `You are StudyPilot, an expert AI exam preparation assistant.
Analyze the attached document carefully and create high-yield, structured exam notes.

Return ONLY a valid JSON object with the following exact keys:
{
  "title": "A concise, professional title for the study material (max 10 words)",
  "summary": "A 2 to 3 sentence high-level overview summarizing the core concepts and importance.",
  "isTruncated": false,
  "topics": [
    {
      "id": "topic-1",
      "title": "Topic Name",
      "bullets": [
        "Concise bullet point 1 (MUST be strictly under 25 words)",
        "Concise bullet point 2 (MUST be strictly under 25 words)",
        "Concise bullet point 3 (MUST be strictly under 25 words)"
      ]
    }
  ],
  "keyTerms": [
    {
      "term": "Term Name",
      "definition": "Clear, precise definition in 1-2 sentences."
    }
  ],
  "examTips": [
    "Tip 1: What examiners love to test or common mistakes to avoid.",
    "Tip 2: Key formula, distinction, or rule often assessed."
  ]
}

Constraints:
1. Provide between 4 and 8 distinct topics.
2. Under each topic, provide 3 to 6 bullet points. Each bullet point MUST be under 25 words.
3. Provide between 6 and 12 key terms with crisp definitions.
4. Provide between 3 and 5 actionable exam tips focused on what is most likely to be examined.
5. If the document is exceptionally long or only a portion could be reviewed, set "isTruncated" to true. Otherwise false.
6. Return purely raw JSON without commentary.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [
        {
          inlineData: {
            mimeType: mimeType || 'application/pdf',
            data: pdfBase64,
          },
        },
        {
          text: prompt,
        },
      ],
      config: {
        responseMimeType: 'application/json',
        temperature: 0.2,
      },
    });

    const parsed = cleanAndParseJSON(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error analyzing PDF with Gemini:', error);
    return res.status(500).json({
      error: error.message || 'Failed to analyze PDF with Gemini API',
    });
  }
});

// 2. Explain with diagram and example endpoint
app.post('/api/explain-topic', async (req, res) => {
  try {
    const { topicTitle, topicBullets, documentContext, questionText, wrongAnswer, correctAnswer } = req.body;

    if (!topicTitle && !questionText) {
      return res.status(400).json({ error: 'topicTitle or questionText is required' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: 'GEMINI_API_KEY is not configured on the server.' });
    }

    const prompt = `You are StudyPilot's Deep Learning Visual Tutor.
Create an intuitive, memorable visual explanation for the following subject:

Context:
${topicTitle ? `Topic: ${topicTitle}` : ''}
${topicBullets ? `Key Points: ${topicBullets.join('; ')}` : ''}
${documentContext ? `Document Context: ${documentContext.slice(0, 500)}` : ''}
${questionText ? `Exam Question Missed: "${questionText}"` : ''}
${wrongAnswer ? `Student's Incorrect Answer: "${wrongAnswer}"` : ''}
${correctAnswer ? `Correct Answer: "${correctAnswer}"` : ''}

You must return ONLY a JSON object with this exact structure:
{
  "simpleExplanation": "3 to 5 short, clear sentences explaining the core intuition and mechanism in plain English.",
  "diagramType": "flow" | "mindmap" | "comparison" | "barchart",
  "diagramData": {
    // Exactly ONE diagram structure chosen based on diagramType:
    // IF "flow" (best for processes, life cycles, algorithmic steps, sequences):
    "steps": [
      { "step": 1, "title": "Step 1 Title", "description": "Short explanation of this phase." },
      { "step": 2, "title": "Step 2 Title", "description": "Short explanation of this phase." },
      { "step": 3, "title": "Step 3 Title", "description": "Short explanation of this phase." }
    ],
    // IF "mindmap" (best for concepts with multiple sub-categories, structures, parts):
    "center": "Central Core Concept",
    "branches": [
      { "title": "Branch 1", "subpoints": ["Aspect A", "Aspect B"] },
      { "title": "Branch 2", "subpoints": ["Aspect C", "Aspect D"] },
      { "title": "Branch 3", "subpoints": ["Aspect E", "Aspect F"] }
    ],
    // IF "comparison" (best for contrasting two ideas, theories, structures, or differences):
    "columns": ["Item A", "Item B"],
    "rows": [
      { "feature": "Criterion 1", "val1": "How A behaves", "val2": "How B behaves" },
      { "feature": "Criterion 2", "val1": "Attribute A", "val2": "Attribute B" },
      { "feature": "Criterion 3", "val1": "Attribute A", "val2": "Attribute B" }
    ],
    // IF "barchart" (ONLY if the material has real numbers, percentages, or quantitative metrics):
    "chartTitle": "Metric Comparison",
    "unit": "% or units",
    "items": [
      { "label": "Category 1", "value": 75, "note": "Brief context" },
      { "label": "Category 2", "value": 25, "note": "Brief context" }
    ]
  },
  "realLifeExample": "A worked real-life example with numbers, concrete real-world scenario, or daily life situation illustrating this.",
  "memoryTrick": "A high-retention mnemonic, analogy, or acronym to never forget this in an exam."
}

Rules:
1. Choose ONE diagramType that best matches the concept.
2. diagramData must strictly populate the relevant fields for that diagramType.
3. Keep the simple explanation strictly between 3 and 5 short sentences.
4. Return raw JSON without markdown formatting.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.3,
      },
    });

    const parsed = cleanAndParseJSON(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error generating topic explanation:', error);
    return res.status(500).json({
      error: error.message || 'Failed to generate explanation',
    });
  }
});

// 3. Generate test session endpoint
app.post('/api/generate-test', async (req, res) => {
  try {
    const { documentTitle, documentSummary, topics, keyTerms, questionCount = 5, difficulty = 'Medium' } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: 'GEMINI_API_KEY is not configured on the server.' });
    }

    const prompt = `You are an elite exam examiner creating a rigorous test session.
Source Material:
Title: ${documentTitle || 'Study Material'}
Summary: ${documentSummary || ''}
Key Topics: ${JSON.stringify(topics || [])}
Key Terms: ${JSON.stringify(keyTerms || [])}

Task:
Generate exactly ${questionCount} multiple-choice test questions strictly from the provided material.
Difficulty Level: ${difficulty} (Easy = foundational definitions and direct facts; Medium = application and distinctions; Hard = multi-step reasoning, scenario evaluation, tricky distractor options).

Return ONLY a valid JSON object matching this schema:
{
  "questions": [
    {
      "id": "q-1",
      "question": "Clear, direct question prompt?",
      "options": [
        "Plausible option A",
        "Plausible option B",
        "Plausible option C",
        "Plausible option D"
      ],
      "correctIndex": 0, // Integer 0, 1, 2, or 3 pointing to the right option
      "explanation": "Why the correct option is right, and specifically why the common distractors are incorrect.",
      "relatedTopic": "Topic Name related to this question"
    }
  ]
}

Rules:
1. Every question must have exactly 4 options.
2. "correctIndex" must be the 0-based index of the single correct answer.
3. Distractors must be realistic and test real comprehension, not silly answers.
4. Keep question text clear and focused.
5. Return strictly raw JSON.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.4,
      },
    });

    const parsed = cleanAndParseJSON(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error generating test session:', error);
    return res.status(500).json({
      error: error.message || 'Failed to generate test session',
    });
  }
});

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', app: 'StudyPilot', model: 'gemini-3.8-flash' });
});

// Vite middleware setup for full-stack SPA
async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production static serving
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`StudyPilot server listening on http://0.0.0.0:${PORT} (${isDev ? 'development' : 'production'})`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

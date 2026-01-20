import { GoogleGenerativeAI } from '@google/generative-ai';

export const runtime = 'edge';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST() {
  const prompt = `
Create EXACTLY 3 short, friendly, open-ended questions.

Rules:
- Each question MUST be under 12 words
- Use simple, casual language
- Avoid explanations or extra text
- No emojis
- No numbering
- No line breaks
- Separate questions ONLY using "||"

These questions are for an anonymous social messaging app.

Example format:
What’s your favorite weekend activity?||What food do you never get tired of?||What song always lifts your mood?
`;

  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
  });

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  return new Response(text, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}

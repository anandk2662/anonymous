import { GoogleGenerativeAI } from '@google/generative-ai';

export const runtime = 'edge';

export async function POST() {
  if (!process.env.GEMINI_API_KEY) {
    return new Response('Missing API key', { status: 500 });
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
    });

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
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    return new Response(text, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  } catch (error) {
    return new Response('Generation failed', { status: 500 });
  }
}

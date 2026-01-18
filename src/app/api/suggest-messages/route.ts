import { google } from '@ai-sdk/google';
import { generateText } from 'ai';
import suggestionsData from '@/messages.json';

export async function POST(req: Request) {
  const prompt = `
Generate exactly 4 short, engaging questions suitable for an anonymous question-asking website.
Separate each question using " || ".
Return only the questions.
`;

  const buildFallback = (): string => {
    try {
      const items = Array.isArray(suggestionsData) ? suggestionsData : [];
      const contents = items
        .map((item: any) => item?.content)
        .filter((c: any) => typeof c === 'string' && c.trim().length > 0);
      for (let i = contents.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [contents[i], contents[j]] = [contents[j], contents[i]];
      }
      const selected = contents.slice(0, 4).map((c: string) => c.trim());
      return selected.join('||');
    } catch {
      return [
        "What's your favorite movie?",
        'Do you have any pets?',
        "What's your dream job?",
        "What's a hobby you love?",
      ].join('||');
    }
  };

  try {
    if (process.env.GOOGLE_API_KEY) {
      const { text } = await generateText({
        model: google('gemini-1.5-flash'),
        prompt,
      });

      const parts = (text || '')
        .split('||')
        .map((p: string) => p.trim())
        .filter((p: string) => p.length > 0);
      const normalized = parts.length >= 4 ? parts.slice(0, 4) : parts;
      const responseText = normalized.length === 4 ? normalized.join('||') : buildFallback();
      return new Response(responseText, { status: 200 });
    }
  } catch {
    // fall through to fallback
  }

  return new Response(buildFallback(), { status: 200 });
}

import { google } from '@ai-sdk/google'
import { streamText } from 'ai'

export async function POST(req: Request) {
  try {
    const prompt = `
Generate exactly 4 short, engaging questions suitable for an anonymous question-asking website.
The questions should encourage curiosity and honest answers.
Do not include numbering, bullets, quotes, or emojis.
Separate each question using " || " (two vertical bars with spaces).
Return only the questions and nothing else.
`

    const result = streamText({
      model: google('models/gemini-1.5-flash'),
      prompt,
      temperature: 0.4,
      providerOptions: {
        google: {
          maxOutputTokens: 80,
        },
      },

    })

    return result.toTextStreamResponse()
  } catch (error) {
    console.error('An unexpected error occurred', error)

    return new Response(
      error instanceof Error ? error.message : 'Failed to generate questions',
      { status: 500 }
    )
  }
}

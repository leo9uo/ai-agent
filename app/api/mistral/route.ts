import { NextRequest, NextResponse } from 'next/server'
import MistralClient from '@mistralai/mistralai'
import { INVESTMENT_ANALYST_PROMPT } from '@/constants/prompts';

export async function POST(req: NextRequest) {
    const mistralApiKey = req.headers.get('X-Mistral-API-Key');
    const { messages, stockData } = await req.json()

    if (!messages || !stockData || !mistralApiKey) {
        return NextResponse.json({ error: 'Missing messages, stockData, or Mistral API key' }, { status: 400 })
    }

    try {
        const mistralClient = new MistralClient(mistralApiKey);

        const mistralMessages = [
            { role: 'system', content: INVESTMENT_ANALYST_PROMPT },
            ...messages.slice(0, -1),
            {
                role: 'user',
                content: `Stock Data:\n${JSON.stringify(stockData, null, 2)}\n\nUser Query: ${messages[messages.length - 1].content}`
            }
        ]

        const stream = await mistralClient.chatStream({
            model: 'mistral-large-latest',
            messages: mistralMessages,
        })

        const encoder = new TextEncoder()

        return new Response(
            new ReadableStream({
                async start(controller) {
                    for await (const chunk of stream) {
                        const content = chunk.choices[0].delta.content
                        if (content) {
                            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`))
                        }
                    }
                    controller.enqueue(encoder.encode('data: [DONE]\n\n'))
                    controller.close()
                },
            }),
            {
                headers: {
                    'Content-Type': 'text/event-stream',
                    'Cache-Control': 'no-cache',
                    'Connection': 'keep-alive',
                },
            }
        )
    } catch (error) {
        console.error('Error in Mistral API:', error)
        return NextResponse.json({ error: 'An error occurred while processing your request.' }, { status: 500 })
    }
}
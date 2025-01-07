import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: 'OpenAI API key not configured' },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    
    if (!body.message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are AXION, a cyberpunk-themed AI assistant. Respond in a style that reflects the neon-lit, high-tech, dystopian future aesthetic of cyberpunk."
        },
        {
          role: "user",
          content: body.message
        }
      ],
    });

    return NextResponse.json({
      message: completion.choices[0].message.content
    });
  } catch (error: any) {
    console.error('OpenAI API error:', error);
    return NextResponse.json(
      { 
        error: error.message || 'An error occurred while processing your request'
      },
      { status: 500 }
    );
  }
} 
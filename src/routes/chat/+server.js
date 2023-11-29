import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';
import { OPENAI_API_KEY } from '$env/static/private';

// Create an OpenAI API client (that's edge friendly!)
const openai = new OpenAI({
  apiKey: OPENAI_API_KEY
});

// Set the runtime to edge for best performance
export const config = {
  runtime: 'edge'
};

export async function POST({ request }) {
  const { messages, options } = await request.json();
  const mymessages = messages.map(({ role, content }) => ({ role, content }));


  // Ask OpenAI for a streaming completion given the prompt
  const response = await openai.chat.completions.create({
    model: options.model || 'gpt-3.5-turbo',
    temperature: options.temperature || 0.9,
    stream: true,
    messages: mymessages,
  });
  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response);
  // Respond with the stream
  return new StreamingTextResponse(stream);
}

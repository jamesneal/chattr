// import dotenv

import { openai } from '$lib/openai.js';
import { OpenAIStream, StreamingTextResponse } from 'ai';


/** @type {import('./$types').Actions} */
export const actions = {
	default: async (event) => {
		var data = await event.request.formData();
		var messages = JSON.parse(data.get('messages'));
		var options = JSON.parse(data.get('options'));

		// If there are errors, catch them and return them
		const response = await openai
			.createChatCompletion({
				model: options.model || 'gpt-3.5-turbo',
				stream: true,
				messages: messages
			})

		const stream = OpenAIStream(response);
		// Respond with the stream
		return new StreamingTextResponse(stream);

	}
};

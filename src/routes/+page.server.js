// import dotenv

import { openai } from "$lib/openai.js"

/** @type {import('./$types').Actions} */
export const actions = {
  default: async (event) => {
    var data = await event.request.formData()
    var prompt = data.get('prompt')
    // Return an object with all the keys and values in the FormData object
    const reply = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: prompt,
      max_tokens: 1000,
    })
    return { prompt: prompt + reply.data.choices[0].text }
  }
}
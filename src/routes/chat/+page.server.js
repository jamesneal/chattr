// import dotenv

import { openai } from "$lib/openai.js"

/** @type {import('./$types').Actions} */
export const actions = {
  default: async (event) => {
    var data = await event.request.formData()
    var messages = JSON.parse(data.get('messages'))
    // Return an object with all the keys and values in the FormData object
    const reply = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: messages,
    })
    return { message: reply.data.choices[0].message }
  }
}
// import dotenv

import { openai } from "$lib/openai.js"
import { error } from '@sveltejs/kit'

/** @type {import('./$types').Actions} */
export const actions = {
  default: async (event) => {
    var data = await event.request.formData()
    var messages = JSON.parse(data.get('messages'))

    // If there are errors, catch them and return them
    const reply = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: messages,
    }).catch((err) => {
      return { error: err, reply: reply }
    })
    return { message: reply.data.choices[0].message }
  }
}
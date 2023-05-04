// import dotenv

import { openai } from "$lib/openai.js"
import { error } from '@sveltejs/kit'

/** @type {import('./$types').Actions} */
export const actions = {
  default: async (event) => {
    var data = await event.request.formData()
    var messages = JSON.parse(data.get('messages'))
    var options = JSON.parse(data.get('options'))

    // If there are errors, catch them and return them
    const reply = await openai.createChatCompletion({
      model: options.model,
      messages: messages,
    }).catch((err) => {
      return { error: err, reply: reply }
    })
    return { message: reply.data.choices[0].message }
  }
}
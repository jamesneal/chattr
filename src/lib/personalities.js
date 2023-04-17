// A Dexie table for storing personality data.
// A personality has a message, a temperature, and an id.
// The id is the primary key.

import Dexie from 'dexie'

export const db = new Dexie('personality')
db.version(1).stores({
  personalities: '++id, message, temperature'
})

async function addPersonality(message, temperature) {
  return await db.personalities.add({ message, temperature })
}

async function getPersonality(id) {
  return await db.personalities.get(id)
}

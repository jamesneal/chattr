// A Dexie table for storing personality data.
// A personality has a message, a temperature, and an id.
// The id is the primary key.

import Dexie from 'dexie'

export const db = new Dexie('personality')

db.version(1).stores({
  personalities: '++id, name, message, temperature'
})



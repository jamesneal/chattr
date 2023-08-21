import { writable } from 'svelte/store';

import { localStorageStore } from '@skeletonlabs/skeleton';

export const options = localStorageStore('chatOptions', { model: 'gpt-3.5-turbo', temperature: 0.9 });
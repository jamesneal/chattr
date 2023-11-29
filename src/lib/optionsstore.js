import { writable } from 'svelte/store';

import { localStorageStore } from '@skeletonlabs/skeleton';

export const options = localStorageStore('chatOptions', { model: 'gpt-4-1106-preview', temperature: 0.9 });
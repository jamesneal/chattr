import { localStorageStore } from '@skeletonlabs/skeleton';

export const conversations = localStorageStore('conversations', {});
export const uuid = localStorageStore('uuid', { uuid: null });

import PubNub from 'pubnub';
import { readable } from 'svelte/store';

import { PUBLIC_PUB_KEY, PUBLIC_SUB_KEY } from '$env/static/public';

import { getRandomAnimalId } from './helpers';

const client = new PubNub({
	publishKey: PUBLIC_PUB_KEY,
	subscribeKey: PUBLIC_SUB_KEY,
	userId: getRandomAnimalId()
});

export const pubnub = readable(client);

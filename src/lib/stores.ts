import PubNub from 'pubnub';
import { readable } from 'svelte/store';

import { getRandomAnimalId } from './helpers';

const client = new PubNub({
	publishKey: 'pub-c-b8aaa1b1-757d-46d7-b6dc-ac92f52c0555',
	subscribeKey: 'sub-c-77f76b48-cc53-4809-810c-de2fcf0bbda2',
	userId: getRandomAnimalId()
});

export const pubnub = readable(client);

import { fromUint8Array, toUint8Array } from 'js-base64';
import PubNub from 'pubnub';
import { throttle } from 'throttle-debounce';
import * as awarenessProtocol from 'y-protocols/awareness';
import * as Y from 'yjs';

export interface PubNubProviderProps {
	pubnubChannel: string;
	pubnubClient: PubNub;
	ydoc: Y.Doc;
	throttleMs?: number;
}

export class PubNubProvider {
	doc: Y.Doc;
	pubnub: PubNub;
	channel: string;
	awareness: awarenessProtocol.Awareness;
	publish: (params: PubNub.PublishParameters) => Promise<PubNub.PublishResponse> | void;
	setState: (params: PubNub.SetStateParameters) => Promise<PubNub.SetStateResponse> | void;

	constructor(params: PubNubProviderProps) {
		const { pubnubChannel, pubnubClient, ydoc, throttleMs } = params;
		this.doc = ydoc;
		this.pubnub = pubnubClient;
		this.channel = pubnubChannel;
		this.awareness = new awarenessProtocol.Awareness(ydoc);
		this.publish = throttle(throttleMs || 500, this.pubnub.publish);
		this.setState = throttle(throttleMs || 500, this.pubnub.setState);

		this.applyLastPNState().then(() => {
			this.setupDocListeners();
			this.setupPNListeners();
			this.subscribeToPNChannel();
		});
	}

	private applyUpdate(update: string) {
		if (typeof update !== 'string') return;
		const decoded = toUint8Array(update);
		Y.applyUpdateV2(this.doc, decoded, this);
	}

	private applyAwarness(update: string) {
		if (typeof update !== 'string') return;
		const decoded = toUint8Array(update);
		awarenessProtocol.applyAwarenessUpdate(this.awareness, decoded, this);
	}

	private applyLastPNState() {
		return this.pubnub.fetchMessages({ channels: [this.channel], count: 1 }).then((response) => {
			const state = response.channels[this.channel]?.[0]?.message;
			if (state && typeof state === 'string') this.applyUpdate(state);
		});
	}

	private setupDocListeners() {
		this.doc.on('updateV2', (_: unknown, origin: unknown) => {
			// console.log("this.doc.on('updateV2'), skipped: ", origin === this)
			if (origin === this) return; // prevents re-publishing updates received from remote
			const state = Y.encodeStateAsUpdateV2(this.doc);
			const message = fromUint8Array(state);
			this.publish({ channel: this.channel, message });
		});

		this.awareness.on('update', (_: unknown, origin: unknown) => {
			// console.log("this.awareness.on('update'), skipped: ", origin === this)
			if (origin === this) return; // prevents re-publishing updates received from remote
			const awareness = awarenessProtocol.encodeAwarenessUpdate(this.awareness, [
				this.doc.clientID
			]);
			const update = fromUint8Array(awareness);
			this.setState({ state: { update }, channels: [this.channel] });
		});
	}

	private setupPNListeners() {
		this.pubnub.addListener({
			message: (event) => {
				// console.log("received pn message: ", event.message)
				this.applyUpdate(event.message);
			},
			presence: (event) => {
				// console.log("received pn presence: ", event)
				const update = event.state?.update;
				if (update) this.applyAwarness(update);
			}
		});
	}

	private subscribeToPNChannel() {
		this.pubnub.subscribe({ channels: [this.channel], withPresence: true });
	}
}

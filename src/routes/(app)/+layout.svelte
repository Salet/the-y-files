<script lang="ts">
	import type { PresenceEvent } from 'pubnub';
	import Quill from 'quill';
	import QuillCursors from 'quill-cursors';
	import { onDestroy } from 'svelte';

	import { page } from '$app/stores';
	import ArrowLeftIcon from '$lib/assets/arrow-left-circle.svg?component';
	import { hashStringToColor, titleize } from '$lib/helpers';
	import { pubnub } from '$lib/stores';

	Quill.register('modules/cursors', QuillCursors);

	let name: string;
	let users: Array<{ state?: unknown; uuid: string }> = [];
	const { channel } = $page.params;
	const type = $page.url.pathname.split('/')[1];
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const pnChannel = ($pubnub as any).channel(channel);
	const subscription = pnChannel.subscription({ receivePresenceEvents: true });

	subscription.addListener({ presence: handlePresence });

	getName();
	getUsers();

	async function getName() {
		try {
			const response = await $pubnub.objects.getChannelMetadata({ channel });
			name = response.data.name || '';
		} catch (e) {
			initFile();
		}
	}

	async function initFile() {
		name = `New ${type}`;
		await updateName();
		$pubnub.signal({ channel: 'notifications', message: 'new-channel' });
	}

	async function updateName() {
		await $pubnub.objects.setChannelMetadata({ channel, data: { name, type } });
	}

	async function getUsers() {
		const response = await $pubnub.hereNow({ channels: [channel] });
		users = response.channels[channel].occupants.filter((u) => u.uuid !== $pubnub.getUUID());
		subscription?.subscribe();
	}

	async function handlePresence(event: PresenceEvent) {
		const { channel: eventChannel, action, uuid, state } = event;
		if (channel !== eventChannel) return;
		if (uuid === $pubnub.getUUID()) return;
		if (action === 'join' && !users.find((u) => u.uuid === uuid)) {
			users = [...users, { uuid, state }];
		}
		if (action === 'leave') {
			users = users.filter((u) => u.uuid !== uuid);
		}
	}

	onDestroy(() => {
		subscription.unsubscribe();
	});
</script>

<nav class="mb-8 flex items-center justify-between text-lg font-bold">
	<a href="/" class="flex text-rose-700 hover:underline"
		><ArrowLeftIcon class="mr-2 w-6" /> All files</a
	>

	<div class="flex space-x-1">
		<div aria-describedby="user-tooltip-{$pubnub.getUUID()}">
			<img
				src="https://api.dicebear.com/8.x/thumbs/svg?seed={$pubnub.getUUID()}"
				alt="{titleize($pubnub.getUUID())} Avatar"
				class="h-8 w-8 rounded-full border-[3px] border-gray-400"
			/>
			<div role="tooltip" id="user-tooltip-{$pubnub.getUUID()}">
				{titleize($pubnub.getUUID())} (You)
			</div>
		</div>
		{#each users as user}
			<div aria-describedby="user-tooltip-{user.uuid}">
				<img
					src="https://api.dicebear.com/8.x/thumbs/svg?seed={user.uuid}"
					alt="{titleize(user.uuid)} Avatar"
					class="h-8 w-8 rounded-full border-[3px]"
					style="border-color: {hashStringToColor(user.uuid)}"
				/>
				<div role="tooltip" id="user-tooltip-{user.uuid}">
					{titleize(user.uuid)}
				</div>
			</div>
		{/each}
	</div>
</nav>

<input
	type="text"
	bind:value={name}
	on:blur={updateName}
	class="box-border w-full border border-b-0 border-gray-300 px-4 py-2 text-2xl font-bold outline-none"
/>

<slot />

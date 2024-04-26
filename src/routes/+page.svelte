<script lang="ts">
	import { nanoid } from 'nanoid';
	import type { ChannelMetadataObject, ObjectCustom, SignalEvent } from 'pubnub';
	import { onDestroy, onMount } from 'svelte';

	import NoteIcon from '$lib/assets/document-text.svg?component';
	import DrawingIcon from '$lib/assets/pencil-square.svg?component';
	import TrashIcon from '$lib/assets/trash.svg?component';
	import { pubnub } from '$lib/stores';

	let files: Array<ChannelMetadataObject<ObjectCustom>> = [];
	const newDocumentId = nanoid();
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const notificationsChannel = ($pubnub as any).channel('notifications');
	const notificationsSubscription = notificationsChannel.subscription();

	notificationsSubscription.addListener({
		signal: (event: SignalEvent) => {
			if (event.message === 'new-channel' || event.message === 'removed-channel') getAllFiles();
		}
	});

	getAllFiles();

	async function getAllFiles() {
		const response = await $pubnub.objects.getAllChannelMetadata({ sort: { updated: 'desc' } });
		files = response.data;
	}

	async function removeFile(id: string) {
		await $pubnub.objects.removeChannelMetadata({ channel: id });
		files = files.filter((f) => f.id !== id);
		$pubnub.signal({ channel: 'notifications', message: 'removed-channel' });
	}

	onMount(async () => {
		notificationsSubscription.subscribe();
	});

	onDestroy(() => {
		notificationsSubscription.unsubscribe();
	});
</script>

<nav class="mb-8 flex justify-end space-x-4">
	<a href="/note/{newDocumentId}" class="button"><NoteIcon class="mr-2 w-6" /> New note</a>
	<a href="/drawing/{newDocumentId}" class="button"><DrawingIcon class="mr-2 w-6" />New drawing </a>
</nav>

<table class="mt-4 w-full border border-gray-300">
	<thead>
		<tr class="border-b border-gray-300">
			<th class="w-0 px-5 py-3 text-left">Type</th>
			<th class="px-5 py-3 text-left">Name</th>
			<th class="w-0 px-5 py-3 text-left">ID</th>
			<th class="w-0 whitespace-nowrap px-5 py-3 text-left">Updated at</th>
			<th class="w-0 px-5 py-3 text-right"></th>
		</tr>
	</thead>

	<tbody>
		{#each files as file}
			<tr class="cursor-pointer border-b border-gray-300 hover:bg-gray-100">
				<td>
					<a href="/{file.type}/{file.id}" class="block whitespace-nowrap px-5 py-3">
						{#if file.type === 'note'}
							<NoteIcon />
						{:else}
							<DrawingIcon />
						{/if}
					</a>
				</td>
				<td><a href="/{file.type}/{file.id}" class="block px-5 py-3">{file.name}</a></td>
				<td>
					<a href="/{file.type}/{file.id}" class="block whitespace-nowrap px-5 py-3">
						{file.id}
					</a>
				</td>
				<td>
					<a href="/{file.type}/{file.id}" class="block whitespace-nowrap px-5 py-3">
						{new Date(file.updated).toLocaleString()}
					</a>
				</td>
				<td class="px-5">
					<button on:click={() => removeFile(file.id)} class="mt-1">
						<TrashIcon class="w-6" />
					</button>
				</td>
			</tr>
		{/each}
	</tbody>
</table>

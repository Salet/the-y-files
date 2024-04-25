<script lang="ts">
	import Quill from 'quill';
	import QuillCursors from 'quill-cursors';
	import { onDestroy, onMount } from 'svelte';
	import { QuillBinding } from 'y-quill';
	import * as Y from 'yjs';

	import { page } from '$app/stores';
	import { hashStringToColor, titleize } from '$lib/helpers';
	import { PubNubProvider } from '$lib/provider';
	import { pubnub } from '$lib/stores';

	Quill.register('modules/cursors', QuillCursors);

	let quill;
	let editorElement: HTMLDivElement;
	let provider: PubNubProvider;
	let ydoc;
	let ytext;
	const { channel } = $page.params;

	onMount(async () => {
		quill = new Quill(editorElement, {
			modules: {
				cursors: {
					transformOnTextChange: true
				},
				toolbar: [
					[{ header: [1, 2, false] }],
					['bold', 'italic', 'underline'],
					['image', 'code-block']
				],
				history: {
					userOnly: true
				}
			},
			placeholder: 'Start collaborating...',
			theme: 'snow'
		});
		ydoc = new Y.Doc();
		ytext = ydoc.getText('quill');
		provider = new PubNubProvider({
			pubnubChannel: channel,
			pubnubClient: $pubnub,
			ydoc
		});
		provider.awareness.setLocalStateField('user', {
			name: titleize($pubnub.getUUID()),
			color: hashStringToColor($pubnub.getUUID())
		});
		new QuillBinding(ytext, quill, provider.awareness);
	});

	onDestroy(() => {
		document.querySelector('.ql-toolbar')?.remove();
	});
</script>

<div bind:this={editorElement} class="h-72"></div>

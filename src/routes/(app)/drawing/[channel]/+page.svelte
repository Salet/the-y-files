<script lang="ts">
	import { getStroke } from 'perfect-freehand';
	import { onMount } from 'svelte';
	import * as Y from 'yjs';

	import { page } from '$app/stores';
	import { hashStringToColor, titleize } from '$lib/helpers';
	import { PubNubProvider } from '$lib/provider';
	import { pubnub } from '$lib/stores';

	let canvasElement: SVGElement;
	let currentStroke: Y.Map<string | Y.Array<number[]>> | null = null;
	const { channel } = $page.params;
	const ydoc = new Y.Doc();
	const provider = new PubNubProvider({
		pubnubChannel: channel,
		pubnubClient: $pubnub,
		ydoc
	});
	const name = titleize($pubnub.getUUID());
	const awareness = provider.awareness;
	const ystrokes = ydoc.getArray('strokes');
	const color = hashStringToColor($pubnub.getUUID());
	const strokeStyle = {
		size: 10,
		thinning: 0.5,
		smoothing: 0.5,
		streamline: 0.5
	};

	awareness.setLocalStateField('user', { name, color });

	function getSvgPathFromStroke(stroke: number[][]) {
		if (!stroke.length) return '';

		const d = stroke.reduce(
			(acc, [x0, y0], i, arr) => {
				const [x1, y1] = arr[(i + 1) % arr.length];
				acc.push(x0, y0, (x0 + x1) / 2, (y0 + y1) / 2);
				return acc;
			},
			['M', ...stroke[0], 'Q']
		);

		d.push('Z');
		return d.join(' ');
	}

	function getEventCoordinates(event: PointerEvent) {
		const canvasRect = canvasElement.getBoundingClientRect();
		return [[event.clientX - canvasRect.left, event.clientY - canvasRect.top, event.pressure]];
	}

	function getSvgStrokeFromYStroke(ystroke: Y.Map<string | Y.Array<number[]>>) {
		const paths = ystroke.get('path');
		if (!paths || typeof paths === 'string') return '';
		return getSvgPathFromStroke(getStroke(paths.toArray(), strokeStyle));
	}

	awareness.on('change', () => {
		canvasElement?.querySelectorAll('circle').forEach((circle) => circle.remove());
		awareness.getStates().forEach((state, clientID) => {
			if (clientID === awareness.clientID) return;
			const pos = state.pos;
			if (!pos) return;
			const svgCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
			svgCircle.setAttribute('cx', pos.x);
			svgCircle.setAttribute('cy', pos.y);
			svgCircle.setAttribute('r', '6');
			svgCircle.setAttribute('fill', state.user.color);
			canvasElement?.appendChild(svgCircle);
		});
	});

	ystrokes.observe((event) => {
		event.changes.added.forEach((item) => {
			item.content.getContent().forEach((ystroke) => {
				const svgPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
				svgPath.setAttribute('d', getSvgStrokeFromYStroke(ystroke));
				svgPath.setAttribute('fill', ystroke.get('color'));
				canvasElement.appendChild(svgPath);
				ystroke.get('path').observe(() => {
					svgPath.setAttribute('d', getSvgStrokeFromYStroke(ystroke));
				});
			});
		});
	});

	onMount(() => {
		canvasElement.addEventListener('pointerdown', (event) => {
			currentStroke = new Y.Map();
			currentStroke.set('color', color);
			const currentPath = new Y.Array<number[]>();
			currentPath.push(getEventCoordinates(event));
			currentStroke.set('path', currentPath);
			ystrokes.push([currentStroke]);
		});

		canvasElement.addEventListener('pointermove', (event) => {
			const [x, y] = getEventCoordinates(event)[0];
			awareness.setLocalStateField('pos', { x, y });
			if (event.buttons !== 1) {
				currentStroke = null;
				return;
			}
			const paths = currentStroke?.get('path');
			if (!paths || typeof paths === 'string') return;
			paths.push(getEventCoordinates(event));
		});
	});
</script>

<div class="relative h-[500px] border border-gray-300">
	<svg xmlns="http://www.w3.org/2000/svg" bind:this={canvasElement} class="h-full w-full touch-none"
	></svg>
</div>

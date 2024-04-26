<script>
	import '../app.css';
</script>

<header class="bg-rose-50">
	<div class="container mx-auto px-8 py-4">
		<h1 class="font-bebas relative text-4xl font-bold tracking-[0.3em] text-rose-700">
			<a href="/">THE Y FILES</a>
			<span
				class="absolute left-[74px] top-[-6px] inline-block h-12 w-12 rounded-full border-2 border-rose-700 text-center"
			></span>
		</h1>
	</div>
</header>

<div class="container mx-auto p-8">
	<main>
		<slot />
	</main>
	<footer class="mt-8 space-y-1 text-sm">
		<hr class="mb-3" />
		<p>Made during PubNub April 2024 Hackathon</p>
		<p>
			Useful links: <a href="https://crdt.tech/" class="text-rose-700 hover:underline"
				>Conflict-free Replicated Data Types</a
			>
			&bull;
			<a href="https://yjs.dev/" class="text-rose-700 hover:underline"
				>Yjs - shared editing framework</a
			>
			&bull;
			<a href="https://www.pubnub.com/" class="text-rose-700 hover:underline"
				>PubNub - real-time interactivity platform</a
			>
		</p>
	</footer>
</div>

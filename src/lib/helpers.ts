import c from 'tailwindcss/colors';

const adj = [
	'adorable',
	'agile',
	'agile',
	'cunning',
	'curious',
	'elegant',
	'endearing',
	'ferocious',
	'fierce',
	'gentle',
	'graceful',
	'hardy',
	'loyal',
	'magnificent',
	'majestic',
	'mysterious',
	'noble',
	'playful',
	'regal',
	'resilient',
	'robust',
	'sociable',
	'stealthy',
	'tenacious',
	'vibrant'
];

const animals = [
	'bear',
	'bison',
	'cheetah',
	'dolphin',
	'eagle',
	'elephant',
	'fox',
	'giraffe',
	'gorilla',
	'hippo',
	'kangaroo',
	'koala',
	'lion',
	'monkey',
	'octopus',
	'otter',
	'owl',
	'panda',
	'penguin',
	'rhino',
	'seal',
	'sloth',
	'tiger',
	'wolf',
	'zebra'
];

export function getRandomAnimalId() {
	return (
		adj[Math.floor(Math.random() * adj.length)] +
		'-' +
		animals[Math.floor(Math.random() * animals.length)]
	);
}

export function titleize(id: string) {
	return id
		.split('-')
		.map((w) => w[0].toUpperCase() + w.substring(1).toLowerCase())
		.join(' ');
}

export function hashStringToColor(id: string) {
	const colors = [
		c.red[400],
		c.orange[400],
		c.amber[400],
		c.yellow[400],
		c.lime[400],
		c.green[400],
		c.emerald[400],
		c.teal[400],
		c.cyan[400],
		c.sky[400],
		c.blue[400],
		c.indigo[400],
		c.violet[400],
		c.purple[400],
		c.fuchsia[400],
		c.pink[400],
		c.rose[400]
	];
	const sum = id
		.split('')
		.map((c) => c.charCodeAt(0))
		.reduce((a, b) => a + b);
	return colors[sum % colors.length];
}

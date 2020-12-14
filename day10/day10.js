const fs = require('fs');
const readline = require('readline');

let adapterArray = []

async function openFileForReading(file) {
	const fileStream = fs.createReadStream(file);

	const rl = readline.createInterface({
		input: fileStream,
		crlfDelay: Infinity
	});

	for await (const line of rl) {
		adapterArray.push(line);
	}
}

function joltDifference(array, index) {
	let currentAdapter = array[index];
	let nextAdapter = array[index+1];
	return nextAdapter - currentAdapter;
}

(async function mainExecution() {
	await openFileForReading('input.txt');
	// sort into ascending order, to make sure no adapters are skipped
	adapterArray.sort((a,b) => { return a - b; });
	let differences = [];
	let tempIndex = 0;
	// outlet -> first adapter
	differences.push(1);
	// calculate differences
	for (; tempIndex < (adapterArray.length - 1); tempIndex++) {
		differences.push(joltDifference(adapterArray, tempIndex));
	}
	// last adapter -> device's adapter
	differences.push(3);
	// separate the two types of differences
	let oneJolt = differences.filter(element => element == 1);
	let threeJolt = differences.filter(element => element == 3);
	console.log("Found it! Multiplying " + oneJolt.length + " by " + threeJolt.length + " is " + (oneJolt.length * threeJolt.length));
})();

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

function possibleAdapters(array, voltage) {
	let eligibleAdapters = [];
	for (const adapter of array) {
		let difference = (adapter - voltage);
		if (difference <= 3 && difference > 0) {
			eligibleAdapters.push(adapter);
		}
	}
	return eligibleAdapters;
}

// returning sequences as an int total, rather than an array of arrays, to save memory?
function findSequences2(array, voltage, sequences = 0, currentSequence = []) {
	// copy the current sequence so we don't add the new values by reference when we recurse
	// ^^ this is what had me stuck for a few hours ^^
	let tempSequence = currentSequence.slice();
	// break condition
	if (array.length == 1) {
		tempSequence.push(voltage);
		sequences++;
		if (sequences % 100000 == 0) {
			console.log("Found sequence " + sequences);
		}
		return sequences;
	} else {
		// find possible next branches
		let possibilities = possibleAdapters(array, voltage);
		// if any branches exist to go to
		if (possibilities.length >= 1) {
			// push the current branch onto the stack and recurse over them
			tempSequence.push(voltage);
			for (const possibility of possibilities) {
				// trim remaining array to save processing time by eliminating elements that won't matter
				let trimmedArray = array.slice(array.indexOf(possibility));
				sequences = findSequences2(trimmedArray, possibility, sequences, tempSequence);
			}
		}
		return sequences;
	}
}

// this works, but runs out of memory
function findSequences(array, voltage, sequences = [], currentSequence = []) {
	// copy the current sequence so we don't add the new values by reference when we recurse
	// ^^ this is what had me stuck for a few hours ^^
	let tempSequence = currentSequence.slice();
	// break condition
	if (array.length == 1) {
		tempSequence.push(voltage);
		sequences.push(tempSequence);
		if ((sequences.length + 1) % 10000 == 0) {
			console.log("Found sequence " + (sequences.length + 1));
		}
		return sequences;
	} else {
		// find possible next branches
		let possibilities = possibleAdapters(array, voltage);
		// if any branches exist to go to
		if (possibilities.length >= 1) {
			// push the current branch onto the stack and recurse over them
			tempSequence.push(voltage);
			for (const possibility of possibilities) {
				// trim remaining array to save processing time by eliminating elements that won't matter
				let trimmedArray = array.slice(array.indexOf(possibility));
				sequences = findSequences(trimmedArray, possibility, sequences, tempSequence);
			}
		}
		return sequences;
	}
}

(async function mainExecution() {
	await openFileForReading('input.txt');
	// adding the outlet voltage
	adapterArray.push(0);
	// adding the device voltage
	adapterArray.push(adapterArray.reduce((a,b) => { return Math.max(a,b); }) + 3);
	// sort into ascending order, to make sure no adapters are skipped
	adapterArray.sort((a,b) => { return a - b; });
	// vv This works, but runs out of memory vv
	//let result = findSequences(adapterArray, adapterArray[0]);
	//console.log("Distinct arrangements: " + result.length);
	// vv This works, but runs out of time vv
	//let result = findSequences2(adapterArray, adapterArray[0]);
	//console.log("Distinct arrangements: " + result);
	
	// Credit to PapaNachos and nothis on Tildes for tips and solutions that led me to this code, which I probably never would have figured out alone...
	let differences = [];
	let sequenceMultiplier = [1,1,2,4,7];
	let sequenceIndex = 0;
	let total = 1;
	let problemString = "";
	for (let i = 0; i < (adapterArray.length - 1); i++) {
		differences.push(joltDifference(adapterArray, i));
	}
	for (const difference of differences) {
		if (difference == 1) {
			sequenceIndex++;
		} else {
			problemString += "*" + sequenceMultiplier[sequenceIndex];
			total *= sequenceMultiplier[sequenceIndex];
			sequenceIndex = 0;
		}
	}
	console.log(problemString);
	console.log("Total combinations: " + total);
})();

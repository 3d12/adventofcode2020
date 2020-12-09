const fs = require('fs');
const readline = require('readline');

let bootCodeArray = []

async function openFileForReading(file) {
	const fileStream = fs.createReadStream(file);

	const rl = readline.createInterface({
		input: fileStream,
		crlfDelay: Infinity
	});

	for await (const line of rl) {
		bootCodeArray.push(line);
	}
}

function parseLine(line) {
	let regex = /^(\w+) ([+-]\d+)$/;
	let found = line.match(regex);
	let action = found[1];
	let amount = parseInt(found[2]);
	return { action, amount };
}

class ExecutionError extends Error {}

function executeLine(parsedLine) {
	switch (parsedLine.action) {
		case 'nop': return { acc: 0, shift: 1 };
		case 'jmp': return { acc: 0, shift: parsedLine.amount };
		case 'acc': return { acc: parsedLine.amount, shift: 1 };
		default: return new ExecutionError("Error parsing execution from line " + parsedLine);
	}
}

(async function mainExecution() {
	await openFileForReading('input.txt');
	let accumulator = 0;
	let operatingIndex = 0;
	let indexHistory = [];
	while (true) {
		if (indexHistory.includes(operatingIndex)) {
			console.log("Finished after " + indexHistory.length + " steps! Accumulator value is " + accumulator);
			return;
		}
		let currentInstruction = executeLine(parseLine(bootCodeArray[operatingIndex]));
		indexHistory.push(operatingIndex);
		accumulator += currentInstruction.acc;
		operatingIndex += currentInstruction.shift;
	}
})();


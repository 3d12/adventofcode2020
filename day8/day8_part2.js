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
	let jmpNopArray = [];
	let tmpIndex = 0;
	for (const line of bootCodeArray) {
		let parsed = parseLine(line);
		if (parsed.action == 'nop' || parsed.action == 'jmp') {
			jmpNopArray.push(tmpIndex);
		}
		tmpIndex++;
	}
	let accumulator = 0;
	let operatingIndex = 0;
	let indexHistory = [];
	let completeRunning = false;
	let jmpNopIndex = 0;
	while (true && !completeRunning) {
		if (operatingIndex >= bootCodeArray.length) {
			console.log("Finished running in " + indexHistory.length + " steps by changing instruction # " + jmpNopArray[jmpNopIndex] + ", accumulator value is " + accumulator);
			return;
		}
		if (indexHistory.includes(operatingIndex)) {
			// infinite loop, restart
			accumulator = 0;
			operatingIndex = 0;
			indexHistory = [];
			jmpNopIndex++;
			continue;
		}
		let currentInstruction = executeLine(parseLine(bootCodeArray[operatingIndex]));
		if (operatingIndex == jmpNopArray[jmpNopIndex]) {
			let parsed = parseLine(bootCodeArray[operatingIndex]);
			if (parsed.action == 'nop') {
				currentInstruction = executeLine({ action: 'jmp', amount: parsed.amount });
			} else if (parsed.action == 'jmp') {
				currentInstruction = executeLine({ action: 'nop', amount: parsed.amount });
			}
		}
		indexHistory.push(operatingIndex);
		accumulator += currentInstruction.acc;
		operatingIndex += currentInstruction.shift;
	}
})();


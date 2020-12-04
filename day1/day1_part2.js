const fs = require('fs');
const readline = require('readline');

let numArr = [];

async function openFileForReading(file) {
	const fileStream = fs.createReadStream(file);

	const rl = readline.createInterface({
		input: fileStream,
		crlfDelay: Infinity
	});

	for await (const line of rl) {
		try {
			numArr.push(parseInt(line));
		} catch(e) {
			console.error(e);
		}
	}
}

(async function mainExecution() {
	await openFileForReading('input.txt');
	// find the entries that sum to 2020
	for (const num1 of numArr) {
		for (const num2 of numArr) {
			const num3 = 2020 - num1 - num2;
			if (num3 <= 0) continue;
			if (numArr.includes(num3)) {
				console.log("Answer found! " + num1 + " * " + num2 + " * " + num3 + " = " + (num1 * num2 * num3));
				return;
			}
		}
	}
})();


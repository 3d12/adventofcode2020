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
	//test: 1667
	// find the entries that sum to 2020
	for (const num1 of numArr) {
		const num2 = 2020 - num1;
		if (numArr.includes(num2)) {
			console.log("Answer found! " + num1 + " * " + num2 + " = " + (num1 * num2));
			break;
		}
	}
})();


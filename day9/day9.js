const fs = require('fs');
const readline = require('readline');

let xmasArray = []

async function openFileForReading(file) {
	const fileStream = fs.createReadStream(file);

	const rl = readline.createInterface({
		input: fileStream,
		crlfDelay: Infinity
	});

	for await (const line of rl) {
		xmasArray.push(line);
	}
}

function validateNumber(prevArray, number) {
	for (let firstIndex = 0; firstIndex < prevArray.length; firstIndex++) {
		for (let secondIndex = (firstIndex+1); secondIndex < prevArray.length; secondIndex++) {
			let firstNumber = parseInt(prevArray[firstIndex]);
			let secondNumber = parseInt(prevArray[secondIndex]);
			if (firstNumber + secondNumber == number) {
				return true;
			}
		}
	}
	return false;
}

(async function mainExecution() {
	await openFileForReading('input.txt');
	let compareArray = [];
	let compareAmount = 25;
	// load the first numbers into the compare array
	for (let i = 0; i < compareAmount; i++) {
		compareArray.push(xmasArray[i]);
	}
	for (let i = compareAmount; i < xmasArray.length; i++) {
		if (!validateNumber(compareArray, xmasArray[i])) {
			console.log("Found it! First vulnerable number is " + xmasArray[i]);
			return;
		}
		compareArray.splice(0, 1);
		compareArray.push(xmasArray[i]);
	}
})();


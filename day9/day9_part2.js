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

function contiguousList(array, targetNumber) {
	for (let firstIndex = 0; firstIndex < array.length; firstIndex++) {
		let contiguousArray = [];
		let firstNumber = parseInt(array[firstIndex]);
		contiguousArray.push(firstNumber);
		for (let secondIndex = (firstIndex+1); secondIndex < array.length; secondIndex++) {
			let secondNumber = parseInt(array[secondIndex]);
			contiguousArray.push(secondNumber);
			let currentSum = contiguousArray.reduce((a,b) => { return a+b; });
			if (currentSum > targetNumber) {
				break;
			}
			if (currentSum == targetNumber) {
				return contiguousArray;
			}
		}
	}
}

(async function mainExecution() {
	await openFileForReading('input.txt');
	let compareArray = [];
	let compareAmount = 25;
	let vulnerableNumber = 0;
	// load the first numbers into the compare array
	for (let i = 0; i < compareAmount; i++) {
		compareArray.push(xmasArray[i]);
	}
	for (let i = compareAmount; i < xmasArray.length; i++) {
		if (!validateNumber(compareArray, xmasArray[i])) {
			vulnerableNumber = xmasArray[i];
			console.log("Found it! First vulnerable number is " + vulnerableNumber);
			break;
		}
		compareArray.splice(0, 1);
		compareArray.push(xmasArray[i]);
	}
	let contiguous = contiguousList(xmasArray, vulnerableNumber);
	let smallest = contiguous.reduce((a,b) => { return Math.min(a,b); });
	let largest = contiguous.reduce((a,b) => { return Math.max(a,b); });
	console.log("Success! The range is:");
	console.log(contiguous);
	console.log("The smallest number of the range is " + smallest + " and the largest is " + largest);
	console.log("The sum of these numbers is: " + (smallest + largest));
})();

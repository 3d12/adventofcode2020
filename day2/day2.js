const fs = require('fs');
const readline = require('readline');

let pwArray = []

async function openFileForReading(file) {
	const fileStream = fs.createReadStream(file);

	const rl = readline.createInterface({
		input: fileStream,
		crlfDelay: Infinity
	});

	for await (const line of rl) {
		pwArray.push(line);
	}
}

function parseLine(line) {
	const regex = /^(\d+)-(\d+) (\w+): (\w+)/;
	const found = line.match(regex);
	return {
		min: found[1],
		max: found[2],
		letter: found[3],
		password: found[4]
	}
}

function passwordValidator(pwInfo) {
	let charCount = 0;
	for (let i = 0; i<pwInfo.password.length; i++) {
		if (pwInfo.password.charAt(i) == pwInfo.letter) {
			charCount++;
		}
	}
	if (charCount >= pwInfo.min && charCount <= pwInfo.max) {
		return true;
	} else {
		return false;
	}
}

(async function mainExecution() {
	await openFileForReading('input.txt');
	let validPasswords = 0;
	for (const line of pwArray) {
		if (passwordValidator(parseLine(line))) validPasswords++;
	}
	console.log("Valid passwords: " + validPasswords);
})();


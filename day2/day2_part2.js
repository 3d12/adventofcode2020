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
	let pos1check = (pwInfo.password.charAt(pwInfo.min - 1) == pwInfo.letter);
	let pos2check = (pwInfo.password.charAt(pwInfo.max - 1) == pwInfo.letter);
	return (pos1check ? !pos2check : pos2check);
}

(async function mainExecution() {
	await openFileForReading('input.txt');
	let validPasswords = 0;
	for (const line of pwArray) {
		let parsed = parseLine(line);
		console.log(parsed);
		console.log(passwordValidator(parsed));
		if (passwordValidator(parseLine(line))) validPasswords++;
	}
	console.log("Valid passwords: " + validPasswords);
})();


const fs = require('fs');
const readline = require('readline');

let formArray = []

async function openFileForReading(file) {
	const fileStream = fs.createReadStream(file);

	const rl = readline.createInterface({
		input: fileStream,
		crlfDelay: Infinity
	});

	for await (const line of rl) {
		formArray.push(line);
	}
}

function parseInput(input) {
	let groupArray = [];
	let currentGroup = "";
	for (const line of input) {
		if (line.trim().length == 0) {
			groupArray.push(parseGroup(currentGroup.trim()));
			currentGroup = "";
		} else {
			currentGroup += " " + line;
		}
	}
	// flush the buffer, in case the file isn't newline-terminated
	if (currentGroup != "") {
		groupArray.push(parseGroup(currentGroup.trim()));
	}
	return groupArray;
}

function parseGroup(group) {
	let distinctAnswers = [];
	let answerBlocks = group.split(' ');
	for (const answers of answerBlocks) {
		for (const answer of answers) {
			if (distinctAnswers.indexOf(answer) == -1) {
				distinctAnswers.push(answer);
			}
		}
	}
	return distinctAnswers;
}

(async function mainExecution() {
	await openFileForReading('input.txt');
	console.log(parseInput(formArray).map(form => { return form.length }).reduce((a,b) => { return a + b }));
})();


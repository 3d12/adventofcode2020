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
	let everyoneAnswers = [];
	let firstBlock = true;
	let answerBlocks = group.split(' ');
	for (const answers of answerBlocks) {
		if (firstBlock) {
			for (const answer of answers) {
				everyoneAnswers.push(answer);
			}
			firstBlock = false;
		} else {
			for (const sharedAnswer of everyoneAnswers) {
				if (everyoneAnswers.length == 0) {
					break;
				}
				if (answers.indexOf(sharedAnswer) == -1) {
					let popIndex = everyoneAnswers.indexOf(sharedAnswer);
					everyoneAnswers = everyoneAnswers.slice(0, popIndex).concat(everyoneAnswers.slice(popIndex+1));
				}
			}
		}
	}
	return everyoneAnswers;
}

(async function mainExecution() {
	await openFileForReading('input.txt');
	console.log(parseInput(formArray).map(form => { return form.length }).reduce((a,b) => { return a + b }));
})();


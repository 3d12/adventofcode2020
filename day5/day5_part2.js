const fs = require('fs');
const readline = require('readline');

let passArray = []

async function openFileForReading(file) {
	const fileStream = fs.createReadStream(file);

	const rl = readline.createInterface({
		input: fileStream,
		crlfDelay: Infinity
	});

	for await (const line of rl) {
		passArray.push(line);
	}
}

class BinaryDirectionError extends Error {}

function binarySplit(direction, begin, end) {
	let total = (end+1) - begin;
	let midpoint = begin + (total / 2) - 1;
	if (direction == "F" || direction == "L") {
		return [ begin, midpoint ];
	}
	if (direction == "B" || direction == "R") {
		return [ midpoint+1, end ];
	}
	return new BinaryDirectionError("Invalid direction: " + direction);
}

function calculateSeatID(seat) {
	return (seat.row * 8) + seat.col;
}

function parseBoardingPass(line) {
	let minRow = 0;
	let maxRow = 127;
	let minCol = 0;
	let maxCol = 7;
	let readIndex = 0;
	for (const direction of line) {
		if (readIndex < 7) {
			[minRow, maxRow] = binarySplit(direction, minRow, maxRow);
		}
		if (readIndex >= 7) {
			[minCol, maxCol] = binarySplit(direction, minCol, maxCol);
		}
		readIndex++;
	}
	return { row: minRow, col: minCol };
}

(async function mainExecution() {
	await openFileForReading('input.txt');
	let idMap = passArray.map((pass) => {
		return calculateSeatID(parseBoardingPass(pass));
	});
	let maxID = idMap.reduce((a,b) => {
		return Math.max(a,b);
	});
	let minID = idMap.reduce((a,b) => {
		return Math.min(a,b);
	});
	for (let i=minID; i<maxID; i++) {
		if (idMap.indexOf(i) == -1) {
			console.log("Your seat is ID: " + i);
			break;
		}
	}
})();


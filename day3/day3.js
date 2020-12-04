const fs = require('fs');
const readline = require('readline');

let mapArray = []

async function openFileForReading(file) {
	const fileStream = fs.createReadStream(file);

	const rl = readline.createInterface({
		input: fileStream,
		crlfDelay: Infinity
	});

	for await (const line of rl) {
		mapArray.push(line);
	}
}

function calculateTreesHit(right, down) {
	let treesHit = 0;
	let rowPos = 0;
	let colPos = 0;
	while (rowPos < mapArray.length) {
		// figure out if we've hit a tree at our current position
		if (mapArray[rowPos].charAt(colPos) == '#') {
			treesHit++;
		}
		// update position (3 right, 1 down)
		if ((colPos + right) >= mapArray[rowPos].length) {
			colPos = (colPos + right) % mapArray[rowPos].length;
		} else {
			colPos += right;
		}
		rowPos += down;
	}
	return treesHit;
}

(async function mainExecution() {
	await openFileForReading('input.txt');
	console.log("Trees hit: " + calculateTreesHit(3, 1));
})();


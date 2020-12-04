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
	let result1 = calculateTreesHit(1, 1);
	console.log("Slope 1,1 hits " + result1 + " trees");
	let result2 = calculateTreesHit(3, 1);
	console.log("Slope 3,1 hits " + result2 + " trees");
	let result3 = calculateTreesHit(5, 1);
	console.log("Slope 5,1 hits " + result3 + " trees");
	let result4 = calculateTreesHit(7, 1);
	console.log("Slope 7,1 hits " + result4 + " trees");
	let result5 = calculateTreesHit(1, 2);
	console.log("Slope 1,2 hits " + result5 + " trees");
	console.log(result1 + " * " + result2 + " * " + result3 + " * " + result4 + " * " + result5 + " = " + (result1 * result2 * result3 * result4 * result5));
})();


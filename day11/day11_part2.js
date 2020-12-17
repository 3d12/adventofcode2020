const fs = require('fs');
const readline = require('readline');

let seatingArray = []

async function openFileForReading(file) {
	const fileStream = fs.createReadStream(file);

	const rl = readline.createInterface({
		input: fileStream,
		crlfDelay: Infinity
	});

	for await (const line of rl) {
		seatingArray.push(line);
	}
}

function findNextNeighbor(array, row, col, rowMod, colMod) {
	let newRow = row;
	let newCol = col;
	while (newRow >= 0 && newRow < array.length && newCol >= 0 && newCol < array[row].length) {
		newRow += rowMod;
		if (newRow >= 0 && newRow < array.length) {
			let rowRef = array[newRow];
			newCol += colMod;
			if (newCol >= 0 && newCol < rowRef.length) {
				let newCell = rowRef[newCol];
				if (newCell == '#') {
					return true;
				} else if (newCell == 'L') {
					return false;
				}
			}
		}
		
	}
	return false;
}

function numNeighbors(array, row, col) {
	let neighbors = 0;
	let directions = [ [1,0], 	// down
			[1,1], 		// down-right
			[0,1], 		// right
			[-1,1], 	// up-right
			[-1,0], 	// up
			[-1,-1], 	// up-left
			[0,-1], 	// left
			[1,-1] ] 	// down-left
	for (const direction of directions) {
		if (findNextNeighbor(array, row, col, direction[0], direction[1])) {
			neighbors++;
		}
	}
	return neighbors;
}

function newSeating(array) {
	let newArray = [];
	for (let rowIter = 0; rowIter < array.length; rowIter++) {
		let currentRow = array[rowIter];
		let newRow = [];
		for (let colIter = 0; colIter < currentRow.length; colIter++) {
			let evalSpot = currentRow[colIter];
			if (evalSpot == 'L') {
				let neighbors = numNeighbors(array, rowIter, colIter);
				if (neighbors == 0) {
					newRow.push('#');
				} else {
					newRow.push(evalSpot);
				}
			} else if (evalSpot == '#') {
				let neighbors = numNeighbors(array, rowIter, colIter);
				if (neighbors >= 5) {
					newRow.push('L');
				} else {
					newRow.push(evalSpot);
				}
			} else {
				newRow.push(evalSpot);
			}
		}
		newArray.push(newRow);
	}
	return newArray;
}

function compareArrays(array1, array2) {
	if (array1.length != array2.length) { return false; }
	for (let rowIter = 0; rowIter < array1.length; rowIter++) {
		let currentRow1 = array1[rowIter];
		let currentRow2 = array2[rowIter];
		if (currentRow1.length != currentRow2.length) { return false; }
		for (let colIter = 0; colIter < currentRow1.length; colIter++) {
			let currentSpot1 = currentRow1[colIter];
			let currentSpot2 = currentRow2[colIter];
			if (currentSpot1 != currentSpot2) { return false; }
		}
	}
	return true;
}

(async function mainExecution() {
	await openFileForReading('input.txt');
	let oldSeats = seatingArray;
	let newSeats = [];
	let iterations = 0;
	while (true) {
		newSeats = newSeating(oldSeats);
		iterations++;
		let same = compareArrays(oldSeats, newSeats);
		if (!same) {
			oldSeats = newSeats;
		} else {
			console.log("Finished! After " + (iterations-1) + " iterations, the positions stop changing!");
			console.log(newSeats.map((element) => { return element.join(''); }).join('\n'));
			console.log("At this point, there are " + newSeats.map((element) => { return element.filter(element => element == '#') }).map((element) => { return element.length }).reduce((a,b) => { return a + b; }) + " occupied seats");
			return;
		}
	}
})();

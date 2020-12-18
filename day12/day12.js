const fs = require('fs');
const readline = require('readline');

let instructionsArray = []

async function openFileForReading(file) {
	const fileStream = fs.createReadStream(file);

	const rl = readline.createInterface({
		input: fileStream,
		crlfDelay: Infinity
	});

	for await (const line of rl) {
		instructionsArray.push(line);
	}
}

function parseLine(line) {
	let regex = /(\w)(\d+)/;
	let found = line.match(regex);
	let direction = found[1];
	let amount = found[2];
	let action = undefined;
	if (['N','S','E','W','F'].includes(direction)) {
		action = 'move';
	} else if (['L','R'].includes(direction)) {
		action = 'turn';
	}
	return { action, direction, amount };
}

class Ship {
	constructor() {
		this.x = 0;
		this.y = 0;
		this.direction = 90;
	}

	moveShip(direction, amount) {
		if (direction == 'F') {
			direction = this.facingDirection(this.direction);
		}
		switch(direction) {
			case 'N': this.y += parseInt(amount); break;
			case 'S': this.y -= parseInt(amount); break;
			case 'E': this.x += parseInt(amount); break;
			case 'W': this.x -= parseInt(amount); break;
		}
	}

	facingDirection(degrees) {
		switch(degrees) {
			case 0: return 'N';
			case 90: return 'E';
			case 180: return 'S';
			case 270: return 'W';
		}
	}

	turnShip(direction, amount) {
		switch(direction) {
			case 'L': let tempDirection = (this.direction - parseInt(amount));
				if (tempDirection < 0) {
					this.direction = (tempDirection + 360);
				} else {
					this.direction = (tempDirection % 360);
				}
				break;
			case 'R': this.direction = ((this.direction + parseInt(amount)) % 360); break;
		}
	}

	currentCoordinates() {
		return this.x + "," + this.y;
	}
}

function manhattanDistance(x1, x2, y1, y2) {
	return (Math.abs(x1 - x2) + Math.abs(y1 - y2));
}

(async function mainExecution() {
	await openFileForReading('input.txt');
	let theShip = new Ship();
	console.log("DEBUG: Ship is currently at " + theShip.currentCoordinates() + " - facing: " + theShip.facingDirection(theShip.direction));
	for (const inst of instructionsArray) {
		let parsedLine = parseLine(inst);
		console.log(parsedLine);
		switch (parsedLine.action) {
			case 'move': theShip.moveShip(parsedLine.direction, parsedLine.amount); break;
			case 'turn': theShip.turnShip(parsedLine.direction, parsedLine.amount); break;
		}
		console.log("DEBUG: Ship is currently at " + theShip.currentCoordinates() + " - facing " + theShip.facingDirection(theShip.direction));
	}
	console.log("Done! Manhattan distance from 0,0 is: " + manhattanDistance(0, theShip.x, 0, theShip.y));
})();

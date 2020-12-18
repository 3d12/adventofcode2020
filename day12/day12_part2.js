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
	}

	move(waypoint) {
		this.x += waypoint.offsetX;
		this.y += waypoint.offsetY;
	}

	currentCoordinates() {
		return this.x + "," + this.y;
	}
}

class Waypoint {
	constructor() {
		this.offsetX = 10;
		this.offsetY = 1;
	}

	rotate(direction, amount) {
		switch(direction) {
			case 'L': for (let i = (amount / 90); i > 0; i--) {
				let tempOffsetX = this.offsetX;
				this.offsetX = -this.offsetY;
				this.offsetY = tempOffsetX;
				}
				break;
			case 'R': for (let i = (amount / 90); i > 0; i--) {
				let tempOffsetX = this.offsetX;
				this.offsetX = this.offsetY;
				this.offsetY = -tempOffsetX;
				}
				break;
		}
	}

	move(direction, amount) {
		switch(direction) {
			case 'N': this.offsetY += parseInt(amount); break;
			case 'S': this.offsetY -= parseInt(amount); break;
			case 'E': this.offsetX += parseInt(amount); break;
			case 'W': this.offsetX -= parseInt(amount); break;
		}
	}

	currentCoordinates() {
		return this.offsetX + "," + this.offsetY;
	}
}

function manhattanDistance(x1, x2, y1, y2) {
	return (Math.abs(x1 - x2) + Math.abs(y1 - y2));
}

(async function mainExecution() {
	await openFileForReading('input.txt');
	let theShip = new Ship();
	let theWaypoint = new Waypoint();
	console.log("DEBUG: Ship is currently at " + theShip.currentCoordinates() + " - waypoint offsets: " + theWaypoint.currentCoordinates());
	for (const inst of instructionsArray) {
		let parsedLine = parseLine(inst);
		console.log(parsedLine);
		switch (parsedLine.action) {
			case 'move':
				if (parsedLine.direction == 'F') {
					for (let i = parsedLine.amount; i > 0; i--) {
						theShip.move(theWaypoint);
					}
				} else {
					theWaypoint.move(parsedLine.direction, parsedLine.amount);
				}
				break;
			case 'turn': theWaypoint.rotate(parsedLine.direction, parsedLine.amount); break;
		}
		console.log("DEBUG: Ship is currently at " + theShip.currentCoordinates() + " - waypoint offsets: " + theWaypoint.currentCoordinates());
	}
	console.log("Done! Manhattan distance from 0,0 is: " + manhattanDistance(0, theShip.x, 0, theShip.y));
})();

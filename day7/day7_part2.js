const fs = require('fs');
const readline = require('readline');

let luggageArray = []

async function openFileForReading(file) {
	const fileStream = fs.createReadStream(file);

	const rl = readline.createInterface({
		input: fileStream,
		crlfDelay: Infinity
	});

	for await (const line of rl) {
		luggageArray.push(line);
	}
}

function parseContents(contents) {
	let regex = /(((\d+) (\w+) (\w+) bag[s]?[,.])+|no other bags\.)/g;
	let found = contents.matchAll(regex);
	let contentsArray = [];
	for (const match of found) {
		if (match[3] == undefined) {
			contentsArray.push({ type: 'none', amount: 0 });
		} else {
			let bagType = match[4] + ' ' + match[5];
			let bagAmount = parseInt(match[3]);
			contentsArray.push({ type: bagType, amount: bagAmount });
		}
	}
	return contentsArray;
}

function parseLine(line) {
	let regex = /^(\w+) (\w+) bags contain (.*)$/;
	let found = line.match(regex);
	let adj1 = found[1];
	let adj2 = found[2];
	let contents = found[3];
	let parsedContents = parseContents(contents);
	return { type: adj1 + ' ' + adj2,
		contents: parsedContents };
}

function allContainedBagTypes(array, bag, containedTypes = []) {
	console.log("DEBUG: running allContainedBagTypes on " + bag.type);
	// current position, used to get contents
	let currentBag = array.find(element => element.type == bag.type);
	let total = 0;
	// loop
	for (const contained of currentBag.contents) {
		console.log("DEBUG: contained = " + contained.type);
		// break condition
		if (contained.type == 'none') {
			console.log("DEBUG: breaking loop...");
			containedTypes.push({ type: contained.type, amount: 0 });
			return { total: 0, containedTypes };
		}
		// if value doesn't exist
		if (!containedTypes.map(element => element.type).includes(contained.type)) {
			// push it into the array as value of 0
			containedTypes.push({ type: contained.type, amount: contained.amount });
		}
		console.log("DEBUG: containedTypes:");
		console.log(containedTypes);
		let recurse = allContainedBagTypes(array, contained, containedTypes);
		console.log("DEBUG: recurse:");
		console.log(recurse);
		containedTypes[containedTypes.findIndex(element => element.type == contained.type)].amount += (recurse.containedTypes[containedTypes.findIndex(element => element.type == contained.type)].amount);
		total += (recurse.total * contained.amount) + contained.amount;;
		console.log("DEBUG: new total is: " + total);
	}
	console.log("DEBUG: returning from allContainedBagTypes...");
	return { total, containedTypes };
}

(async function mainExecution() {
	await openFileForReading('input.txt');
	let parsedArray = [];
	for (const line of luggageArray) {
		parsedArray.push(parseLine(line));
	}
	let containsArray = [];
	for (const line of parsedArray) {
		if (line.type == 'shiny gold') {
			let temp = allContainedBagTypes(parsedArray, line);
			console.log(temp);
			console.log(temp.total);
		}
	}
})();


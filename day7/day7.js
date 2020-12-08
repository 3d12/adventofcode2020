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
	return { bag: adj1 + ' ' + adj2,
		contents: parsedContents };
}

function allContainedBagTypes(array, bag, containedTypes = []) {
	let currentBag = array.filter(element => element.bag == bag);
	for (const content of currentBag[0].contents) {
		if (content.type == "none") {
			return containedTypes;
		}
		if (containedTypes.indexOf(content.type) == -1) {
			containedTypes.push(content.type);
			containedTypes.concat(allContainedBagTypes(array, content.type, containedTypes));
		}
	}
	return containedTypes;
}

(async function mainExecution() {
	await openFileForReading('input.txt');
	let parsedArray = [];
	for (const line of luggageArray) {
		parsedArray.push(parseLine(line));
	}
	let containedTypes = parsedArray.map(element => allContainedBagTypes(parsedArray, element.bag));
	let containsGold = containedTypes.filter(element => element.indexOf('shiny gold') != -1);
	console.log(containsGold.length);
})();


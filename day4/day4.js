const fs = require('fs');
const readline = require('readline');

let passportArray = []

async function openFileForReading(file) {
	const fileStream = fs.createReadStream(file);

	const rl = readline.createInterface({
		input: fileStream,
		crlfDelay: Infinity
	});

	for await (const line of rl) {
		passportArray.push(line);
	}
}

function parsePassport(text) {
	let byr = "",iyr = "",eyr = "",hgt = "",hcl = "",ecl = "",pid = "",cid = "";
	let singleLineText = text.replace(/\n/g,' ');
	// check for all instances of k/v pairs in the single-line version of the text
	const regex = /(\b\w+):([\w|\d|#]+\b)/g;
	const found = singleLineText.match(regex);
	// for each k/v pair, save to the correct variable by matching the key
	for (const kvpair of found) {
		const regex2 = /(\b\w+):([\w|\d|#]+\b)/;
		const found2 = kvpair.match(regex2);
		switch (found2[1]) {
			case 'byr': byr = found2[2];
					break;
			case 'iyr': iyr = found2[2];
					break;
			case 'eyr': eyr = found2[2];
					break;
			case 'hgt': hgt = found2[2];
					break;
			case 'hcl': hcl = found2[2];
					break;
			case 'ecl': ecl = found2[2];
					break;
			case 'pid': pid = found2[2];
					break;
			case 'cid': cid = found2[2];
					break;
		}
	}
	return {
		byr: byr,
		iyr: iyr,
		eyr: eyr,
		hgt: hgt,
		hcl: hcl,
		ecl: ecl,
		pid: pid,
		cid: cid
	}
}

function splitPassports() {
	let splitArray = [];
	let currentPassport = "";
	for (const line of passportArray) {
		// if we find a blank line, reset our accumulated line and send for parsing
		if (line.trim().length == 0) {
			splitArray.push(parsePassport(currentPassport));
			currentPassport = "";
		} else {
			currentPassport += ' ' + line;
		}
	}
	// flushing the buffer, in case the file is not newline-terminated
	if (currentPassport != "") {
		splitArray.push(parsePassport(currentPassport));
	}
	return splitArray;
}

function validatePassport(passport) {
	// check that required fields are non-blank
	return (passport.byr != "" &&
		passport.iyr != "" &&
		passport.eyr != "" &&
		passport.hgt != "" &&
		passport.hcl != "" &&
		passport.ecl != "" &&
		passport.pid != ""); //&&
		//passport.cid != "");
}

(async function mainExecution() {
	await openFileForReading('input.txt');
	let parsedArray = splitPassports();
	let validPassports = 0;
	for (const port of parsedArray) {
		if (validatePassport(port)) validPassports++;
	}
	console.log("Valid passports: " + validPassports);
})();


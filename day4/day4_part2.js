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
	if (passport.byr == "" ||
		passport.iyr == "" ||
		passport.eyr == "" ||
		passport.hgt == "" ||
		passport.hcl == "" ||
		passport.ecl == "" ||
		passport.pid == "") {
		return false;
	}
	// byr, iyr, and eyr should be numbers
	let byrnum = 0,iyrnum = 0,eyrnum = 0;
	try {
		byrnum = parseInt(passport.byr);
		iyrnum = parseInt(passport.iyr);
		eyrnum = parseInt(passport.eyr);
	} catch(e) {
		return false;
	}
	// byr four digits, between 1920 and 2002
	if (passport.byr.length != 4 || byrnum < 1920 || byrnum > 2002) {
		return false;
	}
	// iyr four digits, between 2010 and 2020
	if (passport.iyr.length != 4 || iyrnum < 2010 || iyrnum > 2020) {
		return false;
	}
	// eyr four digits, between 2020 and 2030
	if (passport.eyr.length != 4 || eyrnum < 2020 || eyrnum > 2030) {
		return false;
	}
	// hgt, number followed by cm or in
	let hgtnum = 0,hgtunits = "";
	try {
		const regex = /(\d+)(cm|in)/;
		const found = passport.hgt.match(regex);
		hgtnum = parseInt(found[1]);
		hgtunits = found[2];
	} catch(e) {
		return false;
	}
	if (hgtunits != 'cm' && hgtunits != 'in' ) {
		return false;
	}
	// -- if cm, must be between 150 and 193
	if (hgtunits == 'cm' && (hgtnum < 150 || hgtnum > 193)) {
		return false;
	}
	// -- if in, must be between 59 and 76
	if (hgtunits == 'in' && (hgtnum < 59 || hgtnum > 76)) {
		return false;
	}
	// hcl a # followed by exactly six chars 0-9 or a-f
	let hclnum = 0;
	try {
		const regex = /(#)([0-9a-f]{6})/;
		const found = passport.hcl.match(regex);
		hclnum = found[2];
	} catch(e) {
		return false;
	}
	// ecl exactly one of: amb blu brn gry grn hzl oth
	switch (passport.ecl) {
		case 'amb':
		case 'blu':
		case 'brn':
		case 'gry':
		case 'grn':
		case 'hzl':
		case 'oth':
				break;
		default:
			return false;
	}
	// pid nine-digit number, incl leading zeroes
	let pidnum = 0;
	try {
		const regex = /(\d{9})/;
		const found = passport.pid.match(regex);
		pidnum = found[1];
	} catch(e) {
		return false;
	}
	// cid, ignored
	console.log(passport);
	console.log("^^ Valid Passport ^^");
	return true;
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


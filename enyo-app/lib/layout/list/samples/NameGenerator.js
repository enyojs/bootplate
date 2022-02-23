// Licensed under Creative Commons Attribution 3.0 License
// attributed to: http://leapon.net/en/random-name-generator-javascript

/* exported makeName */
function makeName(minlength, maxlength, prefix, suffix) {

	function rnd(minv, maxv) {
		if (maxv < minv) {
			return 0;
		}
		return Math.floor(Math.random()*(maxv-minv+1)) + minv;
	}

	prefix = prefix || '';
	suffix = suffix || '';
	// these weird character sets are intended to cope with the nature of English (e.g. char 'x' pops up less frequently than char 's')
	// note: 'h' appears as consonants and vocals
	var vocals = 'aeiouyh' + 'aeiou' + 'aeiou';
	var cons = 'bcdfghjklmnpqrstvwxz' + 'bcdfgjklmnprstvw' + 'bcdfgjklmnprst';
	var allchars = vocals + cons;
	var length = rnd(minlength, maxlength) - prefix.length - suffix.length;
	if (length < 1) {
		length = 1;
	}
	var consnum = 0;
	var i;
	if (prefix.length > 0) {
		for (i = 0; i < prefix.length; i++) {
			if (consnum == 2) {
				consnum = 0;
			}
			if (cons.indexOf(prefix[i]) != -1) {
				consnum++;
			}
		}
	}
	else {
		consnum = 1;
	}
	var name = prefix;
	for (i = 0; i < length; i++)
	{
		var touse;
		//if we have used 2 consonants, the next char must be vocal.
		if (consnum == 2)
		{
			touse = vocals;
			consnum = 0;
		}
		else {
			touse = allchars;
		}
		//pick a random character from the set we are goin to use.
		var c = touse.charAt(rnd(0, touse.length - 1));
		name = name + c;
		if (cons.indexOf(c) != -1) {
			consnum++;
		}
	}
	name = name.charAt(0).toUpperCase() + name.substring(1, name.length) + suffix;
	return name;
}
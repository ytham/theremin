// Apparently noteFreqs isn't the actual frequency of the note. (lol)
// It's only used for display purpose, and uses some interesting calculation blablablabla things I don't need to care.
// BUTT! This should be very easy to research.

// http://www.phy.mtu.edu/~suits/noteFreqs.html
// Table of frequency.
// each octave of a single note has doubled frequency
// I can have ranges of octave (of how many times it gets timed) (get it, times timed, hehehe)
// starting at C0!

// 12 equal temperament
var basenoteFreqs = [
16.35, // C
17.32, // C#
18.35, // D
19.45, // Eb
20.60, // E
21.83, // F
23.12, // F#
24.50, // G
25.96, // G#
27.50, // A
29.14, // Bb
30.87  // B
];
var naturalMajorScale = [ 0, 2, 4, 5, 7, 9, 11 ];
var naturalMinorScale = [ 0, 2, 3, 5, 7, 8, 10 ]; // this will just sound the same as major - for now
// Here's where I get overly obsessive when it's 7:38 in the morning and I prefer coding like a monkey than writing logics
var harmonicMinorScale = [ 0, 2, 3, 5, 7, 8, 11 ];
var majorPentatonicScale = [ 0, 2, 4, 7, 9 ];
var minorPentatonicScale = [ 0, 3, 5, 7, 10 ]; // see natural Minor Scale's comment
// oh come on now, at this point I'm just showing off.
var jazzMinorScale = [ 0, 2, 3, 5, 7, 9, 11 ]; // I actually just found that one on Wikipedia
var bluesMinorScale = [ 0, 3, 5, 6, 7, 10 ];
var flamencoScale = [ 0, 1, 4, 5, 7, 8, 11 ];
var whoneToneScale = [ 0, 2, 4, 6, 8, 10 ];
var japaneseScale = [ 0, 2, 3, 7, 8]; // wow, now that I look at it, this is super sketchy
// Alright, I admit the rest are just scales on Wikipedia
var algerianScale = [ 0, 2, 3, 5, 6, 7, 10 ];
var enigmaticScale = [ 0, 1, 4, 6, 8, 9, 11 ]; // Joe Satriani, The Enigmatic
var japaneseYoScale = [ 0, 3, 5, 7, 11 ];
var tritoneScale = [ 0, 1, 4, 6, 7, 10 ]; // It's the devil!
var gypsyScale = [ 0, 2, 3, 6, 7, 8, 10 ];

var curOctave = 0; // for displaying octave

function setScaleBase(inScale) {
	for (var i = 0; i < inScale.length; i++) {
		scaleBase.push(basenoteFreqs[inScale[i]]);
	};
}

function mapFreqToNote(inFreq) {
	if (inFreq == 0 ) return 0;
	var tOctave = 0;
	// find the clost octave the freq can ceil to
	while (inFreq > basenoteFreqs[0] * Math.pow(2, tOctave)) // scale starts at C.
	{
		tOctave ++;
	}
	//console.log(tOctave);
	curOctave = tOctave;
	for (var i = 0; i < scaleBase.length; i++) { // for every note in a scale
		// find the closest note the freq can ceil to
		
		if ( inFreq >= scaleBase[i] * Math.pow(2, tOctave - 1) ){
			//inFreq = scaleBase[i] * Math.pow(2, tOctave - 1);
		} else {
			return scaleBase[i] * Math.pow(2, tOctave - 1);
		}
	};
	
	//console.log("inFreq: " + inFreq);
	return scaleBase[0] * Math.pow(2, tOctave);
}
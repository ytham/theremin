// Data
var noteNames = ['C3','D3','E3','F3','G3','A3','B3','C4','D4','E4','F4','G4','A4','B4','C5','D5','E5','F5','G5','A5','B5','C6'];
var noteFreqs =  [130 , 146, 164, 174, 196, 220, 246,261 ,293 ,329 ,349 ,392 ,440 ,493 ,523 ,587 ,659 ,698, 783 ,880, 987 ,1046];

var scaleBase = [];

function initialize() {

  // set up scale base
  setScaleBase(majorPentatonicScale);
  
  // Write note data to screen
  if(noteNames.length === noteFreqs.length) { // Array lengths should match
    for(var i = 0; i < noteFreqs.length; i++) {
      // Convert to %
      y_coordinate = 100*(1-((noteFreqs[i] - noteFreqs[0])/(noteFreqs[noteFreqs.length-1] - noteFreqs[0])));

      // Generate the note label
      var div = document.createElement("div");
      div.setAttribute('class', 'floating');
      div.style.top = String(y_coordinate) + "%";
      div.textContent = noteNames[i];
      document.body.appendChild(div);
      
      // Generate the lines
      var hr = document.createElement("hr");
      hr.setAttribute('class', 'line');
      hr.style.top = String(y_coordinate) + "%";
      document.body.appendChild(hr);

      // Hide the controller divs initially
      document.getElementById("controller_one").style.visibility = "hidden";
      document.getElementById("controller_two").style.visibility = "hidden";
    }
  }
}

// Declare variables
var sampleRate = 44100;
var frequency = 440;
var audio = [];
var oscillator = [];
var gainNode = [];
for(var i = 0; i < 4; i++) {
  audio[i] = new webkitAudioContext();

  // Audio Variables
  oscillator[i] = audio[i].createOscillator();
  gainNode[i] = audio[i].createGainNode();
  oscillator[i].frequency.value = 0;
  // 0 - Sine wave
  // 1 - Square wave
  // 2 - Sawtooth
  // 3 - Triangle
  oscillator[i].type = 3; 
  oscillator[i].connect(gainNode[i]);
  gainNode[i].connect(audio[i].destination);
  gainNode[i].gain.value = 0;
  oscillator[i].noteOn(0);
}

// Leap motion loop
Leap.loop(function(frame) {
  // Check if any hands are present
  if(frame.hands.length < 1) {
    gainNode[0].gain.value = 0;
    gainNode[1].gain.value = 0;
    document.getElementById("frequency_one").textContent = 0;
    document.getElementById("volume_one").textContent = 0;
    document.getElementById("frequency_two").textContent = 0;
    document.getElementById("volume_two").textContent = 0;
    document.getElementById("controller_one").style.visibility = "hidden";
    document.getElementById("controller_two").style.visibility = "hidden";
    return;
  }
  //console.log(frame);
  // Declare variables
  var freq = [];
  var vol = [];
  var hand = [];
  var x = [];
  var y = [];
  var z = [];

  // Get xyz positions of the palm(s); only x and y are used.
  for(var i = 0; i < frame.hands.length; i++) {
    hand[i] = frame.hands[i];
    // [Changbai] Looks like the new leap.js cleaned up and stopped using vectors.
    // x,y,z are stored in as numbers in the array instead
    x[i] = hand[i].palmPosition[0];
    y[i] = hand[i].palmPosition[1];
    z[i] = hand[i].palmPosition[2];
  }
  
  // Modify the sound based on leap coordinates
  freq[0] = Math.abs(y[0]*4 - 150);
  vol[0] = Math.abs(2 - z[0]*0.01);
  if(frame.hands.length === 1) {
    freq[1] = 0;
    vol[1] = 0;
  } else {
    freq[1] = Math.abs(y[1]*4 - 150);
    vol[1] = Math.abs(2 - z[1]*0.01);
  }

  // Output the sound to the oscillator and gainnode
  oscillator[0].frequency.value = mapFreqToNote(freq[0]);
  gainNode[0].gain.value = vol[0];
  oscillator[1].frequency.value = mapFreqToNote(freq[1]);
  gainNode[1].gain.value = vol[1];
  
  // Update HTML elements w/ frequency/gain data
  document.getElementById("frequency_one").textContent = String(Math.floor(oscillator[0].frequency.value));// String(Math.floor(freq[0]));
  document.getElementById("volume_one").textContent = String(Math.floor(vol[0]*25));
  document.getElementById("frequency_two").textContent = String(Math.floor(oscillator[1].frequency.value));
  document.getElementById("volume_two").textContent = String(Math.floor(vol[1]*25));

  // Move the div based on frequency and volume
  document.getElementById("controller_one").style.visibility = "visible";
  if(frame.hands.length === 2) {
    document.getElementById("controller_two").style.visibility = "visible";
  } else {
    document.getElementById("controller_two").style.visibility = "hidden";
  }
  document.getElementById("controller_one").style.top = String(100*(1-((freq[0] - noteFreqs[0])/(noteFreqs[noteFreqs.length-1] - noteFreqs[0])))) + "%";
  document.getElementById("controller_one").style.left = String(100 - Math.abs(2 - x[0]*0.01)*25) + "%";
  document.getElementById("controller_two").style.top = String(100*(1-((freq[1] - noteFreqs[0])/(noteFreqs[noteFreqs.length-1] - noteFreqs[0])))) + "%";
  document.getElementById("controller_two").style.left = String(100 - Math.abs(2 - x[1]*0.01)*25) + "%";
});
const { Howl } = require('howler');

let audioEnabled = true;

const playCountdown = () => {
  if (audioEnabled) {
    new Howl({ src: ['static/mario-kart-race-start.mp3'] }).play();
  }
};

const getAudioEnabled = () => {
  return audioEnabled;
};

const setAudioEnabled = (value) => {
  audioEnabled = value;
};

export default { playCountdown, getAudioEnabled, setAudioEnabled };
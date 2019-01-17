import audio from './audio';

const startCountdown = (countdownData, cb) => {

  countdownData.lights = [];
  countdownData.value = 'Ready';
  countdownData.showDialog = true;

  setTimeout(() => {
    audio.playCountdown();

    setTimeout(() => {
      countdownData.lights.push('countdown-red');
      countdownData.value = 3;

      countdownData.interval = setInterval(() => {

        if (countdownData.value > 1) {
          countdownData.lights.push('countdown-red');
          countdownData.value--;

        } else {
          countdownData.lights = ['countdown-green', 'countdown-green', 'countdown-green'];
          countdownData.value = 'Go!';

          clearInterval(countdownData.interval);
          countdownData.interval = null;

          cb();

          setTimeout(() => {
            countdownData.showDialog = false;
          }, 1000);
        }
      }, 1000);
    }, 300)
  }, 1000);

};

export default { startCountdown };
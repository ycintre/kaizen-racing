import config from './config';
import formatter from './formatter';

const moment = require('moment');

const computeLapsTimes = (player) => {
  const lapsTimes = [];
  for (let i = 0; i < config.race.lapCount; i++) {
    // Race haven't started yet
    if (!player.lapTimes.length) {
      lapsTimes[i] = '-';
    }

    // Completed lap
    if (i < player.lapTimes.length - 1) {
      lapsTimes[i] = formatter.formatTime(player.lapTimes[i + 1].diff(player.lapTimes[i]));
    }
    // Current Lap
    else if (i === player.lapTimes.length - 1) {
      lapsTimes[i] = formatter.formatTime(moment().diff(player.lapTimes[i]));
    }
    // Future lap
    else {
      lapsTimes[i] = '-'
    }

  }

  let totalTime;
  if (!player.lapTimes.length) {
    totalTime = '-';
  } else if (player.lapTimes.length > config.race.lapCount) {
    totalTime = formatter.formatTime(player.lapTimes[player.lapTimes.length - 1].diff(player.lapTimes[0]))
  } else {
    totalTime = formatter.formatTime(moment().diff(player.lapTimes[0]));
  }

  return {
    lapsTimes,
    totalTime
  }
};

export default { computeLapsTimes };
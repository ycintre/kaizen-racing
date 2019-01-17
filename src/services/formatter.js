const moment = require('moment');

const formatTime = (duration) => {
  // TODO remove minutes if none?
  return moment.utc(moment.duration(duration).as('milliseconds')).format('mm:ss.SSS');
};

export default { formatTime };
import config from './config';

const SerialPort = require('serialport');

const watchLap = (cb) => {
  const port = new SerialPort(config.hardware.serialPort, { autoOpen: false, baudRate: config.hardware.baudRate });

  port.open(function (err) {
    if (err) {
      return console.error('Error opening port: ', err.message)
    }
    console.info('Port successfully opened');
  });

  port.on('data', (rawData) => {
    console.log(`Data received: >>>${rawData}<<<`);
    rawData
      .toString()
      .replace(/\s/g, '')
      .split('')
      .forEach((data) => {
        console.log(`Sending lap signal for player ${data}`);
        cb(data);
      });
  });
};

export default { watchLap };
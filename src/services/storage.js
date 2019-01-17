import config from './config';

const fs = require('fs');
const moment = require('moment');
const remote = require('electron').remote;

const autoSaveResults = (results) => {
  fs.writeFileSync(`${config.storage.autoSaveFilePath}/data-${moment().format()}.json`,
    JSON.stringify(results, null, 2),
    { flag: 'w' }
  );
};

const loadResults = (cb) => {
  remote.dialog.showOpenDialog({
    filters: [
      { name: 'json', extensions: ['json'] },
      { name: 'All Files', extensions: ['*'] }
    ]
  }, (fileNames) => {
    if (!fileNames) {
      console.log('No file selected');
      return;
    }

    fs.readFile(fileNames[0], 'utf-8', (err, data) => {
      if (err) {
        console.error(`An error occurred reading the file: ${err.message}`);
        return;
      }

      cb(JSON.parse(data));
    });
  });
};

export default { autoSaveResults, loadResults };
const config = {
  hardware: {
    serialPort: '/dev/ttyACM0',
    baudRate: 115200,
  },
  leaderBoard: {
    resultCount: 3
  },
  liveRace: {
    refreshInterval: 53
  },
  race: {
    lapDebounce: 500,
    lapCount: 3,
  },
  storage: {
    autoSaveFilePath: '/home/yohann/kaizen-racing/'
  }
};

export default config;
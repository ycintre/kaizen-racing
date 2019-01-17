<template>
  <div>

    <div class="container">
      <md-card v-for="(player, index) in sortedPlayers">
        <md-card-header>

          <md-avatar>
            <div class="rank">
              <p v-if="index === 0">🥇</p>
              <p v-if="index === 1">🥈</p>
              <p v-if="index === 2">🥉</p>
              <p v-if="index >= 3">{{index + 1}}</p>
            </div>
          </md-avatar>
          <md-card-header-text>
            <div class="md-title">{{player.name}}</div>
            <div class="md-subhead">{{player.time}}</div>
          </md-card-header-text>
        </md-card-header>

        <div v-if="index === 0" class="cup-logo">
          <img src="../assets/cup.png"/>
        </div>
      </md-card>
    </div>

    <div class="container">

      <div>
        <div>Player 1</div>
        <input v-model="player1.name" placeholder="Player 1">
        <!--<div><span>Lap 1</span><span>{{formatTime(player1.lapTimes[0].diff(raceStartTime))}}</span></div>-->
        <!--<div><span>Lap 2</span><span>{{formatTime(player1.lapTimes[1].diff(raceStartTime))}}</span></div>-->
        <!--<div><span>Lap 3</span><span>{{formatTime(player1.lapTimes[2].diff(raceStartTime))}}</span></div>-->
        <div><span>Race</span><span>{{player1.totalTime}}</span></div>
        <br/>
        <button v-on:click="triggerLap(player1)">Fake lap!</button>
        <button v-on:click="saveResult(player1)">Save results</button>
        <button v-on:click="resetGame(player1)">Reset</button>
      </div>

      <div>
        <div>Player 2</div>
        <input v-model="player2.name" placeholder="Player 2">
        <!--<div><span>Lap 1</span><span>{{formatTime(player2.lapTimes[0].diff(raceStartTime))}}</span></div>-->
        <!--<div><span>Lap 2</span><span>{{formatTime(player2.lapTimes[1].diff(raceStartTime))}}</span></div>-->
        <!--<div><span>Lap 3</span><span>{{formatTime(player2.lapTimes[2].diff(raceStartTime))}}</span></div>-->
        <div><span>Race</span><span>{{player2.totalTime}}</span></div>
        <br/>
        <button v-on:click="triggerLap(player2)">Fake lap!</button>
        <button v-on:click="saveResult(player2)">Save results</button>
        <button v-on:click="resetGame(player2)">Reset</button>

      </div>

      <button v-on:click="startRace()">Start race!</button>
    </div>

  </div>
</template>

<script>
  const SerialPort = require('serialport');
  const moment = require('moment');

  const SERIAL_PORT = '/dev/ttyACM0';
  const BAUD_RATE = 115200;
  const DEBOUNCE = 1000;
  const RACE_LAP_COUNT = 3;

  export default {
    name: 'Leaderboard',
    data: function () {
      return {
        leaderboard: [],
        raceStartTime: null,
        player1: {
          id: '1',
          name: 'Player 1',
          lapTimes: [],
          totalTime: null,
          lastTrip: moment()
        },
        player2: {
          id: '2',
          name: 'Player 2',
          lapTimes: [],
          totalTime: null,
          lastTrip: moment()
        }
      }
    },

    computed: {
      sortedPlayers: function () {
        return this.leaderboard.slice(0, 3);
      }
    },

    methods: {
      startRace: function () {
        // TODO countdown visual + audio!
        this.raceStartTime = moment();
      },
      triggerLap: function (player) {

        if (moment().diff(player.lastTrip) < DEBOUNCE) {
          return console.log(`Input for player ${player.id} debounced`)
        }

        player.lastTrip = moment();

        if (player.lapTimes.length < RACE_LAP_COUNT - 1) {
          player.lapTimes.push(moment());
          console.log(`⏱  ${player.id} finished lap ${player.lapTimes.length} in ${player.lapTimes[player.lapTimes.length - 1].diff(this.raceStartTime)}`);
        } else if (player.lapTimes.length === RACE_LAP_COUNT - 1) {
          player.lapTimes.push(moment());
          console.log(`🏁 ${player.id} finished the race in ${player.lapTimes[player.lapTimes.length - 1].diff(this.raceStartTime)}`);
        } else {
          console.log(`🏆 ${player.id} race is already over! (finished in ${player.lapTimes[player.lapTimes.length - 1].diff(this.raceStartTime)})`);
        }
      },
      saveResult: function (player) {
        // TODO write to disk
        this.leaderboard.push({
          name: player.name,
          time: player.lapTimes[player.lapTimes.length - 1].diff(this.raceStartTime)
        });
      },
      resetGame: function (player) {
        player.lapTimes = [];
        console.log(`❎ Player ${player.id} have been reset`);
      },
      formatTime: function (duration) {
        return moment.utc(duration.as('milliseconds')).format('mm:ss.SSS');
      }
    },

    created: function () {
      // Force refresh ui
      // this.interval = setInterval(() => {
      //   this.player1.totalTime = this.player1.lapTimes[0] ? process.hrtime(this.player1.lapTimes[0]) : null;
      //   this.player2.totalTime = this.player2.lapTimes[0] ? process.hrtime(this.player2.lapTimes[0]) : null;
      // }, 100);

      const port = new SerialPort(SERIAL_PORT, { autoOpen: false, baudRate: BAUD_RATE });

      port.open(function (err) {
        if (err) {
          return console.error('Error opening port: ', err.message)
        }

        console.info('Port successfully opened');
      });

      port.on('data', (rawData) => {
        console.log(`Data received: ${rawData}`);

        const playerNumber = data.toString().trim();

        if (playerNumber === '1') {
          this.triggerLap(this.player1);
        } else if (data.toString().trim() === '2') {
          this.triggerLap(this.player2);
        }

      });
    }
  }
</script>

<style scoped>

  .container {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    align-content: center;
  }

  /* Card */
  .md-card-header-text {
    text-align: right;
  }

  .md-card {
    width: 30%;
    margin: 20px;
    overflow: hidden;
  }

  .md-card:first-child {
    width: 80%;
  }

  .md-card:nth-child(2), .md-card:nth-child(3) {
    width: 40%;
  }

  /* Text */
  .md-card .md-title, .md-card .md-subhead {
    font-size: 2em;
    line-height: 40px;
  }

  .md-card:first-child .md-title, .md-card:first-child .md-subhead {
    font-size: 5em;
    line-height: 70px;
  }

  .md-card:nth-child(2) .md-title,
  .md-card:nth-child(2) .md-subhead,
  .md-card:nth-child(3) .md-title,
  .md-card:nth-child(3) .md-subhead {
    font-size: 3em;
    line-height: 50px;
  }

  /* Ranking */

  .md-avatar {
    background: #fafafa;
    color: black;
    font-size: 2.5em;
    width: 50px;
    height: 50px;
  }

  .md-card:first-child .md-avatar {
    background: none;
    font-size: 7em;
    width: 120px;
    height: 120px;
  }

  .md-card:nth-child(2) .md-avatar,
  .md-card:nth-child(3) .md-avatar {
    background: none;
    font-size: 5em;
    width: 100px;
    height: 100px;
  }

  .cup-logo {
    width: 220px;
    position: absolute;
    left: 200px;
    top: 5px;
    transform: rotate(-15deg);
    z-index: 0;
    overflow: hidden;
    opacity: .50;
    background-color: rgba(0, 0, 0, .26);
    border-radius: 50%;
  }
</style>

<template>
  <div>

    <div class="container">
      <md-card v-for="(currentPlayer, index) in sortedPlayers">
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
            <div class="md-title">{{currentPlayer.name}}</div>
            <div class="md-subhead">{{currentPlayer.displayTime}}</div>
          </md-card-header-text>
        </md-card-header>

        <div class="cup-logo" v-if="index === 0">
          <img src="../assets/cup.png"/>
        </div>
      </md-card>
    </div>

    <div class="container">
      <LiveTimer v-bind:player="player2" v-on:lapSelected="fillBestLap"></LiveTimer>
      <LiveTimer v-bind:player="player1" v-on:lapSelected="fillBestLap"></LiveTimer>
    </div>

    <div class="container">
      <md-button class="md-raised action-button md-accent" v-on:click="triggerLap('1')" v-if="debug">
        Manual lap (P1)
      </md-button>
      <md-button class="md-raised action-button" v-on:click="openSavePopup(player2)"
                 :disabled="player2.lapTimes.length !== config.race.lapCount +1">Save Blue time
      </md-button>
      <md-button class="md-raised action-button" v-on:click="startCountdown()">🏁 Start new race</md-button>
      <md-button class="md-raised action-button" v-on:click="openSavePopup(player1)"
                 :disabled="player1.lapTimes.length !== config.race.lapCount +1">Save Yellow time
      </md-button>
      <md-button class="md-raised action-button md-accent" v-on:click="triggerLap('2')" v-if="debug">
        Manual lap (P2)
      </md-button>
    </div>

    <BestLap v-bind:active:="bestLap.active" v-bind:time="bestLap.time"></BestLap>

    <Countdown v-bind:countdown="countdown"></Countdown>
    <SavePopup v-bind:savePopupData="savePopup" v-on:confirm="saveResult($event)"></SavePopup>

    <Menu v-on:results-loaded="leaderboard = $event" v-on:toggle-debug="debug = !debug"></Menu>
    <Firework v-if="firework"></Firework>
  </div>
</template>

<script>
  import config from '../../services/config';
  import countdown from '../../services/countdown';
  import formatter from '../../services/formatter';
  import hardware from '../../services/hardware';
  import liveTimer from '../../services/live-timer';
  import storage from '../../services/storage';
  import BestLap from './BestLap';
  import Countdown from './Countdown';
  import Firework from './Firework';
  import LiveTimer from './LiveTimer';
  import Menu from './Menu';
  import SavePopup from './SavePopup';

  const moment = require('moment');

  export default {
    name: 'Leaderboard',
    components: { Firework, BestLap, SavePopup, Countdown, Menu, LiveTimer },
    data: function () {
      return {
        leaderboard: [],
        countdown: {
          showDialog: false,
          value: null,
          interval: null,
          lights: ['', '', '']
        },
        player1: {
          id: '1',
          name: 'Player 1',
          lapTimes: [],
          displayLapsTimes: [],
          totalTime: null,
          winner: false,
          delta: null,
          color: 'Yellow',
          fontColor: ''
        },
        player2: {
          id: '2',
          name: 'Player 2',
          lapTimes: [],
          displayLapsTimes: [],
          totalTime: null,
          winner: false,
          delta: null,
          color: 'Blue',
          fontcolor: ''
        },
        savePopup: {
          active: false,
          playerId: null,
          time: null,
          displayTime: null
        },
        bestLap: {
          active: false,
          time: '99:99.999'
        },
        config,
        debug: true,
        firework: false
      }
    },

    computed: {
      sortedPlayers: function () {
        return this.leaderboard
          .sort((a, b) => a.time - b.time)
          .slice(0, config.leaderBoard.resultCount);
      }
    },

    methods: {

      initUIRefresh: function () {
        setInterval(() => {
          const player1Results = liveTimer.computeLapsTimes(this.player1);
          this.player1.displayLapsTimes = player1Results.lapsTimes;
          this.player1.totalTime = player1Results.totalTime;

          const player2Results = liveTimer.computeLapsTimes(this.player2);
          this.player2.displayLapsTimes = player2Results.lapsTimes;
          this.player2.totalTime = player2Results.totalTime;
        }, config.liveRace.refreshInterval);
      },

      initSerialReading: function () {
        hardware.watchLap(this.triggerLap);
      },

      startCountdown: function () {
        this.resetGame(this.player1);
        this.resetGame(this.player2);
        countdown.startCountdown(this.countdown, this.startRace);
      },

      startRace: function () {
        const startTime = moment();
        this.player1.lapTimes.push(startTime);
        this.player2.lapTimes.push(startTime);
      },

      triggerLap: function (playerNumber) {

        let currentPlayer;
        let otherPlayer;
        switch (playerNumber) {
          case '1':
            currentPlayer = this.player1;
            otherPlayer = this.player2;
            break;
          case '2':
            currentPlayer = this.player2;
            otherPlayer = this.player1;
            break;
          default:
            console.error(`Unexpected player number received: ${playerNumber}, input ignored`);
            return;
        }

        const triggerTime = moment();
        const lastLapTime = currentPlayer.lapTimes[currentPlayer.lapTimes.length - 1];
        const lastLapDuration = triggerTime.diff(lastLapTime);
        const raceDuration = triggerTime.diff(currentPlayer.lapTimes[0]);

        if (lastLapDuration < config.race.lapDebounce) {
          return console.log(`Input for Player ${currentPlayer.id} debounced (too fast: ${lastLapDuration}ms`)
        }

        if (currentPlayer.lapTimes.length < config.race.lapCount) {
          currentPlayer.lapTimes.push(triggerTime);
          console.log(`⏱  Player ${currentPlayer.id} finished lap ${currentPlayer.lapTimes.length - 1} in ${lastLapDuration}`);
        } else if (currentPlayer.lapTimes.length === config.race.lapCount) {
          currentPlayer.lapTimes.push(triggerTime);
          console.log(`🏁 Player ${currentPlayer.id} finished the race in ${raceDuration}`);
          if (!otherPlayer.winner) {
            currentPlayer.winner = true;
            console.log(`🏆 Player ${currentPlayer.id} won the race`);

            if(this.leaderboard[0] && raceDuration < this.leaderboard[0].time) {
              this.firework = true;
            }

          } else {
            currentPlayer.delta = formatter.formatTime(currentPlayer.lapTimes[currentPlayer.lapTimes.length - 1].diff(otherPlayer.lapTimes[otherPlayer.lapTimes.length - 1]));
          }

        } else {
          console.log(`🏆 Player ${currentPlayer.id} race is already over, lap ignored`);
        }
      },

      resetGame: function (player) {
        this.firework = false;

        player.lapTimes = [];
        player.displayLapsTimes = [];
        player.totalTime = null;
        player.winner = false;
        player.delta = null;
        console.log(`❎ Player ${player.id} have been reset`);
      },

      openSavePopup: function (player) {
        this.savePopup = {
          active: true,
          playerId: player.id,
          screenName: '',
          time: player.lapTimes[player.lapTimes.length - 1].diff(player.lapTimes[0]),
          displayTime: formatter.formatTime(player.lapTimes[player.lapTimes.length - 1].diff(player.lapTimes[0]))
        }
      },

      saveResult: function (player) {
        this.savePopup = {
          active: false,
          playerId: null,
          time: null,
          displayTime: null
        };

        this.leaderboard.push({
          name: player.screenName,
          time: player.time,
          displayTime: player.displayTime
        });
        storage.autoSaveResults(this.leaderboard);
      },

      fillBestLap: function (time) {
        this.bestLap.time = time;
      }
    },

    created: function () {
      this.initUIRefresh();
      this.initSerialReading();
    }
  }
</script>

<style scoped>

  .container {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    align-content: center;
    margin-bottom: 15px;
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
    width: 65%;
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

  .action-button {
    font-size: 2em;
    line-height: 2em;
    height: 70px;
    border-radius: 10px;
  }

</style>

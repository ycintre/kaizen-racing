<template>

  <div class="container">
    <md-card class="player-name-card">
      <md-card-content>
        <span class="player-name">Player {{player.id}}</span>
        <div class="player-winner" v-if="player.winner">🏆</div>
      </md-card-content>
    </md-card>

    <md-card v-for="i in config.race.lapCount">
      <div class="lap-time" @click="$emit('lapSelected', player.displayLapsTimes[i-1])">
        {{player.displayLapsTimes[i-1]}}
      </div>
      <div class="lap-number md-elevation-4">Lap {{i}}</div>
    </md-card>

    <md-card>
      <div class="lap-time">
        <strong>{{player.totalTime}}</strong>
        <div class="lap-delta" v-if="player.delta"><em>+ {{player.delta}}</em></div>
      </div>
      <div class="lap-number md-elevation-4"><strong>Race</strong></div>
    </md-card>

  </div>

</template>

<script>
  import config from '../../services/config';

  export default {
    name: 'LiveTimer',
    props: ['player'],
    data: function () {
      return {
        config,
      }
    }
  }
</script>

<style scoped>

  .container {
    width: 50%;
    margin-top: 20px;
    opacity: 50%;
  }

  .md-card {
    width: 70%;
    height: 60px;
    margin: 10px;
    border-radius: 50px;
  }

  .player-name-card {
    font-size: 2em;
    border-radius: 50px;
    text-align: center;
    width: 50%;
  }

  .player-name {
    font-size: 2.5em;
  }

  .player-winner {
    position: relative;
    left: 120px;
    top: -35px;
    font-size: 5em;
    transform: rotate(18deg)
  }

  .lap-number, .lap-time {
    font-size: 2em;
    padding: 20px;
  }

  .lap-number {
    height: 100%;
    width: 30%;
    background: grey;
    border-radius: 50px;
    color: #1c1f21;
  }

  .lap-time {
    float: right;
  }

  .lap-time:hover {
    cursor: pointer;
    opacity: .5;
  }

  .lap-delta {
    text-align: right;
    font-size: 0.6em;
    opacity: 0.54
  }


</style>
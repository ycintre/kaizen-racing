<template>
  <md-dialog :md-active.sync="countdown.showDialog" class="countdown-dialog"
             :md-close-on-esc="false" :md-click-outside-to-close="false">
    <div class="countdown-lights">
      <md-avatar class="md-avatar-icon countdown-light" v-bind:class="countdown.lights[0]"></md-avatar>
      <md-avatar class="md-avatar-icon countdown-light" v-bind:class="countdown.lights[1]"></md-avatar>
      <md-avatar class="md-avatar-icon countdown-light" v-bind:class="countdown.lights[2]"></md-avatar>
    </div>
    <span class="md-display-4 countdown-value"><strong>{{countdown.value}}</strong></span>
  </md-dialog>
</template>

<script>
  export default {
    name: 'Countdown',
    props: ['countdown']
  }
</script>

<style scoped>
  .countdown-dialog {
    width: 70%;
    height: 50%;
    border-radius: 100px;
  }

  .countdown-lights {
    margin: 40px auto 10px;
  }

  .countdown-light {
    transition: none;
    min-width: 128px;
    min-height: 128px;
    border-radius: 128px;
    font-size: 64px;
    margin-left: 15px;
    margin-right: 15px;
  }

  .countdown-green {
    background-color: #4caf50 !important;;
  }

  .countdown-red {
    background-color: #F44336 !important;
  }

  .countdown-value {
    height: 100%;
    width: 100%;
    padding-top: 40px;
    font-size: 15em;
    line-height: normal;
    text-align: center;
  }
</style>
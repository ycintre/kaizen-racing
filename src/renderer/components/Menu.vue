<template>
  <md-speed-dial class="md-bottom-right">
    <md-speed-dial-target style="background: rgb(66, 66, 66)">
      <md-icon>settings</md-icon>
    </md-speed-dial-target>

    <md-speed-dial-content>

      <md-button class="md-icon-button" v-on:click="toggleDebug()">
        <md-icon>bug_report</md-icon>
        <md-tooltip md-direction="left">Toggle debug mode</md-tooltip>
      </md-button>

      <md-button class="md-icon-button" v-on:click="loadResults()">
        <md-icon>folder_open</md-icon>
        <md-tooltip md-direction="left">Load results</md-tooltip>
      </md-button>

      <md-button class="md-icon-button" v-on:click="toggleAudio()">
        <md-icon v-if="audioEnabled">volume_off</md-icon>
        <md-tooltip v-if="audioEnabled" md-direction="left">Mute sound effects</md-tooltip>
        <md-icon v-if="!audioEnabled">volume_up</md-icon>
        <md-tooltip v-if="!audioEnabled" md-direction="left">Enable sound effects</md-tooltip>
      </md-button>

    </md-speed-dial-content>
  </md-speed-dial>

</template>

<script>
  import audio from '../../services/audio';
  import storage from '../../services/storage';

  export default {
    name: 'Menu',
    data: function () {
      return {
        audioEnabled: audio.getAudioEnabled(),
        storage
      }
    },
    methods: {
      toggleDebug: function () {
        this.$emit('toggle-debug');
      },
      toggleAudio: function () {
        audio.setAudioEnabled(!audio.getAudioEnabled());
        this.audioEnabled = audio.getAudioEnabled();
      },

      loadResults: function () {
        storage.loadResults((results) => {
          this.$emit('results-loaded', results);
        });
      }
    }
  }
</script>

<style scoped>

</style>
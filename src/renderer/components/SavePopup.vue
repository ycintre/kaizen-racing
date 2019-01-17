<template>
  <md-dialog-prompt
    :md-active.sync="savePopupData.active"
    v-model="savePopupData.screenName"
    v-bind:md-title="title"
    md-input-maxlength="30"
    md-input-placeholder="Player name"
    md-confirm-text="Done"
    @md-confirm="confirm"
  />
</template>

<script>
  export default {
    name: 'SavePopup',
    props: ['savePopupData'],
    computed: {
      title: function () {
        return `Enter Player ${this.savePopupData.playerId} name`;
      }
    },
    methods: {
      confirm: function () {
        this.$emit('confirm', {
          screenName: this.savePopupData.screenName,
          time: this.savePopupData.time,
          displayTime: this.savePopupData.displayTime
        });

        this.screenName = '';
      },
    }
  }
</script>

<style scoped>
  .md-dialog {
    zoom: 2
  }
</style>
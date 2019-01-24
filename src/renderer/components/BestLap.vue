<template>
  <div>
    <div class="corner-ribbon top-left sticky red shadow" v-on:click="active = true">
      ⏱ Best lap
      <br/><strong>{{time}}</strong>
    </div>

    <md-dialog-prompt
      :md-active.sync="active"
      v-model="time"
      md-title="Best lap"
      md-confirm-text="Done"
    />
  </div>
</template>

<script>
  export default {
    name: 'BestLap',
    props: ['active', 'time'],
    data: function () {
      return {
        // time: '00:01.234',
        // active: false
      }
    }
  }
</script>

<style scoped>
  .md-dialog {
    zoom: 2
  }

  .corner-ribbon {
    font-size: 3em;
    width: 550px;
    position: absolute;
    top: 56px;
    left: -156px;
    text-align: center;
    line-height: 54px;
    letter-spacing: 1px;
    transform: rotate(-45deg);
    -webkit-transform: rotate(-45deg);
    z-index: 90;

    background: grey;
    color: #1c1f21;
  }

  .corner-ribbon:hover {
    cursor: pointer;
  }

  .corner-ribbon.shadow {
    box-shadow: 0 0 3px rgba(0, 0, 0, .3);
  }

</style>
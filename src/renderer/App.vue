<template>
  <div class="page-container">
    <md-app>
      <!--<md-app-toolbar class="md-transparent">-->
        <!--<h3 class="md-title" style="flex: 1">🏁 Kaizen Racing</h3>-->
      <!--</md-app-toolbar>-->
      <md-app-content>
        <router-view></router-view>
      </md-app-content>
    </md-app>
  </div>
</template>

<script>
  export default {
    name: 'my-project2'
  }
</script>

<style>
  body {
    background: url(assets/carbon.jpg) !important;
  }

  .md-app, .md-content {
    background: transparent !important;
    zoom: 1;
  }
</style>

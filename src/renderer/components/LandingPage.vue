<template>
  <div class="page-container">
    <md-app>
      <md-app-toolbar class="md-transparent">
        <h3 class="md-title" style="flex: 1">🏁 Snowcamp Leaderboard</h3>
        <md-menu md-direction="bottom-start">
          <md-button md-menu-trigger class="md-icon-button">
            <md-icon>more_vert</md-icon>
          </md-button>
          <md-menu-content>
            <md-menu-item
              href="https://docs.google.com/forms/d/e/1FAIpQLSfpNJ44Hj-TGh0ZIcZJVfg7DYL-L2nVhN_PBiKy6DJIe-899Q/viewform">
              <md-icon>timer</md-icon>
              Input form
            </md-menu-item>
            <md-menu-item href="https://docs.google.com/spreadsheets/d/11QdbChBFjKQfhg4ra3UZUBbd0qVDSu5gqbTliclha1s">
              <md-icon>format_list_numbered</md-icon>
              Results
            </md-menu-item>
          </md-menu-content>
        </md-menu>

      </md-app-toolbar>
      <md-app-content>
        <Leaderboard/>
      </md-app-content>
    </md-app>
  </div>

</template>

<script>
  import Leaderboard from '/component/Leaderboard.vue'


  export default {
    name: 'app',
    components: {
      Leaderboard
    }
  }
</script>

<style>
  body {
    background: url(../assets/carbon.jpg) !important;
  }

  .md-app, .md-content {
    background: transparent !important;
  }
</style>

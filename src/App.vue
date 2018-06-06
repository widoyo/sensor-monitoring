<template>
  <div id="app" class="ui container">
    <router-view/>
  </div>
</template>

<script>
import 'semantic-ui-css/semantic.css'
export default {
  name: 'App',
  created () {
    window.document.title = 'Prinus Sensor Monitoring'
  }
}
</script>

<style>
</style>

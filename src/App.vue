<template>
  <SpineWorld />
</template>

<script>
import SpineWorld from './Spine.vue'

export default {
  name: 'App',
  components: {
    SpineWorld, // Register the component
  },
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  margin: 0px
}

body {
  margin: 0px;
}
</style>

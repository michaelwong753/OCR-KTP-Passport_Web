<template>
  <div id="app">
  <FrontEnd msg='Hello'></FrontEnd>
  </div>
</template>

<script>
import  FrontEnd from './components/FrontEnd'
export default {
  name: 'App',
  components: {
   FrontEnd
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>

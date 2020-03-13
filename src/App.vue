<template>
  <div id="app">
    <keep-alive>
      <component :is="name"></component>
    </keep-alive>
    <div @click="switchViews">
      switchViews
    </div>
  </div>
</template>

<script>
import Home from '@/views/Home.vue'
import About from '@/views/About.vue'

export default {
  name: 'App',
  components: {
    Home,
    About
  },
  data () {
    return {
      name: 'Home'
    }
  },
  mounted () {

  },
  methods: {
    switchViews () {
      this.name = this.name === 'Home' ? 'About' : 'Home'
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>

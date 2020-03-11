<template>
  <div id="app">
    <div class="home">
      <bubble :options="options" ref="bubble">
        <bubble-item v-for="(item, index) in list" :key="index">
          <div>
            {{item.accessPlace}}
            <br>
            {{item.accessTime}}
          </div>
        </bubble-item>
      </bubble>
      <div style="margin-top:30px;">
        <button @click="long">long</button>
        <button @click="short">short</button>
        <button @click="clear">clear</button>
        <button @click="switchViews">switch</button>
      </div>
    </div>
  </div>
</template>

<script>
import Bubble from '@/components/bubble.vue'
import BubbleItem from '@/components/bubble-item.vue'

export default {
  name: 'App',
  components: {
    Bubble,
    BubbleItem
  },
  data () {
    return {
      options: {
        viewNumber: 5,
        perNumber: 3,
        opacity: true,
        fire: {
          delay: 1000,
          speed: 0.5
        },
        switchOpt: {
          interval: 8000
        },
        startPosition: 'leftBottom',
        move: {
          speed: 0.15
        }
      },
      list: []
    }
  },
  mounted () {
    setTimeout(() => {
      this.long();
      let index = 0;
      setInterval(() => {
        if (index % 2 === 0) {
          this.long();
        } else {
          this.short();
        }
        index++;
      }, 15000)
    }, 2000)
  },
  methods: {
    long () {
      this.list = new Array(12).fill({ accessPlace: '中央', accessTime: '2021-06' });
    },
    short () {
      this.list = new Array(3).fill({ accessPlace: '北京', accessTime: '1989.01' });
    },
    clear () {
      this.list = []
    },
    switchViews () {
      this.$refs.bubble.switchViews()
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
.home {
  width: 500px;
  height: 300px;
  margin: 0 auto;
  background-color: #000d50;
}
.bubble-item {
  color: #fff;
}
</style>

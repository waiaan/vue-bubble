<template>
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
</template>

<script>
import Bubble from '@/components/bubble.vue'
import BubbleItem from '@/components/bubble-item.vue'
// import { Bubble, BubbleItem } from 'vue-text-bubble'

export default {
  name: 'Home',
  components: {
    Bubble,
    BubbleItem
  },
  data () {
    return {
      options: {
        // perspective: 600,
        viewNumber: 5,
        perNumber: 3,
        opacity: true,
        fire: {
          delay: 1500,
          speed: 0.7
        },
        switchOpt: {
          interval: 15000
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
    // setTimeout(() => {
    //   this.long();
    //   let index = 0;
    //   setInterval(() => {
    //     if (index % 2 === 0) {
    //       this.long();
    //     } else {
    //       this.short();
    //     }
    //     index++;
    //   }, 15000)
    // }, 2000)
    this.fetchData()
    setInterval(() => {
      this.fetchData()
    }, 2000)
  },
  methods: {
    fetchData () {
      window.fetch('http://172.18.150.234:10012/queryCheckAccess').then((res) => {
        return res.json();
      }).then((res) => {
        this.list = [].concat(res.data)
      })
    },
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
.home {
  width: 500px;
  height: 400px;
  margin: 0 auto;
  background-color: #000d50;
  font-size: 2rem;
}

.bubble-item {
  color: #fff;
}
</style>

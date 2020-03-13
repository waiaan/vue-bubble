<template>
  <div class="bubble-container">
    <slot></slot>
  </div>
</template>
<script>
import { odds, sleep, isCollapsed } from '@/utils.js'

export default {
  name: 'Bubble',
  props: {
    options: {
      type: Object,
      required: true
    }
  },
  data () {
    const {
      viewNumber = 5,
      perNumber = 3,
      opacity = false,
      fire = {
        speed: 1,
        delay: 600
      },
      startPosition = 'bottom',
      switchOpt = {
        interval: 300
      },
      move = {
        speed: 0.2
      }
    } = this.options;
    const maxSwitchTime = viewNumber * fire.delay;
    if (switchOpt.interval < maxSwitchTime) {
      console.error('switch.interval less than viewNumber*fire.delay')
      switchOpt.interval = viewNumber * fire.delay
    }
    return {
      items: [],
      viewNumber,
      perNumber,
      startPosition,
      opacity,
      fire: {
        ...fire,
        lastXd: 1,
        lastYd: 1,
        count: 0
      },
      move: {
        ...move,
        startIndex: 0,
        count: 0
      },
      switch: {
        ...switchOpt,
        stop: false
      },
      hide: {
        speed: 1,
        count: 0
      },
      timer: {
        move: null,
        switch: null
      }
    }
  },
  mounted () {
    this.moveItems()
    this.startSwitch()
  },
  // watch: {
  //   'move.count': {
  //     handler (val) {
  //       console.log(val);
  //     },
  //     deep: true
  //   }
  // },
  methods: {
    updateItems () {
      const items = [];
      let moveStartIndex = this.items.length + 1;
      for (let i = 0; i < this.$children.length; i++) {
        const child = this.$children[i]
        if (child.$options.name === 'BubbleItem') {
          items.push(child);
        }
        if (child.isMoving && i < moveStartIndex) {
          moveStartIndex = i
        }
      }
      if (moveStartIndex > this.items.length) {
        moveStartIndex = 0;
      }
      this.move.startIndex = moveStartIndex
      this.items = [].concat(items);
      const mayMoveCount = this.move.count + this.fire.count;
      if (mayMoveCount < this.viewNumber && this.items.length > mayMoveCount) {
        this.switchItems('fire', this.move.startIndex + mayMoveCount, Math.min(this.viewNumber - mayMoveCount, this.items.length - mayMoveCount))
      }
    },
    async switchItems (type, startIndex, count) {
      if (this[type].count > 0) {
        return;
      }
      this[type].count = count
      for (let i = 0; i < count; i++) {
        const item = this.items[startIndex + i];
        item && !item.isFiring && !item.isHiding && item[type]();
        if (this.items.length < count || this.switch.stop) {
          break;
        }
        await sleep(this.fire.delay);
      }
      this[type].count = 0
    },
    moveItems () {
      if (this.timer.move !== null) {
        return;
      }
      this.timer.move = setInterval(() => {
        for (let i = 0; i < this.items.length; i++) {
          const child = this.items[i]
          if (child.isMoving) {
            this.handleDirection(child)
            child.move()
          }
        }
      }, 10)
    },
    switchViews () {
      const { count: moveCount, startIndex: moveStartIndex } = this.move;
      if (moveCount === this.items.length && this.items.length <= this.viewNumber) {
        return;
      }
      const { count, fireStartIndex } = this.getSwitchCount();
      this.switchItems('fire', fireStartIndex, count);
      if (moveCount > 0 && moveCount >= this.viewNumber) {
        this.switchItems('hide', moveStartIndex, count)
      }
      if (fireStartIndex === 0) {
        this.move.startIndex = 0
      } else if (moveCount < this.viewNumber && this.items.length >= this.viewNumber) {

      } else {
        this.move.startIndex += count;
      }
    },
    getSwitchCount () {
      const length = this.items.length;
      if (length < 1) {
        return {
          count: 0,
          fireStartIndex: 0
        }
      }
      const { count: moveCount, startIndex: moveStartIndex } = this.move;
      if (moveCount === 0) {
        return {
          count: Math.min(this.viewNumber, this.items.length),
          fireStartIndex: 0
        }
      }
      let fireStartIndex = moveStartIndex + moveCount;
      if (moveCount < this.viewNumber && this.items.length >= this.viewNumber) {
        return {
          count: this.viewNumber - moveCount,
          fireStartIndex
        }
      }
      let count = this.perNumber;
      if ((moveCount + moveStartIndex) === length) {
        count = this.viewNumber;
        fireStartIndex = 0
      } else if ((moveStartIndex + moveCount + this.perNumber) > length) {
        count = length - moveStartIndex - moveCount;
      }
      return { count, fireStartIndex };
    },
    handleDirection (child) {
      let x = false;
      let y = false;
      if (child.translate.x < 0 || (child.translate.x + child.$el.offsetWidth) > this.$el.offsetWidth) {
        child.moveOpt.xd = child.translate.x < 0 ? 1 : -1;
        x = true;
      }
      if (child.translate.y < 0 || (child.translate.y + child.$el.offsetHeight) > this.$el.offsetHeight) {
        child.moveOpt.yd = child.translate.y < 0 ? 1 : -1;
        y = true;
      }
      for (let i = 0; i < this.items.length; i++) {
        const c = this.items[i];
        if (c !== child && isCollapsed(c.$el, child.$el) && c.moveOpt.xd === child.moveOpt.xd && c.moveOpt.yd === child.moveOpt.yd) {
          if (x && !y) {
            child.moveOpt.yd *= -1
          } else {
            child.moveOpt.xd *= -1
          }
        }
      }
      if (x && !y) {
        child.moveOpt.yd = odds() ? 1 : -1
      }
      if (y && !x) {
        child.moveOpt.xd = odds() ? 1 : -1
      }
    },
    startSwitch () {
      if (this.timer.switch !== null) {
        return;
      }
      this.timer.switch = setInterval(() => {
        this.switchViews()
      }, this.switch.interval)
    },
    clearTimer () {
      for (const t in this.timer) {
        if (this.timer[t] !== null) {
          clearInterval(this.timer[t]);
          this.timer[t] = null;
        }
      }
    }
  },
  beforeDestroy () {
    this.clearTimer();
    this.switch.stop = true;
  },
  deactivated () {
    this.switch.stop = true;
  },
  activated () {
    this.switch.stop = false;
  }
}
</script>
<style scoped>
.bubble-container {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}
</style>

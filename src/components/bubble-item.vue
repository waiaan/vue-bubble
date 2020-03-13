<template>
  <div class="bubble-item" :class="[isMoving?'bubble-item-move':'',isFiring?'bubble-item-fire':'',isHiding?'bubble-item-hide':'']" :style="{transform:`translate(${translate.x}px,${translate.y}px)`,opacity:opacity.value}">
    <slot></slot>
  </div>
</template>
<script>
import { odds } from '@/utils.js'

export default {
  name: 'BubbleItem',
  data () {
    return {
      translate: {
        x: 0,
        y: 0
      },
      opacity: {
        value: 1,
        od: -1,
        rate: 0.002
      },
      fireOpt: {
        xd: 1,
        yd: 1,
        speed: this.$parent.fire.speed
      },
      moveOpt: {
        xd: 1,
        yd: 1,
        speed: this.$parent.move.speed
      },
      hideOpt: {
        xd: 1,
        yd: 1,
        speed: this.$parent.hide.speed
      },
      isMoving: false,
      isFiring: false,
      isHiding: false,
      timer: {
        fire: null,
        hide: null
      }
    }
  },
  mounted () {
    this.initPosition()
    this.$parent.updateItems();
  },
  methods: {
    reset () {
      this.opacity.value = 1;
      this.opacity.od = -1;
      this.isMoving = false;
      this.isFiring = false;
      this.isHiding = false;
      this.initPosition();
    },
    initPosition () {
      if (this.$parent.startPosition === 'bottom') {
        this.translate.x = this.$parent.$el.offsetWidth / 2 - this.$el.offsetWidth / 2;
        this.translate.y = this.$parent.$el.offsetHeight;
      } else if (this.$parent.startPosition === 'leftBottom') {
        this.translate.x = -1 * this.$el.offsetWidth;
        this.translate.y = this.$parent.$el.offsetHeight;
      }
    },
    fire () {
      if (this.$parent.startPosition === 'bottom') {
        this.fireOpt.xd = 0;
        this.fireOpt.yd = -1;
      } else if (this.$parent.startPosition === 'leftBottom') {
        this.fireOpt.xd = 1;
        this.fireOpt.yd = -1;
      }
      this.isFiring = true;
      this.timer.fire = setInterval(() => {
        this.setTranslate('fire');
        if (this.translate.x >= (this.$parent.$el.offsetWidth / 2 - this.$el.offsetWidth / 2) || this.translate.y <= (this.$parent.$el.offsetHeight / 2 - this.$el.offsetHeight / 2)) {
          clearInterval(this.timer.fire);
          this.timer.fire = null;
          while (true) {
            const xd = odds() ? 1 : -1;
            const yd = odds() ? 1 : -1;
            if (xd !== this.$parent.fire.lastXd || yd !== this.$parent.fire.lastYd) {
              this.moveOpt.xd = xd;
              this.moveOpt.yd = yd;
              this.$parent.fire.lastXd = xd;
              this.$parent.fire.lastYd = yd;
              break;
            }
          }
          this.isFiring = false;
          this.isMoving = true;
          this.$parent.move.count++;
        }
      }, 10)
    },
    hide () {
      this.getHideDirection();
      this.isMoving = false;
      this.isHiding = true;
      this.$parent.move.count--;
      this.timer.hide = setInterval(() => {
        this.setTranslate('hide');
        if (this.translate.x < (-1 * this.$el.offsetWidth) || this.translate.y < (-1 * this.$el.offsetHeight) || this.translate.x > this.$parent.$el.offsetWidth || this.translate.y > this.$parent.$el.offsetHeight) {
          clearInterval(this.timer.hide);
          this.timer.hide = null;
          this.isHiding = false;
          this.reset();
        }
      }, 10)
    },
    move () {
      this.setTranslate('move');
      if (this.$parent.opacity) {
        let value = this.opacity.value + this.opacity.od * this.opacity.rate
        if (value > 1) {
          value = 1;
          this.opacity.od = -1;
        } else if (value < 0.5) {
          value = 0.5;
          this.opacity.od = 1;
        }
        this.opacity.value = value
      }
    },
    setTranslate (type) {
      const { xd, yd, speed } = this[type + 'Opt'];
      this.translate.x += xd * speed;
      this.translate.y += yd * speed;
    },
    getHideDirection () {
      const temp = {}
      const { x, y } = this.translate
      temp.left = x;
      temp.top = y;
      temp.right = this.$parent.$el.offsetWidth - x - this.$el.offsetWidth
      temp.bottom = this.$parent.$el.offsetHeight - y - this.$el.offsetHeight
      let min = Number.MAX_SAFE_INTEGER;
      let d = null;
      for (const k in temp) {
        if (temp[k] < min) {
          min = temp[k];
          d = k
        }
      }
      if (d === 'left') {
        this.hideOpt.xd = -1;
        this.hideOpt.yd = 0;
      } else if (d === 'right') {
        this.hideOpt.xd = 1;
        this.hideOpt.yd = 0;
      } else if (d === 'top') {
        this.hideOpt.xd = 0;
        this.hideOpt.yd = -1;
      } else if (d === 'bottom') {
        this.hideOpt.xd = 0;
        this.hideOpt.yd = 1;
      }
    },
    clearTimer () {
      for (const k in this.timer) {
        if (this.timer[k] !== null) {
          clearInterval(this.timer[k]);
          this.timer[k] = null;
        }
      }
    }
  },
  destroyed () {
    this.$parent.updateItems();
    this.clearTimer();
    this.isMoving && this.$parent.move.count--;
  }
}
</script>
<style scoped>
.bubble-item {
  position: absolute;
  top: 0;
  left: 0;
}
</style>

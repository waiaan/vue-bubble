import Vue from 'vue'
import Bubble from './bubble.vue';
import BubbleItem from './bubble-item.vue';

const VueBubble = {
  Bubble,
  BubbleItem
}

Vue.component(Bubble.name, Bubble);
Vue.component(BubbleItem.name, BubbleItem);

export default VueBubble;
export { Bubble, BubbleItem };

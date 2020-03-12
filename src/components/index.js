import Bubble from './bubble.vue';
import BubbleItem from './bubble-item.vue';

const VueBubble = {
  Bubble,
  BubbleItem
}

if (typeof window !== 'undefined' && window.Vue) {
  const Vue = window.Vue
  Vue.component(Bubble.name, Bubble);
  Vue.component(BubbleItem.name, BubbleItem);
}

export default VueBubble;
export { Bubble, BubbleItem };

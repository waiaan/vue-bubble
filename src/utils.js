export const sleep = (delay) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve()
    }, delay)
  })
}

export const odds = (rate = 0.5) => {
  return Math.random() > rate
}

export const isCollapsed = (el1, el2) => {
  var rect1 = el1.getBoundingClientRect();
  var rect2 = el2.getBoundingClientRect();
  var overlap = !(rect1.right < rect2.left || rect1.left > rect2.right || rect1.bottom < rect2.top || rect1.top > rect2.bottom);
  return overlap;
}

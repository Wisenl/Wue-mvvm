let cbs = []

function runCallbacks () {
  cbs.forEach(cb => cb())
}
// TODO 待优化
export function nextTick (cb) {
  cbs.push(cb)
  const timeFn =() => {
    runCallbacks()
  }

  if (Promise) {
    return Promise.resolve().then(timeFn)
  }
  if (MutationObserver) {
    const obs = new MutationObserver(timeFn)
    let textNode = document.createTextNode(1)
    obs.observe(textNode, {characterData: true})
    textNode.textContent = '2'
    return false
  }
  if (setImmediate) {
    setImmediate(timeFn)
    return false
  }
  setTimeout(timeFn, 0)
}


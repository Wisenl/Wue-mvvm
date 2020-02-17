import Observe from './observer'
import Watcher from './watcher'
import Dep from './dep'

// 将$data 代理到 wm 实例上
function proxy (wm, key, src) {
  Object.defineProperty(wm, key, {
    get() {
      return wm[src][key]
    },
    set(newVal) {
      wm[src][key] = newVal
    }
  })
}

export function initState (wm) {
  let data = typeof wm.$data === 'function' ? wm.$data() : wm.$data || {}

  // 将$data 代理到 wm 实例上
  for (let key in data) {
    proxy(wm, key, '$data')
  }
  // 对 data 进行监测
  new Observe(data)
}

function createComputed (wm, key) {
  console.log('1111111111')
  let watcher = wm._watchersComputed[key]
  console.log('watcher', watcher)
  return function () {
    console.log('call')
    if (watcher) {
      console.log('watcher', watcher)
      if (watcher.dirty) {
        watcher.evaluate()
      }
      if (Dep.target) {
        watcher.depend()
      }
      return watcher.value
    }
  }
}

export function initComputed (wm) {
  let watchers = wm._watchersComputed = Object.create(null) // 区别于 {} ，此对象没有 __proto__ 属性，不继承 Object 原型
  let userComputed = wm.$options.computed
  console.log(userComputed, '===')
  for (let key in userComputed) {
    watchers[key] = new Watcher(wm, userComputed[key], () => {}, {lazy: true})
    Object.defineProperty(wm, key, {
      get: createComputed(wm, key)
    })
  }
}

export function createWatcher (wm, key, cb, opts) {
  new Watcher(wm, key, cb, {user: true, ...opts})
}
export function initWatch (wm) {
  let watchObj = wm.$options.watch
  for (let key in watchObj) {
    let userDef = watchObj[key]
    let handler = userDef
    if (userDef.handler) {
      handler = userDef.handler
    }
    createWatcher(wm, key, handler, {immediate: userDef.immediate})
  }
  let watch = wm.$options.wm
}

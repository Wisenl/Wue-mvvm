import Observe from './observer'

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

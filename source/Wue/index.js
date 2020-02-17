import { initState, initComputed, initWatch, createWatcher, proxy } from './initWue'
import Watcher from './watcher/index'
import compiler from './compiler'
import { nextTick } from './watcher/nextTick'
// 创建一个 Wue 类
class Wue {
  constructor (wueOption) {
    this.$options = wueOption
    this.$data = wueOption.data
    this.$watch = this._watch
    this.$mount = this._mount
    this.$nextTick = nextTick
    // 初始化
    this._init()
  }
  _init() {
    let wm = this
    let data = typeof wm.$data === 'function' ? wm.$data().call(wm) : wm.$data || {}

    // 将$data 代理到 wm 实例上
    for (let key in data) {
      proxy(wm, key, '$data')
    }
    initState(wm)
    initComputed(wm)
    initWatch(wm)
    this.$mount(wm)
  }
  // 更新方法
  _update(wm) {
    // 编译
    compiler(wm)
  }
  _watch(key, cb) {
    return createWatcher(this, key, cb)
  }
  // 挂载方法
  _mount(wm) {
    if (typeof wm.$options.el === 'string') {
      wm.$el = window.document.querySelector(wm.$options.el)
    } else {
      wm.$el = wm.$options.el
    }
    // 用于首次渲染的 watcher，每个 Wue 实例都有唯一一个渲染 watcher
    new Watcher(this, () => {
      this._update(wm) // 创建对象时就需要 触发一次 _update
    })
  }
}

export default Wue

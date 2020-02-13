import { initState, initWatch, createWatcher } from './initWue'
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
    initState(this)
    initWatch(this)
    this.$mount()
  }
  // 更新方法
  _update() {
    // 编译
    compiler(this)
  }
  _watch(key, cb) {
    return createWatcher(this, key, cb)
  }
  // 挂载方法
  _mount() {
    if (typeof this.$options.el === 'string') {
      this.$el = window.document.querySelector(this.$options.el)
    } else {
      this.$el = this.$options.el
    }
    // 用于首次渲染的 watcher，每个 Wue 实例都有唯一一个渲染 watcher
    new Watcher(this, () => {
      this._update() // 创建对象时就需要 触发一次 _update
    })
  }
}

export default Wue

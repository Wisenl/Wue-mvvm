import { initState } from './initWue'
import Watcher from './watcher'
import compiler from './compiler'
// 创建一个 Wue 类
class Wue {
  constructor (wueOption) {
    this.$options = wueOption
    this.$data = wueOption.data
    this.$mount = this._mount
    // 初始化
    this._init()
  }
  _init() {
    initState(this)
    this.$mount()
  }
  // 更新方法
  _update() {
    console.log('__update__')
    // 编译
    compiler(this)
  }
  // 挂载方法
  _mount() {
    if (typeof this.$options.el === 'string') {
      this.$el = window.document.querySelector(this.$options.el)
    } else {
      this.$el = this.$options.el
    }
    // 用于首次渲染的 watcher
    new Watcher(this, () => {
      this._update() // 创建对象时就需要 触发一次 _update
    })
  }
}

export default Wue

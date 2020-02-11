import { initState } from './initWue'
import compiler from './compiler'
// 创建一个 Wue 类
class Wue {
  constructor (wueOption) {
    this.$options = wueOption
    this.$el = wueOption.el
    this.$data = wueOption.data
    // 初始化
    this._init()
    // 编译
    compiler(this)
  }
  _init() {
    initState(this)
  }
}

export default Wue

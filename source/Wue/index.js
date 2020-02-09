import initWue from './initWue'
// 创建一个 Wue 类
class Wue {
  constructor (wueOption) {
    this.$options = wueOption
    this.$el = wueOption.el
    this.$data = wueOption.data
    // 初始化
    this._init()
  }
  _init() {
    initWue(this)
  }
}

export default Wue

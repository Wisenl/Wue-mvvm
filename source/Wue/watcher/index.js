import Dep from '../dep'
let id = 0
export default class Watcher {
  /**
   * @param vm
   * @param expOrFn exprOrFn 用户可能传入的是一个表达式 也有可能传入的是一个函数
   * @param fn
   * @param opts
   */
  constructor (vm, expOrFn, fn = () => {}, opts = {}) {
    this.vm = vm
    this.expOrFn = expOrFn
    this.options = opts
    this.fn = fn

    this.deps = []
    this.depIds = new Set()

    if (typeof expOrFn === 'function') {
      console.log('set Getter')
      this.getter = expOrFn  // 赋值到getter
    }
    id++
    console.log('id:', id)
    // 执行传入的 expOrFn
    this.get()
  }
  get() {
    console.log('watcher get')
    Dep.pushTarget(this)
    this.getter()
    Dep.popTarget()
  }
  addDep(dep) {
    if (!this.depIds.has(dep.id)) {
      this.depIds.add(dep.id)
      this.deps.push(dep)
      dep.addSub(this)
    }
  }
  update() {
    this.get()
  }
}

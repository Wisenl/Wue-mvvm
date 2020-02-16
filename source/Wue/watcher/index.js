import Dep from '../dep'
import { nextTick } from './nextTick'
import { getWmValue } from '../compiler'

let id = 0
export default class  Watcher {
  /**
   * @param vm
   * @param expOrFn exprOrFn 用户可能传入的是一个表达式 也有可能传入的是一个函数
   * @param fn  watch 传入的回调函数
   * @param opts
   */
  constructor (vm, expOrFn, fn = () => {}, opts = {}) {
    this.id = id++
    this.vm = vm
    this.expOrFn = expOrFn
    this.options = opts
    this.fn = fn
    this.user = !!opts.user
    this.immediate = !!opts.immediate

    this.deps = [] // 保存了当前 watcher 被依赖的 所有 dep 对象，watcher 和 dep 对象互相依赖（必然）
    this.depIds = new Set()

    if (typeof expOrFn === 'function') {
      this.getter = expOrFn  // 赋值到getter
    } else {
      // 如果不是 function, 那么就是用户自定义的 $watch， 传入的是个 $data 属性名。
      this.getter = function () {
        return getWmValue(vm, this.expOrFn)
      }
    }
    // 执行传入的 expOrFn
    this.value = this.get()
    if (this.immediate) {
      this.fn(this.value)
    }
  }
  get() {
    // new watcher 对象时先把它 设置为 target
    Dep.pushTarget(this)
    // 然后执行 update(),渲染页面
    let val = this.getter()
    // 渲染结束后，清空 target
    Dep.popTarget()
    return val
  }
  addDep(dep) {
    // watcher 和 dep 互相依赖
    if (!this.depIds.has(dep.id)) {
      this.depIds.add(dep.id)
      this.deps.push(dep)
      // 收集依赖
      dep.addSub(this)
    }
  }
  update() {
    setQueue(this)
  }
  runGet() {
    let val =this.get()
    if (val !== this.value) {
      // 调用用户定义的callback 传入 newValue, 和 oldValue
      this.fn(val, this.value)
    }
  }
}
// 收集watcher，进行异步更新
let watcherQueue = []
let watcherIds = []
function setQueue (watcher) {
  let id = watcher.id
  if (!watcherIds.includes(id)) {
    watcherIds.push(id)
    watcherQueue.push(watcher)
    nextTick(runQueue)
  }
}

function runQueue () {
  watcherQueue.forEach(watcher => watcher.runGet())
  // 执行完后清空
  watcherIds = []
  watcherQueue = []
}

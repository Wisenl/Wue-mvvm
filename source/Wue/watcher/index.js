import Dep from '../dep'
import { nextTick } from './nextTick'

let id = 0
export default class  Watcher {
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

    this.deps = [] // 保存了当前 watcher 被依赖的 所有 dep 对象，watcher 和 dep 对象互相依赖（必然）
    this.depIds = new Set()

    if (typeof expOrFn === 'function') {
      this.getter = expOrFn  // 赋值到getter
    }
    id++
    // 执行传入的 expOrFn
    this.get()
  }
  get() {
    // new watcher 对象时先把它 设置为 target
    Dep.pushTarget(this)
    // 然后执行 update(),渲染页面
    this.getter()
    // 渲染结束后，清空 target
    Dep.popTarget()
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
    console.log('run')
    this.get()
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

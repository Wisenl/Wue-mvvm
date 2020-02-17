import Dep from '../dep'
import { nextTick } from './nextTick'
import { getWmValue } from '../compiler'

let id = 0
export default class  Watcher {
  /**
   * @param wm
   * @param expOrFn exprOrFn 用户可能传入的是一个表达式 也有可能传入的是一个函数
   * @param fn  watch 传入的回调函数
   * @param opts
   */
  constructor (wm, expOrFn, fn = () => {}, opts = {}) {
    this.id = id++
    this.wm = wm
    this.expOrFn = expOrFn
    this.options = opts
    this.fn = fn
    this.user = !!opts.user
    this.immediate = !!opts.immediate
    this.lazy = opts.lazy
    this.dirty = this.lazy

    this.deps = [] // 保存了当前 watcher 被依赖的 所有 dep 对象，watcher 和 dep 对象互相依赖（必然）
    this.depIds = new Set()

    if (typeof expOrFn === 'function') {
      this.getter = expOrFn  // 赋值到getter
    } else {
      // 如果不是 function, 那么就是用户自定义的 $watch， 传入的是个 $data 属性名。
      this.getter = function () {
        return getWmValue(wm, expOrFn)
      }
    }
    // 执行传入的 expOrFn
    this.value = this.lazy ? undefined : this.get()
    if (this.immediate) {
      this.fn(this.value)
    }
  }
  get() {
    // new watcher 对象时先把它 设置为 target
    Dep.pushTarget(this)
    // 然后执行 update(),渲染页面
    let val = this.getter.call(this.wm)
    // 渲染结束后，清空 target
    Dep.popTarget()
    return val
  }
  evaluate() {
    this.value = this.get()
    this.dirty = false // false 表示此次求过值了，下次直接返回 缓存的 computed 值，
  }
  depend() {
    // 此处 this 为计算属性watcher
    this.deps.forEach(x => { // this.deps 上的值来自此前 调用 getter 时候，求值函数中的data依赖。
      // 此时 target 为 渲染 watcher，但是调用此depend 的不是渲染watcher，而是计算属性watcher
      // 计算watcher把计算属性上的 deps 都再遍历一遍去保存 渲染watcher
      x.depend()
    })
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
    if (this.lazy) {
      // 如果lazy 为true, 那么这个 watcher 是个计算属性，
      // 此时进入了update方法是由于 其依赖data值更新了，触发了update.
      // 那么就需要 把 dirty 设为 true，等会儿重新取计算属性的值。
      this.dirty = true
    } else {
      setQueue(this)
    }
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

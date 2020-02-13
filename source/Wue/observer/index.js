import { interceptArray } from './interceptArray'
import Dep from '../dep'
export default class Observer {
  constructor (data) {
    this.dep = new Dep()  // 为数组数据而设置的 dep
    // 为所有监测的数据设置 __ob__ 属性，内容为 observer 实例

    Object.defineProperty(data, '__ob__', {
      get: () => this
    })
    if (Array.isArray(data)) {
      data.__proto__ = interceptArray() // 使用新的 proto ,上面挂载了 被劫持的特定数组方法
      // 迭代数组元素，使得所有对象都能得到监测
      data.forEach(x => {
        Observer.walk(x) // 递归
      })
    } else if (typeof data === 'object' && data !== null) {
      Object.entries(data).map(([key, val]) => {
        Observer.observe(data, key, val)  // 递归
      })
    }
  }

  static observe(data, key, val) {
    // 获取 数组 值的 observer,上面保存了 它的dep，需要用dep 来存储数组数据的依赖
    let childOb = Observer.walk(val)
    // 每创建一个 需要观察的对象属性， 就创建一个 dep， 这个 dep 会
    // 在 compile 的后执行属性get() 后，把自己添加到 watcher 的 deps 中，
    // 同时也会把 watcher 添加到 自己的 subs 中
    // dep 和 watcher 是发布订阅的关系
    let dep = new Dep()
    Object.defineProperty(data, key, {
      get() {
        if (Dep.target) {
          dep.depend() // 对象数据的依赖存储
          if (childOb) {
            childOb.dep.depend() // 数组数据的依赖存储
          }
        }
        return val
      },
      set(newVal) {
        if (val === newVal) return
        Observer.walk(newVal)  // 对设置的新值，进行监测
        val = newVal
        // 数据更新时，触发dep 中的 watcher.update, 重新渲染
        dep.notify()
      }
    })
  }

  // 过滤非对象、非数组的数据
  static walk(data) {
    if (data && typeof data === 'object') {
      return data.__ob__ || new Observer(data)
    }
  }
}

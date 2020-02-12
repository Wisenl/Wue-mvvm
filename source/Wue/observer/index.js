import { interceptArray } from './interceptArray'
import Dep from '../dep'
export default class Observer {
  constructor (data) {
    Observer.walk(data)
  }

  static observe(data, key, val) {
    Observer.walk(val)
    // 每创建一个 需要观察的对象属性， 就创建一个 dep， 这个 dep 会
    // 在 compile 的后执行属性get() 后，把自己添加到 watcher 的 deps 中，
    // 同时也会把 watcher 添加到 自己的 subs 中
    // dep 和 watcher 是发布订阅的关系
    let dep = new Dep()
    Object.defineProperty(data, key, {
      get() {
        if (Dep.target) {
          dep.depend()
        }
        console.log('取值')
        return val
      },
      set(newVal) {
        if (val === newVal) return
        console.log('设值')
        Observer.walk(newVal)  // 对设置的新值，进行监测
        val = newVal
        // 数据更新时，触发dep 中的 watcher.update, 重新渲染
        dep.notify()
      }
    })
  }


  static walk(data) {
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
}

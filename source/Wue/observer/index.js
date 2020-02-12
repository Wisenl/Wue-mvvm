import { interceptArray } from './interceptArray'
export default class Observer {
  constructor (data) {
    Observer.walk(data)
  }

  static observe(data, key, val) {
    Observer.walk(val)
    Object.defineProperty(data, key, {
      get() {
        console.log('取值')
        return val
      },
      set(newVal) {
        if (val === newVal) return
        console.log('设值')
        Observer.walk(newVal)  // 对设置的新值，进行监测
        val = newVal
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

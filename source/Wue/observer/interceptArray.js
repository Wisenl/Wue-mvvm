import Observer from './index'
export function interceptArray () {
  // 对这七个方法进行拦截
  const interceptMethodsName = [
    'push',
    'shift',
    'unshift',
    'pop',
    'splice',
    'reverse',
    'sort'
  ]
  let interceptProto = Object.create(Array.prototype) // 复制一份 Array 原型

  interceptMethodsName.forEach(methodsName => {
    // 劫持该方法
    interceptProto[methodsName] = function (...args) {
      // 插入 自定义 代码

      // 如果 数组新增的元素也为对象，就也要进行监测
      if (['push', 'unshift', 'splice'].includes(methodsName)) {
        let inserts
        if (methodsName === 'splice') {
          inserts = args.slice(2)
        } else {
          inserts = args
        }
        Observer.walk(inserts)
      }
      // 返回
      let res = Array.prototype[methodsName].call(this, ...args)
      this.__ob__.dep.notify()
      return res
    }
  })
  return interceptProto
}

export function deepArrayDepend (arr) {
  if (Array.isArray(arr)) {
    arr.forEach(item => {
      item.__ob__ && item.__ob__.dep.depend()
      deepArrayDepend(item)
    })
  }
}
